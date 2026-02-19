import { describe, it, expect } from 'vitest';
import { mapMongoToSql } from '../lib/logic';

describe('Étape 7 - Pipeline complet sur échantillon', () => {
  it('doit transformer les données réelles MongoDB vers le format SQL', () => {
    const mockRawData = [
      {
        raw_id: "697c722e752e7f5e77d0fda9",
        product_name: "Sidi Ali",
        brand: "سيدي علي",
        nutriscore: "A",
        internal_health_score: 90,
        is_ultra_processed: false,
        image_url: "https://images.openfoodfacts.org/..."
      }
    ];

    const result = mapMongoToSql(mockRawData[0]);

    expect(result.name).toBe("Sidi Ali");
    expect(result.healthScore).toBe(90);
    expect(result.nutriscore).toBe("A");
    expect(result).toHaveProperty('imageUrl');
  });
});