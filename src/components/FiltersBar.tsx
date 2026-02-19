'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value); else params.delete(name);
    params.set('page', '1'); // Reset la page si on change un filtre
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
      {/* Filtre 1: Recherche Nom */}
      <input 
        type="text" 
        placeholder="Rechercher un produit..."
        className="p-2 border rounded"
        onChange={(e) => updateFilter('search', e.target.value)}
      />

      {/* Filtre 2: Marque */}
      <input 
        type="text" 
        placeholder="Marque (ex: Ferrero)"
        className="p-2 border rounded"
        onChange={(e) => updateFilter('brand', e.target.value)}
      />

      {/* Filtre 3: Nutriscore */}
      <select 
        className="p-2 border rounded"
        onChange={(e) => updateFilter('nutriscore', e.target.value)}
      >
        <option value="">Tous les Nutriscores</option>
        {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Filtre 4: Catégorie */}
      <select 
        className="p-2 border rounded"
        onChange={(e) => updateFilter('category', e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        <option value="Snacks">Snacks</option>
        <option value="Beverages">Boissons</option>
        <option value="Dairies">Produits laitiers</option>
      </select>
    </div>
  );
}