'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProductTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?${searchParams.toString()}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setPagination(res.pagination);
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) return <div className="text-center py-10">Chargement des données...</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Marque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nutriscore</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score Interne</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="h-10 w-10 object-cover rounded" />
                    )}
                  {p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {p.nutriscore ? (
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${getNutriColor(p.nutriscore)}`}>
                        {p.nutriscore.toUpperCase()}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-200 rounded">N/A</span>
                    )}
                    {/* <span className="text-sm font-medium">{p.name}</span> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{p.healthScore}/100</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => router.push(`/dashboard/${p.id}`)} className="text-blue-600 hover:text-blue-900">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-2">
        <span className="text-sm text-slate-500">Page {pagination.page} sur {pagination.totalPages}</span>
        <div className="space-x-2">
          <button 
            disabled={pagination.page <= 1}
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set('page', (pagination.page - 1).toString());
              router.push(`?${p.toString()}`);
            }}
            className="px-4 py-2 border rounded disabled:opacity-50"
          > Précédent </button>
          <button 
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set('page', (pagination.page + 1).toString());
              router.push(`?${p.toString()}`);
            }}
            className="px-4 py-2 border rounded disabled:opacity-50"
          > Suivant </button>
        </div>
      </div>
    </div>
  );
}

function getNutriColor(score: string) {
  switch(score) {
    case 'A': return 'bg-green-600';
    case 'B': return 'bg-green-400';
    case 'C': return 'bg-yellow-400';
    case 'D': return 'bg-orange-400';
    case 'E': return 'bg-red-600';
    default: return 'bg-slate-400';
  }
}