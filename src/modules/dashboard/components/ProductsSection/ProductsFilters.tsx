import { Search } from 'lucide-react';

interface ProductsFiltersProps {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filtroActivo: 'todos' | 'activos' | 'ocultos' | 'destacados' | 'bajo_stock';
  onFiltroChange: (value: ProductsFiltersProps['filtroActivo']) => void;
  
}

export default function ProductsFilters({
  busqueda,
  onBusquedaChange,
  filtroActivo,
  onFiltroChange,
}: ProductsFiltersProps) {
  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'activos', label: 'Activos' },
    { id: 'ocultos', label: 'Ocultos' },
    { id: 'destacados', label: 'Destacados' },
    { id: 'bajo_stock', label: 'Bajo Stock' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-gray-900/10 transition-shadow"
        />
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFiltroChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              filtroActivo === tab.id
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
