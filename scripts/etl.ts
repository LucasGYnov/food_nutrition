import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config({ path: '.env.local' });

async function runETL() {
  const mongoClient = new MongoClient(process.env.MONGODB_URI!);
  const sqlite = new Database('sqlite.db');
  sqlite.pragma('foreign_keys = ON');

  try {
    await mongoClient.connect();
    const enrichedDocs = await mongoClient
      .db(process.env.MONGODB_DB)
      .collection('enriched_products')
      .find()
      .toArray();

    console.log(`Extraction de ${enrichedDocs.length} produits...`);

    // 1. Schéma corrigé (barcode_id n'est plus UNIQUE dans products)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_id TEXT UNIQUE,
        name TEXT,
        nutriscore TEXT,
        health_score REAL,
        is_ultra_processed INTEGER,
        image_url TEXT,
        brand_id INTEGER,
        category_id INTEGER,
        barcode_id INTEGER, -- Contrainte UNIQUE supprimée ici
        FOREIGN KEY (brand_id) REFERENCES brands(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (barcode_id) REFERENCES barcodes(id)
      );

      CREATE TABLE IF NOT EXISTS nutriments (
        product_id INTEGER PRIMARY KEY,
        calories REAL, fat REAL, sugars REAL, proteins REAL, salt REAL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // Vidage pour repartir propre
    sqlite.exec(`DELETE FROM nutriments; DELETE FROM products; DELETE FROM brands; DELETE FROM categories; DELETE FROM barcodes;`);

    // 2. Requêtes préparées
    const insertBrand = sqlite.prepare('INSERT OR IGNORE INTO brands (name) VALUES (?)');
    const getBrand = sqlite.prepare('SELECT id FROM brands WHERE name = ?');
    const insertCategory = sqlite.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    const getCategory = sqlite.prepare('SELECT id FROM categories WHERE name = ?');
    const insertBarcode = sqlite.prepare('INSERT OR IGNORE INTO barcodes (code) VALUES (?)');
    const getBarcode = sqlite.prepare('SELECT id FROM barcodes WHERE code = ?');

    const insertProduct = sqlite.prepare(`
      INSERT INTO products (raw_id, name, nutriscore, health_score, is_ultra_processed, image_url, brand_id, category_id, barcode_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertNutriments = sqlite.prepare(`
      INSERT INTO nutriments (product_id, calories, fat, sugars, proteins, salt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // 3. Transaction
    const runTransfer = sqlite.transaction((docs) => {
      for (const p of docs) {
        // Marque
        const brandName = p.brand || "Marque inconnue";
        insertBrand.run(brandName);
        const brandId = (getBrand.get(brandName) as any).id;

        // Catégorie
        const catName = p.category_label || "Autre";
        insertCategory.run(catName);
        const categoryId = (getCategory.get(catName) as any).id;

        // Barcode (Gestion du null et de l'existant)
        let barcodeId = null;
        if (p.code && p.code.trim() !== "") {
          insertBarcode.run(p.code);
          const res = getBarcode.get(p.code) as any;
          if (res) barcodeId = res.id;
        }

        // Produit
        const productResult = insertProduct.run(
          p.raw_id,
          p.product_name || "Inconnu",
          p.nutriscore,
          p.internal_health_score,
          p.is_ultra_processed ? 1 : 0,
          p.image_url,
          brandId,
          categoryId,
          barcodeId
        );

        // Nutriments
        if (p.nutriments) {
          insertNutriments.run(
            productResult.lastInsertRowid,
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
    console.log("✅ ETL réussi : Fragmentation barcodes effectuée.");

  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await mongoClient.close();
    sqlite.close();
  }
}

runETL();