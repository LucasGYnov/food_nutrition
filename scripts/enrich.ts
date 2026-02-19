import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

// Calcul d'un score interne sur 100
function calculateInternalScore(nutriscore: string, novaGroup: number): number {
  let score = 50; // Base
  
  // Bonus/Malus Nutriscore
  const scores: Record<string, number> = { 'A': 40, 'B': 25, 'C': 5, 'D': -15, 'E': -30 };
  score += scores[nutriscore.toUpperCase()] || 0;

  // Malus produit ultra-transformé (NOVA 4)
  if (novaGroup === 4) score -= 20;
  if (novaGroup === 1) score += 10;

  return Math.max(0, Math.min(100, score));
}

// Normalisation des catégories
function simplifyCategory(tags: string[]): string {
  if (!tags || tags.length === 0) return "Autre";
  const mainTag = tags[0].replace('en:', '').replace(/-/g, ' ');
  return mainTag.charAt(0).toUpperCase() + mainTag.slice(1);
}

async function enrichData() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const rawDocs = await db.collection('raw_products').find().toArray();

    const enrichedDocs = rawDocs.map((doc) => {
      const p = doc.payload;
      const nGrade = p.nutriscore_grade || 'unknown';
      const nova = parseInt(p.nova_group) || 0;

      return {
        raw_id: doc._id.toString(),
        product_name: p.product_name || "Inconnu",
        brand: p.brands ? p.brands.split(',')[0].trim() : "Marque inconnue",
        nutriscore: nGrade.toUpperCase(),
        category_label: simplifyCategory(p.categories_tags),
        internal_health_score: calculateInternalScore(nGrade, nova),
        is_ultra_processed: nova === 4,
        image_url: p.image_url || "",
        processed_at: new Date().toISOString()
      };
    });

    await db.collection('enriched_products').deleteMany({});
    await db.collection('enriched_products').insertMany(enrichedDocs);

    console.log(`${enrichedDocs.length} produits enrichis avec succès !`);
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await client.close();
  }
}

enrichData();