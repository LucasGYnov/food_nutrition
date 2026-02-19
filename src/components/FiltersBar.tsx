'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  TagIcon,
  CubeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Récupérer les filtres actifs depuis l'URL
  useEffect(() => {
    const filters: string[] = [];
    if (searchParams.get('search')) filters.push('search');
    if (searchParams.get('brand')) filters.push('brand');
    if (searchParams.get('nutriscore')) filters.push('nutriscore');
    if (searchParams.get('category')) filters.push('category');
    setActiveFilters(filters);
  }, [searchParams]);

  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const clearFilter = (name: string) => {
    updateFilter(name, '');
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const getNutriColor = (score: string) => {
    switch(score) {
      case 'A': return 'bg-emerald-500';
      case 'B': return 'bg-green-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header des filtres avec compteur */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FunnelIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Filtres avancés</h2>
            <p className="text-xs text-slate-500">
              {activeFilters.length} filtre{activeFilters.length > 1 ? 's' : ''} actif{activeFilters.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronDownIcon 
            className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {/* Filtres actifs (pills) */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {searchParams.get('search') && (
              <motion.span
                layout
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
              >
                <MagnifyingGlassIcon className="w-3 h-3" />
                Recherche: {searchParams.get('search')}
                <button
                  onClick={() => clearFilter('search')}
                  className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.span>
            )}

            {searchParams.get('brand') && (
              <motion.span
                layout
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200"
              >
                <TagIcon className="w-3 h-3" />
                Marque: {searchParams.get('brand')}
                <button
                  onClick={() => clearFilter('brand')}
                  className="ml-1 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.span>
            )}

            {searchParams.get('nutriscore') && (
              <motion.span
                layout
                className={`inline-flex items-center gap-1 px-3 py-1 text-white rounded-full text-sm ${
                  getNutriColor(searchParams.get('nutriscore')!)
                }`}
              >
                <SparklesIcon className="w-3 h-3" />
                Nutriscore: {searchParams.get('nutriscore')}
                <button
                  onClick={() => clearFilter('nutriscore')}
                  className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.span>
            )}

            {searchParams.get('category') && (
              <motion.span
                layout
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200"
              >
                <CubeIcon className="w-3 h-3" />
                Catégorie: {searchParams.get('category')}
                <button
                  onClick={() => clearFilter('category')}
                  className="ml-1 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.span>
            )}

            {activeFilters.length > 1 && (
              <motion.button
                layout
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                Tout effacer
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille de filtres */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        animate={{ 
          height: isExpanded ? 'auto' : 'auto',
          opacity: 1
        }}
      >
        {/* Filtre Recherche */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </motion.div>

        {/* Filtre Marque */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Marque (ex: Ferrero)"
            defaultValue={searchParams.get('brand') || ''}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
          />
        </motion.div>

        {/* Filtre Nutriscore */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <select
            defaultValue={searchParams.get('nutriscore') || ''}
            onChange={(e) => updateFilter('nutriscore', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="">Tous les Nutriscores</option>
            {['A', 'B', 'C', 'D', 'E'].map(score => (
              <option key={score} value={score} className="flex items-center">
                Nutriscore {score}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
          </div>

          {/* Aperçu des couleurs Nutriscore */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex gap-0.5">
            {['A', 'B', 'C', 'D', 'E'].map(score => (
              <div
                key={score}
                className={`w-1.5 h-1.5 rounded-full ${getNutriColor(score)} ${
                  searchParams.get('nutriscore') === score ? 'scale-125' : 'opacity-30'
                } transition-all`}
              />
            ))}
          </div>
        </motion.div>

        {/* Filtre Catégorie */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <CubeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <select
            defaultValue={searchParams.get('category') || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="">Toutes les catégories</option>
            <option value="Snacks">🍪 Snacks</option>
            <option value="Beverages">🥤 Boissons</option>
            <option value="Dairies">🥛 Produits laitiers</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
          </div>
        </motion.div>
      </motion.div>

      {/* Statistiques rapides (optionnel) */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
          >
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              <span>
                {activeFilters.length === 1 && "Un filtre est actif"}
                {activeFilters.length === 2 && "Deux filtres sont actifs"}
                {activeFilters.length >= 3 && `${activeFilters.length} filtres sont actifs`}
                {activeFilters.length > 0 && " — Les résultats sont personnalisés"}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}