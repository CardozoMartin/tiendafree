import { Plus, X } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import ProductImportExportControls from './ProductImportExportControls';
import ProductPdfCatalog from './ProductPdfCatalog';

interface ProductSectionHeaderProps {
  total: number;
  expandedId: 'create' | number | null;
  onToggleCreate: MouseEventHandler<HTMLButtonElement>;
}

const ProductSectionHeader = ({ total, expandedId, onToggleCreate }: ProductSectionHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-black text-slate-900">Productos</h1>
      <p className="text-sm text-slate-500 mt-0.5">
        {total > 0 ? `${total} producto${total !== 1 ? 's' : ''} en tu tienda` : 'Gestioná tu catálogo'}
      </p>
    </div>

    <div className="flex items-center gap-2 self-start flex-wrap">
      <ProductPdfCatalog />
      <ProductImportExportControls />

      <button
        onClick={onToggleCreate}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
      >
        {expandedId === 'create' ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {expandedId === 'create' ? 'Cancelar' : 'Agregar'}
      </button>
    </div>
  </div>
);

export default ProductSectionHeader;
