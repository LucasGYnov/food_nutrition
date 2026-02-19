import { MongoClient } from 'mongodb';
import { dbSql } from '../src/lib/sqlite';
import { products } from '../src/lib/schema';
import * as dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config({ path: '.env.local' });

async function runETL() {
  const mongoClient = new MongoClient(process.env.MONGODB_URI!);
  
  try {
    // 1. Connexion Mongo & Récupération
    await mongoClient.connect();
    const enrichedDocs = await mongoClient
      .db(process.env.MONGODB_DB)
      .collection('enriched_products')
      .find()
      .toArray();

    console.log(`Extraction de ${enrichedDocs.length} produits de MongoDB...`);

    // 2. Préparation SQLite (on crée la table si elle n'existe pas)
    const sqlite = new Database('sqlite.db');
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_id TEXT,
        name TEXT,
        brand TEXT,
        nutriscore TEXT,
        category TEXT,
        health_score REAL,
        is_ultra_processed INTEGER,
        image_url TEXT
      )
    `);

    // 3. Vidage de la table SQL pour repartir à propre (Logique ETL standard)
    sqlite.prepare('DELETE FROM products').run();

    // 4. Insertion dans SQLite
    const insertStmt = sqlite.prepare(`
      INSERT INTO products (raw_id, name, brand, nutriscore, category, health_score, is_ultra_processed, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = sqlite.transaction((data) => {
      for (const p of data) {
        insertStmt.run(
          p.raw_id,
          p.product_name,
          p.brand,
          p.nutriscore,
          p.category_label,
          p.internal_health_score,
          p.is_ultra_processed ? 1 : 0,
          p.image_url
        );
      }
    });

    transaction(enrichedDocs);
    console.log("Chargement dans SQLite terminé avec succès !");

  } catch (error) {
    console.error("❌ Erreur ETL :", error);
  } finally {
    await mongoClient.close();
  }
}

runETL();