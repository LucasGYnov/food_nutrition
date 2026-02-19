import { describe, it, expect } from 'vitest';
import { mapMongoToSql } from '../lib/logic';

describe('Tests Unitaires - Logique Métier', () => {
  it('Mapping ETL: doit transformer correctement un objet Mongo en objet SQL', () => {
    const fakeMongoEnriched = {
      raw_id: "697c722e752e7f5e77d0fda9",
      code: "6111035000430",
      product_name: "Sidi Ali",
      brand: "سيدي علي",
      nutriscore: "a",
      internal_health_score: 90,
      is_ultra_processed: false,
      image_url: "https://example.com/image.jpg"
    };

    const mapped = mapMongoToSql(fakeMongoEnriched);

    expect(mapped.rawId).toBe("697c722e752e7f5e77d0fda9");
    expect(mapped.code).toBe("6111035000430");
    expect(mapped.name).toBe("Sidi Ali");
    expect(mapped.nutriscore).toBe("A");
    expect(mapped.healthScore).toBe(90);
    expect(mapped.imageUrl).toBe("https://example.com/image.jpg");
  });
});