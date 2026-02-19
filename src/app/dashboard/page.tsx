import StatsGrid from '@/components/StatsGrid';
import ProductTable from '@/components/ProductTable';
import FiltersBar from '@/components/FiltersBar';

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Analyse Nutritionnelle</h1>
      
      {/* Bloc Statistiques (Étape 6.3) */}
      <StatsGrid />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        {/* Barre de Filtres (Contrainte: min. 4 filtres) */}
        <FiltersBar />

        {/* Liste Paginée (Étape 6.1) */}
        <ProductTable />
      </div>
    </main>
  );
}