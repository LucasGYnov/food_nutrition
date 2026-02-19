'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  HeartIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Stats {
  global: {
    total: number;
    avgHealthScore: number;
    ultraProcessedCount: number;
    // Ajoute d'autres stats si disponibles
    byNutriscore?: Record<string, number>;
    topBrands?: Array<{ name: string; count: number }>;
  };
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent animate-shimmer" />
            <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'total',
      title: 'Total Produits',
      value: stats.global.total,
      icon: CubeIcon,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-100',
      description: 'Produits référencés',
      trend: '+12% vs mois dernier'
    },
    {
      id: 'avgScore',
      title: 'Score Santé Moyen',
      value: stats.global.avgHealthScore?.toFixed(1),
      unit: '/100',
      icon: HeartIcon,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      border: 'border-green-100',
      description: 'Moyenne globale',
      trend: stats.global.avgHealthScore > 60 ? 'Bon score' : 'À améliorer'
    },
    {
      id: 'ultraProcessed',
      title: 'Ultra-transformés',
      value: stats.global.ultraProcessedCount,
      icon: ExclamationTriangleIcon,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50',
      border: 'border-red-100',
      description: 'Produits NOVA 4',
      percentage: ((stats.global.ultraProcessedCount / stats.global.total) * 100).toFixed(1)
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Grille principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isHovered = hoveredCard === card.id;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(card.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
            >
              {/* Effet de lueur au hover */}
              <motion.div
                className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500`}
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              />
              
              {/* Carte principale */}
              <div className={`relative p-5 ${card.bgLight} border ${card.border} rounded-2xl overflow-hidden backdrop-blur-sm`}>
                {/* Décoration de fond */}
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full`} />
                </div>

                {/* En-tête avec icône */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Badge de tendance */}
                  {card.trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm border ${card.border}`}>
                      {card.trend}
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    {card.title}
                  </p>
                  
                  <div className="flex items-end gap-2">
                    <motion.p 
                      className={`text-3xl font-bold ${
                        card.id === 'avgScore' 
                          ? getScoreColor(parseFloat(String(card.value)))
                          : 'text-slate-900'
                      }`}
                      animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {card.value}
                      {card.unit && <span className="text-lg ml-0.5 text-slate-400">{card.unit}</span>}
                    </motion.p>
                    
                    {card.percentage && (
                      <span className="text-sm font-medium text-slate-500 mb-1">
                        ({card.percentage}%)
                      </span>
                    )}
                  </div>

                  {/* Barre de progression pour le score santé */}
                  {card.id === 'avgScore' && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats.global.avgHealthScore / 100) * 100}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className={`h-full rounded-full ${
                            stats.global.avgHealthScore >= 60 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : stats.global.avgHealthScore >= 40
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Indicateur de proportion pour les ultra-transformés */}
                  {card.id === 'ultraProcessed' && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${card.percentage}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {card.percentage}% du total
                      </span>
                    </div>
                  )}
                </div>

                {/* Lien de détails (apparaît au hover) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  className="absolute bottom-3 right-3"
                >
                  <button className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                    Voir détails →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cartes additionnelles si les données sont disponibles */}
      {stats.global.byNutriscore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          {['A', 'B', 'C', 'D', 'E'].map((score, index) => {
            const count = stats.global.byNutriscore?.[score] || 0;
            const percentage = ((count / stats.global.total) * 100).toFixed(1);
            
            return (
              <motion.div
                key={score}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-xl border bg-white/50 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-white font-bold text-sm ${
                    score === 'A' ? 'bg-emerald-500' :
                    score === 'B' ? 'bg-green-500' :
                    score === 'C' ? 'bg-yellow-500' :
                    score === 'D' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}>
                    {score}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{percentage}%</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500">produits</p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Top marques si disponibles */}
      {stats.global.topBrands && stats.global.topBrands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white rounded-xl border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <StarIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900">Top marques</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.global.topBrands.slice(0, 4).map((brand, index) => (
              <div key={brand.name} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{brand.name}</span>
                <span className="text-xs px-1.5 py-0.5 bg-slate-200 rounded-full text-slate-600">
                  {brand.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}