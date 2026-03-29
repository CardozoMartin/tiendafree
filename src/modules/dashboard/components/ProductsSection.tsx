import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useEliminarProducto,
  useExportarProductos,
  useImportarProductos,
  useMisProductos,
} from '../hooks/useProduct';
import type { IProduct, IProductFilters } from '../types/product.type';
import FormProduct from './Forms/FormProduct';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

const ProductsSection = () => {
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const LIMITE = 12;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [busqueda]);

  const filtros: IProductFilters = {
    pagina,
    limite: LIMITE,
    busqueda: debouncedBusqueda || undefined,
  };
  const { data: productosPaginados, isLoading } = useMisProductos(filtros);
  const eliminar = useEliminarProducto();
  const exportar = useExportarProductos();
  const importar = useImportarProductos();

  const productos: IProduct[] = productosPaginados?.datos ?? [];
  const total: number = productosPaginados?.paginacion?.total ?? 0;
  const totalPaginas: number = productosPaginados?.paginacion?.totalPaginas ?? 1;

  // Estado del formulario inline (null = cerrado, 'create' = nuevo, number = editar id)
  const [expandedId, setExpandedId] = useState<'create' | number | null>(null);

  const handleDelete = (producto: IProduct) => {
    if (window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminar.mutate(producto.id);
    }
  };

  const toggleCreate = () => setExpandedId((prev) => (prev === 'create' ? null : 'create'));

  const toggleEdit = (id: number) => setExpandedId((prev) => (prev === id ? null : id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total > 0
              ? `${total} producto${total !== 1 ? 's' : ''} en tu tienda`
              : 'Gestioná tu catálogo'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Exportar */}
          <button
            onClick={() => exportar.mutate()}
            disabled={exportar.isPending}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Exportar catálogo a Excel"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {/* Importar */}
          <label
            className={`flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer ${importar.isPending ? 'opacity-50 pointer-events-none' : ''}`}
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
                  e.target.value = ''; // Reset para poder subir el mismo archivo
                }
              }}
            />
          </label>

          {/* Agregar */}
          <button
            onClick={toggleCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            {expandedId === 'create' ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {expandedId === 'create' ? 'Cancelar' : 'Agregar'}
          </button>
        </div>
      </div>

      {/* ══════════════════════════
          FORMULARIO CREAR (inline)
      ══════════════════════════ */}
      {expandedId === 'create' && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Nuevo producto
            </h2>
            <p className="text-xs text-gray-400 mt-1">Completá los datos y guardá.</p>
          </div>
          <FormProduct onSuccess={() => setExpandedId(null)} />
        </div>
      )}

      {/* ══════════════════════════
          BUSCADOR
      ══════════════════════════ */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-gray-900/10 transition-shadow"
        />
      </div>

      {/* ══════════════════════════
          ESTADO VACÍO
      ══════════════════════════ */}
      {productos.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] py-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <Package className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {debouncedBusqueda ? 'Sin resultados' : 'Todavía no tenés productos'}
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {debouncedBusqueda
              ? `No encontramos nada con "${debouncedBusqueda}".`
              : 'Usá el botón "Agregar" para crear tu primer producto.'}
          </p>
        </div>
      )}

      {/* ══════════════════════════
          LISTA DE PRODUCTOS
      ══════════════════════════ */}
      {productos.length > 0 && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Catálogo
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {debouncedBusqueda
                ? `Resultados para "${debouncedBusqueda}"`
                : 'Todos tus productos activos e inactivos'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {productos.map((producto) => {
              const isEditing = expandedId === producto.id;

              return (
                <div key={producto.id} className="flex flex-col">
                  {/* ── Fila principal ── */}
                  <div className="flex items-center gap-4 px-6 py-5">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100/50 overflow-hidden shrink-0 flex items-center justify-center">
                      {producto.imagenPrincipalUrl ? (
                        <img
                          src={producto.imagenPrincipalUrl}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {producto.nombre}
                        </p>
                        {producto.destacado && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                            <Star className="w-2.5 h-2.5 fill-amber-500 stroke-none" /> Destacado
                          </span>
                        )}
                        {!producto.disponible && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                            Oculto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-400 font-medium">
                          {formatPrice(producto.precio, producto.moneda)}
                        </p>
                        {producto.precioOferta && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(producto.precioOferta, producto.moneda)}
                          </p>
                        )}
                        {producto.tags?.length > 0 && (
                          <>
                            <span className="text-gray-200">·</span>
                            <p className="text-xs text-gray-400 truncate">
                              {producto.tags
                                .slice(0, 2)
                                .map((t) => `#${t.nombre}`)
                                .join(' ')}
                              {producto.tags.length > 2 && ' ...'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleEdit(producto.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isEditing
                            ? 'text-gray-700 bg-gray-100'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title={isEditing ? 'Cerrar' : 'Editar'}
                      >
                        {isEditing ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <Pencil className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(producto)}
                        disabled={eliminar.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* ── Formulario de edición (inline expandible) ── */}
                  {isEditing && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                        <FormProduct producto={producto} onSuccess={() => setExpandedId(null)} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Paginación ── */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-400 font-medium">
            Página {pagina} de {totalPaginas}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
