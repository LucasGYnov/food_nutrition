import { describe, it, expect } from 'vitest';

describe('Étape 7 - Tests d’intégration', () => {
  it('API: GET /api/stats doit retourner les agrégations SQL', async () => {
    const response = await fetch('http://localhost:3000/api/stats');
    const stats = await response.json();
    
    expect(response.status).toBe(200);
    expect(stats.global.total).toBeGreaterThan(0);
  });

  it('SQL: GET /api/products/301 doit retourner Sidi Ali', async () => {
    const response = await fetch('http://localhost:3000/api/products/301');
    const product = await response.json();
    
    expect(response.status).toBe(200);
    expect(product.name).toContain("Sidi Ali");
  });
});