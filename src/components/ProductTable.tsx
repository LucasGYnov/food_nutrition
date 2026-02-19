'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  TableCellsIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductTable() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>({});
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNutriscore, setSelectedNutriscore] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Chargement des données
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?${searchParams.toString()}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setFilteredData(res.data);
        setPagination(res.pagination);
        setLoading(false);
      });
  }, [searchParams]);

  // Filtrage et tri
  useEffect(() => {
    let result = [...data];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(term) || 
        p.brand?.toLowerCase().includes(term)
      );
    }

    // Filtre par nutriscore
    if (selectedNutriscore.length > 0) {
      result = result.filter(p => selectedNutriscore.includes(p.nutriscore));
    }

    // Tri
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(result);
  }, [data, searchTerm, selectedNutriscore, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedNutriscore([]);
  };

  const getNutriColor = (score: string) => {
    switch(score?.toUpperCase()) {
      case 'A': return 'bg-emerald-500';
      case 'B': return 'bg-green-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <SparklesIcon className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-slate-600 font-medium">Chargement de vos produits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec titre et stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catalogue produits</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredData.length} produit{filteredData.length > 1 ? 's' : ''} affiché{filteredData.length > 1 ? 's' : ''}
            {filteredData.length !== data.length && ` sur ${data.length} total`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Vue toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'table' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <TableCellsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un produit ou une marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>
          
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-xl flex items-center gap-2 transition-all ${
              showFilters || selectedNutriscore.length > 0
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Filtres</span>
            {selectedNutriscore.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedNutriscore.length}
              </span>
            )}
          </button> */}

          {(searchTerm || selectedNutriscore.length > 0) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          )}
        </div>

        {/* Panneau filtres nutriscore */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-3">Filtrer par Nutriscore</p>
                <div className="flex flex-wrap gap-2">
                  {['A', 'B', 'C', 'D', 'E'].map((score) => (
                    <button
                      key={score}
                      onClick={() => {
                        setSelectedNutriscore(prev =>
                          prev.includes(score)
                            ? prev.filter(s => s !== score)
                            : [...prev, score]
                        );
                      }}
                      className={`
                        px-4 py-2 rounded-lg font-semibold text-white transition-all
                        ${getNutriColor(score)}
                        ${selectedNutriscore.includes(score) 
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' 
                          : 'opacity-50 hover:opacity-100'
                        }
                      `}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vue Tableau */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    Produit
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('brand')}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    Marque
                    {sortConfig.key === 'brand' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('nutriscore')}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    Nutriscore
                    {sortConfig.key === 'nutriscore' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('healthScore')}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    Score santé
                    {sortConfig.key === 'healthScore' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <AnimatePresence>
                  {filteredData.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <span className="text-xs text-slate-400">📷</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.brand || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {product.nutriscore ? (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold ${getNutriColor(product.nutriscore)}`}>
                            {product.nutriscore}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.healthScore !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${getScoreColor(product.healthScore)}`}>
                              {product.healthScore}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  product.healthScore >= 60 ? 'bg-green-500' :
                                  product.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${product.healthScore}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => router.push(`/dashboard/${product.id}`)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>Détails</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-600 font-medium">Aucun produit trouvé</p>
              <p className="text-sm text-slate-400 mt-1">Essayez de modifier vos filtres</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vue Grille */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredData.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-blue-200 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-4xl text-slate-300">📦</span>
                    </div>
                  )}
                  {product.nutriscore && (
                    <span className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-lg text-white font-bold shadow-lg ${getNutriColor(product.nutriscore)}`}>
                      {product.nutriscore}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{product.brand || 'Marque inconnue'}</p>

                  {product.healthScore !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Score santé</span>
                        <span className={`font-bold ${getScoreColor(product.healthScore)}`}>
                          {product.healthScore}/100
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            product.healthScore >= 60 ? 'bg-green-500' :
                            product.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${product.healthScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => router.push(`/dashboard/${product.id}`)}
                    className="w-full py-2.5 bg-slate-50 text-slate-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Voir détails
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-slate-500">
            Page {pagination.page} sur {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set('page', (pagination.page - 1).toString());
                router.push(`?${p.toString()}`);
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Précédent
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set('page', (pagination.page + 1).toString());
                router.push(`?${p.toString()}`);
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
            >
              Suivant
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}