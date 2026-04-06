import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  pagina: number;
  totalPaginas: number;
  onPageChange: (newPage: number) => void;
}

const ProductPagination = ({ pagina, totalPaginas, onPageChange }: ProductPaginationProps) => (
  <div className="flex items-center justify-between pt-1">
    <p className="text-xs text-gray-400 font-medium">
      Página {pagina} de {totalPaginas}
    </p>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, pagina - 1))}
        disabled={pagina === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Anterior
      </button>
      <button
        onClick={() => onPageChange(Math.min(totalPaginas, pagina + 1))}
        disabled={pagina === totalPaginas}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default ProductPagination;
