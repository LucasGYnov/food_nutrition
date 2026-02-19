// scripts/collect.ts
import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

// Chargement des variables d'environnement (.env.local)
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

async function collectData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connexion à MongoDB réussie !");
    const db = client.db(dbName);
    const collection = db.collection('raw_products');

    let totalFetched = 0;
    const target = 300;
    const pageSize = 100; // On demande 100 produits par page

    for (let page = 1; totalFetched < target; page++) {
      console.log(`Récupération de la page ${page}...`);
      
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&page_size=${pageSize}&page=${page}`
      );
      const data = await response.json();

      if (!data.products || data.products.length === 0) break;

      const operations = data.products.map((item: any) => {
        const raw_hash = crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex');
        
        return {
          updateOne: {
            filter: { raw_hash: raw_hash },
            update: { 
              $set: {
                source: "OpenFoodFacts",
                fetched_at: new Date().toISOString(),
                raw_hash,
                payload: item
              }
            },
            upsert: true
          }
        };
      });

      await collection.bulkWrite(operations);
      totalFetched += data.products.length;
      console.log(`${totalFetched} produits enregistrés au total.`);
    }

    console.log("Collecte terminée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la collecte :", error);
  } finally {
    await client.close();
  }
}

collectData();