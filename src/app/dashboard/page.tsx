'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsGrid from '@/components/StatsGrid';
import ProductTable from '@/components/ProductTable';
import FiltersBar from '@/components/FiltersBar';
import { 
  ChartBarIcon, 
  TableCellsIcon,
  ArrowPathIcon,
  BellAlertIcon,
  DocumentArrowDownIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable'>('comfortable');

  // Simulation de rafraîchissement
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header avec fond amélioré */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            {/* Titre et sous-titre */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Analyse Nutritionnelle
                </h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  Dashboard
                </span>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl">
                Visualisez et analysez la qualité nutritionnelle de vos produits en temps réel
              </p>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-3">
              {/* Indicateur de dernière mise à jour */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                <span className="text-sm text-white/90">
                  {/* {isRefreshing ? 'Mise à jour...' : `Mis à jour ${lastUpdate.toLocaleTimeString()}`} */}
                </span>
              </div>

              {/* Bouton rafraîchir */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              {/* Bouton exporter */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              >
                <DocumentArrowDownIcon className="w-5 h-5 text-white" />
              </motion.button>

              {/* Bouton notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors relative"
              >
                <BellAlertIcon className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  3
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Breadcrumb et navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-sm text-blue-200 mt-4"
          >
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-white font-medium">Produits</span>
          </motion.div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Bloc Statistiques */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Aperçu statistique</h2>
              </div>
              
              {/* Sélecteur de période (optionnel) */}
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Cette semaine</option>
                <option>Ce mois</option>
                <option>Cette année</option>
              </select>
            </div>
            <StatsGrid />
          </motion.div>

          {/* Section produits avec filtres */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* En-tête de section */}
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TableCellsIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Catalogue produits
                      </h2>
                      <p className="text-sm text-slate-500">
                        Gérez et filtrez vos produits nutritionnels
                      </p>
                    </div>
                  </div>

                  {/* Contrôles d'affichage */}
                  <div className="flex items-center gap-3">
                    {/* Vue compacte/confortable */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('compact')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          viewMode === 'compact'
                            ? 'bg-white shadow-sm text-indigo-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Compact
                      </button>
                      <button
                        onClick={() => setViewMode('comfortable')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          viewMode === 'comfortable'
                            ? 'bg-white shadow-sm text-indigo-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Confortable
                      </button>
                    </div>

                    {/* Mini statistiques */}
                    <div className="hidden lg:flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md">
                        24 nouveaux
                      </span>
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md">
                        3 alertes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de filtres */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <FiltersBar />
              </div>

              {/* Tableau des produits */}
              <div className="p-6">
                <ProductTable />
              </div>

              {/* Footer de section */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span>© 2024 Analyse Nutritionnelle</span>
                  <span>•</span>
                  <span>Version 2.0.1</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="hover:text-slate-900 transition-colors">
                    Conditions d'utilisation
                  </button>
                  <button className="hover:text-slate-900 transition-colors">
                    Confidentialité
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Button (optionnel) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Squares2X2Icon className="w-6 h-6" />
      </motion.button>
    </div>
  );
}