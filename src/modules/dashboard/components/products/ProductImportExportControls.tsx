import { Download, Upload } from 'lucide-react';
import { useExportarProductos, useImportarProductos } from '../../hooks/useProduct';

const ProductImportExportControls = () => {
  const exportar = useExportarProductos();
  const importar = useImportarProductos();

  return (
    <>
      <button
        onClick={() => exportar.mutate()}
        disabled={exportar.isPending}
        className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
        title="Exportar catálogo a Excel"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Exportar Excel</span>
      </button>

      <label
        className={`flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
          importar.isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Importar</span>
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          disabled={importar.isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.debug('[ProductsSection] archivo elegido para importación', {
                name: file.name,
                size: file.size,
                type: file.type,
              });
              importar.mutate(file);
              e.target.value = '';
            }
          }}
        />
      </label>
    </>
  );
};

export default ProductImportExportControls;
