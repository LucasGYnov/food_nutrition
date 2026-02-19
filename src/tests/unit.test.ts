import { describe, it, expect } from 'vitest';
import { simplifyCategory, calculateInternalScore, mapMongoToSql } from '../lib/logic';

describe('Tests Unitaires - Logique Métier', () => {
  

  it('Mapping ETL: doit transformer correctement un objet Mongo en objet SQL', () => {
    const fakeMongoEnriched = {
      _id: { toString: () => "123" },
      raw_id: "697c722e752e7f5e77d0fda9",
      product_name: "Sidi Ali",
      brand: "سيدي علي",
      nutriscore: "a",
      internal_health_score: 90,
      is_ultra_processed: false,
      image_url: "https://example.com/image.jpg"
    };

    const mapped = mapMongoToSql(fakeMongoEnriched);

    expect(mapped.rawId).toBe("697c722e752e7f5e77d0fda9");
    expect(mapped.name).toBe("Sidi Ali");
    expect(mapped.nutriscore).toBe("A");
    expect(mapped.healthScore).toBe(90);
  });
});