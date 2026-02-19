'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues de l'API:", data);
        setProduct(data);
      });
  }, [id]);

  if (!product) return <div className="p-10 text-center">Chargement des détails...</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 bg-slate-50 rounded-lg p-4 flex items-center justify-center">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-h-64 object-contain" />
            ) : (
              <div className="text-slate-400">Pas d'image disponible</div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">{product.name || 'Nom inconnu'}</h1>
            <p className="text-xl text-slate-500">{product.brand || 'Marque non spécifiée'}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <span className="block text-sm text-blue-600 font-semibold uppercase">Nutriscore</span>
                <span className="text-3xl font-bold">{product.nutriscore || 'N/A'}</span>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <span className="block text-sm text-orange-600 font-semibold uppercase">Health Score</span>
                <span className="text-3xl font-bold">{product.healthScore || 0}/100</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <p className="text-slate-700"><strong>Catégorie:</strong> {product.category || 'Non classé'}</p>
              <p className="text-slate-700"><strong>Transformation:</strong> {product.isUltraProcessed ? '🔴 Ultra-transformé (NOVA 4)' : '🟢 Produit brut ou peu transformé'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}