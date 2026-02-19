'use client';
import { useEffect, useState } from 'react';

export default function StatsGrid() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div className="animate-pulse h-24 bg-slate-100 rounded-lg"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-600 text-sm font-medium">Total Produits</p>
        <p className="text-2xl font-bold">{stats.global.total}</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
        <p className="text-green-600 text-sm font-medium">Score Santé Moyen</p>
        <p className="text-2xl font-bold">{stats.global.avgHealthScore?.toFixed(1)} / 100</p>
      </div>
      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <p className="text-red-600 text-sm font-medium">Ultra-transformés</p>
        <p className="text-2xl font-bold">{stats.global.ultraProcessedCount}</p>
      </div>
    </div>
  );
}