import { Package } from 'lucide-react';

interface ProductEmptyStateProps {
  busqueda: string;
}

const ProductEmptyState = ({ busqueda }: ProductEmptyStateProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] py-16 flex flex-col items-center justify-center text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
      <Package className="w-7 h-7 text-gray-300" />
    </div>
    <p className="text-sm font-semibold text-gray-700">
      {busqueda ? 'Sin resultados' : 'Todavía no tenés productos'}
    </p>
    <p className="text-xs text-gray-400 mt-1 max-w-xs">
      {busqueda
        ? `No encontramos nada con "${busqueda}".`
        : 'Usá el botón "Agregar" para crear tu primer producto.'}
    </p>
  </div>
);

export default ProductEmptyState;
