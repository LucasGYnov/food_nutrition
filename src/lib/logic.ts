export function simplifyCategory(tags: string[]): string {
  if (!tags || tags.length === 0) return "Autre";
  const mainTag = tags[0].replace('en:', '').replace(/-/g, ' ');
  return mainTag.charAt(0).toUpperCase() + mainTag.slice(1);
}

export function calculateInternalScore(nutriscore: string, novaGroup: number): number {
  let score = 50;
  const scores: Record<string, number> = { 'A': 40, 'B': 25, 'C': 5, 'D': -15, 'E': -30 };
  score += scores[nutriscore.toUpperCase()] || 0;
  if (novaGroup === 4) score -= 20;
  return Math.max(0, Math.min(100, score));
}

// src/lib/logic.ts
export function mapMongoToSql(mongoDoc: any) {
  return {
    rawId: mongoDoc.raw_id || mongoDoc._id.toString(),
    name: mongoDoc.product_name || "Inconnu",
    brand: mongoDoc.brand || "Inconnue",
    nutriscore: (mongoDoc.nutriscore || "unknown").toUpperCase(),
    healthScore: mongoDoc.internal_health_score || 0,
    isUltraProcessed: mongoDoc.is_ultra_processed ?? false,
    imageUrl: mongoDoc.image_url || ""
  };
}