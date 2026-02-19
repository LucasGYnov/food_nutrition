import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config({ path: '.env.local' });

async function runETL() {
  const mongoClient = new MongoClient(process.env.MONGODB_URI!);
  const sqlite = new Database('sqlite.db');
  
  // Activer les clés étrangères
  sqlite.pragma('foreign_keys = ON');

  try {
    await mongoClient.connect();
    const enrichedDocs = await mongoClient
      .db(process.env.MONGODB_DB)
      .collection('enriched_products')
      .find()
      .toArray();

    console.log(`Extraction de ${enrichedDocs.length} produits de MongoDB...`);

    // 1. Création des tables relationnelles
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_id TEXT UNIQUE,
        code TEXT,
        name TEXT,
        nutriscore TEXT,
        health_score REAL,
        is_ultra_processed INTEGER,
        image_url TEXT,
        brand_id INTEGER,
        category_id INTEGER,
        FOREIGN KEY (brand_id) REFERENCES brands(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS nutriments (
        product_id INTEGER PRIMARY KEY,
        calories REAL,
        fat REAL,
        sugars REAL,
        proteins REAL,
        salt REAL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // Optionnel : Vidage propre pour relancer le script à zéro
    sqlite.exec(`
      DELETE FROM nutriments;
      DELETE FROM products;
      DELETE FROM brands;
      DELETE FROM categories;
    `);

    // 2. Préparation des requêtes
    const insertBrand = sqlite.prepare('INSERT OR IGNORE INTO brands (name) VALUES (?)');
    const getBrand = sqlite.prepare('SELECT id FROM brands WHERE name = ?');
    
    const insertCategory = sqlite.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    const getCategory = sqlite.prepare('SELECT id FROM categories WHERE name = ?');

    const insertProduct = sqlite.prepare(`
      INSERT INTO products (raw_id, code, name, nutriscore, health_score, is_ultra_processed, image_url, brand_id, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertNutriments = sqlite.prepare(`
      INSERT INTO nutriments (product_id, calories, fat, sugars, proteins, salt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // 3. Transaction : Exécution rapide et sécurisée
    const runTransfer = sqlite.transaction((docs) => {
      for (const p of docs) {
        // 1. Marque
        insertBrand.run(p.brand);
        const brandRow = getBrand.get(p.brand) as { id: number }; // Assertion
        const brandId = brandRow.id;

        // 2. Catégorie
        insertCategory.run(p.category_label);
        const categoryRow = getCategory.get(p.category_label) as { id: number };
        const categoryId = categoryRow.id;

        // 3. Produit
        const productResult = insertProduct.run(
          p.raw_id,
          p.code,
          p.product_name,
          p.nutriscore,
          p.internal_health_score,
          p.is_ultra_processed ? 1 : 0,
          p.image_url,
          brandId,
          categoryId
        );

        const newProductId = productResult.lastInsertRowid;

        // 4. Nutriments
        if (p.nutriments) {
          insertNutriments.run(
            newProductId,
            p.nutriments.energy_kcal,
            p.nutriments.fat,
            p.nutriments.sugars,
            p.nutriments.proteins,
            p.nutriments.salt
          );
        }
      }
    });

    runTransfer(enrichedDocs);
    console.log("✅ Chargement relationnel dans SQLite terminé avec succès !");

  } catch (error) {
    console.error("❌ Erreur ETL SQLite :", error);
  } finally {
    await mongoClient.close();
    sqlite.close();
  }
}

runETL();