import { describe, it, expect } from 'vitest';

describe('Étape 7 - Tests d’intégration', () => {
  it('API: GET /api/stats doit retourner les agrégations SQL', async () => {
    const response = await fetch('http://localhost:3000/api/stats');
    const stats = await response.json();
    
    expect(response.status).toBe(200);
    expect(stats.global.total).toBeGreaterThan(0);
    expect(stats.topCategories).toBeInstanceOf(Array);
  });

  it('SQL: Récupération dynamique et détails d’un produit', async () => {
    const listRes = await fetch('http://localhost:3000/api/products?search=Sidi%20Ali');
    const listData = await listRes.json();
    const targetProduct = listData.data[0];

    expect(targetProduct.name).toContain("Sidi Ali");

    const response = await fetch(`http://localhost:3000/api/products/${targetProduct.id}`);
    const product = await response.json();
    
    expect(response.status).toBe(200);
    expect(product.name).toContain("Sidi Ali");
    expect(product).toHaveProperty('healthScore');
    expect(product).toHaveProperty('brand'); 
    expect(product).toHaveProperty('imageUrl');
  });
});