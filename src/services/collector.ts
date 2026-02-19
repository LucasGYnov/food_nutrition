import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

export async function runCollection() {
  // On demande 300 produits d'un coup (OpenFoodFacts le permet via page_size)
  const response = await fetch(
    "https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&page_size=300&page=1"
  );
  const resultApi = await response.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const rawCollection = db.collection('raw_products');

  const operations = resultApi.products.map((item: any) => {
    // 1. On crée le hash du produit brut pour l'idempotence (exigence TP)
    const raw_hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(item))
      .digest('hex');

    // 2. On mappe vers la structure OBLIGATOIRE du TP
    const doc = {
      source: "OpenFoodFacts",
      fetched_at: new Date().toISOString(),
      raw_hash: raw_hash,
      payload: item // On garde TOUT le produit ici
    };

    return {
      updateOne: {
        filter: { raw_hash: raw_hash }, // Si le hash existe déjà, on ne crée pas de doublon
        update: { $set: doc },
        upsert: true
      }
    };
  });

  const result = await rawCollection.bulkWrite(operations);
  return {
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
    total: resultApi.products.length
  };
}