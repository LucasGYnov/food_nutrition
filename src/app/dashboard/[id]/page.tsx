'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  ChartBarIcon,
  CubeIcon,
  TagIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  brand: string;
  nutriscore: string;
  healthScore: number;
  imageUrl?: string;
  category: string;
  isUltraProcessed: boolean;
  description?: string;
  ingredients?: string[];
  allergens?: string[];
  packaging?: string;
  labels?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'ingredients' | 'nutrition'>('info');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues de l'API:", data);
        setProduct(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erreur de chargement:", error);
        setIsLoading(false);
      });
  }, [id]);

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

  const getNutriGradient = (score: string) => {
    switch(score?.toUpperCase()) {
      case 'A': return 'from-emerald-500 to-green-500';
      case 'B': return 'from-green-500 to-green-400';
      case 'C': return 'from-yellow-500 to-amber-500';
      case 'D': return 'from-orange-500 to-red-500';
      case 'E': return 'from-red-500 to-rose-600';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-green-50 border-green-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    if (score >= 20) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton loader */}
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-slate-200 rounded-lg mb-8" />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="aspect-square bg-slate-200 rounded-xl" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="h-12 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-200 rounded-xl" />
                    <div className="h-24 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Produit non trouvé</h2>
          <p className="text-slate-500 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header avec navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
              </div>
              <span className="font-medium">Retour</span>
            </button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-slate-600" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ShareIcon className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Carte principale */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image du produit */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:w-1/3"
                >
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-blue-200 transition-all">
                      {product.imageUrl && !imageError ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <CubeIcon className="w-20 h-20 text-slate-300 mb-2" />
                          <span className="text-sm text-slate-400">Image non disponible</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Badge nutriscore sur l'image */}
                    {product.nutriscore && (
                      <div className={`absolute top-4 left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${getNutriGradient(product.nutriscore)} flex items-center justify-center shadow-lg`}>
                        <span className="text-3xl font-bold text-white">{product.nutriscore}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Informations principales */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 space-y-6"
                >
                  {/* En-tête */}
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 text-lg text-slate-500">
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span>{product.brand || 'Marque non spécifiée'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-slate-600 leading-relaxed">{product.description}</p>
                  )}

                  {/* Grille des scores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Health Score */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 ${getScoreBg(product.healthScore)} transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <HeartIcon className={`w-6 h-6 ${getScoreColor(product.healthScore)}`} />
                        <span className="text-3xl font-bold">{product.healthScore}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Score santé</p>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${product.healthScore}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className={`h-full rounded-full ${
                            product.healthScore >= 60 ? 'bg-green-500' :
                            product.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </motion.div>

                    {/* Statut transformation */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 ${
                        product.isUltraProcessed 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-emerald-50 border-emerald-200'
                      } transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        {product.isUltraProcessed ? (
                          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                        ) : (
                          <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Niveau de transformation</p>
                      <p className={`text-lg font-semibold ${
                        product.isUltraProcessed ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        {product.isUltraProcessed ? 'Ultra-transformé (NOVA 4)' : 'Produit brut ou peu transformé'}
                      </p>
                    </motion.div>
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {product.category && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <TagIcon className="w-5 h-5 text-slate-400" />
                        <span><span className="font-medium">Catégorie:</span> {product.category}</span>
                      </div>
                    )}
                    {product.packaging && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <CubeIcon className="w-5 h-5 text-slate-400" />
                        <span><span className="font-medium">Emballage:</span> {product.packaging}</span>
                      </div>
                    )}
                  </div>

                  {/* Labels */}
                  {product.labels && product.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.labels.map((label, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          
        </motion.div>
      </div>
    </div>
  );
}