import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config({ path: '.env.local' });

async function runETL() {
  const mongoClient = new MongoClient(process.env.MONGODB_URI!);
  const sqlite = new Database('sqlite.db');
  
  // Activation des contraintes d'intégrité référentielle
  sqlite.pragma('foreign_keys = ON');

  try {
    await mongoClient.connect();
    const enrichedDocs = await mongoClient
      .db(process.env.MONGODB_DB)
      .collection('enriched_products')
      .find()
      .toArray();

    console.log(`Extraction de ${enrichedDocs.length} produits de MongoDB...`);

    // 1. Création du schéma (Code réintégré dans products)
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
        code TEXT, -- QR Code / Code-barres réintégré ici
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

    // Nettoyage pour repartir sur une base propre
    sqlite.exec(`
      DELETE FROM nutriments;
      DELETE FROM products;
      DELETE FROM brands;
      DELETE FROM categories;
    `);

    // 2. Préparation des requêtes SQL
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

    // 3. Exécution de la transaction
    const runTransfer = sqlite.transaction((docs) => {
      for (const p of docs) {
        // Gestion de la Marque
        const brandName = p.brand || "Marque inconnue";
        insertBrand.run(brandName);
        const brandId = (getBrand.get(brandName) as any).id;

        // Gestion de la Catégorie
        const categoryName = p.category_label || "Non classé";
        insertCategory.run(categoryName);
        const categoryId = (getCategory.get(categoryName) as any).id;

        // Insertion du Produit (avec le champ code)
        const productResult = insertProduct.run(
          p.raw_id,
          p.code || null,
          p.product_name || "Nom inconnu",
          p.nutriscore || "UNKNOWN",
          p.internal_health_score || 0,
          p.is_ultra_processed ? 1 : 0,
          p.image_url || null,
          brandId,
          categoryId
        );

        const newProductId = productResult.lastInsertRowid;

        // Insertion des Nutriments
        if (p.nutriments) {
          insertNutriments.run(
            newProductId,
            p.nutriments.energy_kcal || 0,
            p.nutriments.fat || 0,
            p.nutriments.sugars || 0,
            p.nutriments.proteins || 0,
            p.nutriments.salt || 0
          );
        }
      }
    });

    runTransfer(enrichedDocs);
    console.log("ETL réussi : Données chargées avec succès (Code inclus dans Products).");

  } catch (error) {
    console.error("Erreur lors de l'ETL :", error);
  } finally {
    await mongoClient.close();
    sqlite.close();
  }
}

runETL();