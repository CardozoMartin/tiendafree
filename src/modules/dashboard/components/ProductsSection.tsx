import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import {
  useActualizarProducto,
  useExportarProductos,
  useImportarProductos,
  useMisProductos,
} from '../hooks/useProduct';
import { useMyShop } from '../hooks/useShop';
import type { IProduct, IProductFilters } from '../types/product.type';
import CatalogoPDF from './CatalogoPDF';
import FormProduct from './Forms/FormProduct';
import ProductsFilters from './ProductsSection/ProductsFilters';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

// Constantes globales del componente para evitar valores mágicos en el código
const PRODUCTOS_POR_PAGINA = 12;
const TIEMPO_ESPERA_BUSQUEDA_MS = 400;

const ProductsSection = () => {
  // ============================================================================
  // 1. ESTADOS LOCALES
  // ============================================================================

  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [filtroActivo, setFiltroActivo] = useState<
    'todos' | 'activos' | 'ocultos' | 'destacados' | 'bajo_stock'
  >('todos');

  // Estado del formulario inline (null = cerrado, 'create' = nuevo, number = editar id)
  const [expandedId, setExpandedId] = useState<'create' | number | null>(null);

  // ============================================================================
  // 2. EFECTOS SECUNDARIOS
  // ============================================================================

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
      setPagina(1);
    }, TIEMPO_ESPERA_BUSQUEDA_MS);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // ============================================================================
  // 3. PREPARACIÓN DE PARÁMETROS Y CONSULTAS (API)
  // ============================================================================

  const filtros: IProductFilters = {
    pagina,
    limite: PRODUCTOS_POR_PAGINA,
    busqueda: debouncedBusqueda || undefined,
    disponible: filtroActivo === 'activos' ? true : filtroActivo === 'ocultos' ? false : undefined,
    destacado: filtroActivo === 'destacados' ? true : undefined,
    bajoStock: filtroActivo === 'bajo_stock' ? true : undefined,
  };

  const { data: productosPaginados, isLoading } = useMisProductos(filtros);
  const actualizar = useActualizarProducto();
  const exportar = useExportarProductos();
  const importar = useImportarProductos();

  // ============================================================================
  // 4. PROCESAMIENTO DE DATOS
  // ============================================================================

  const productos: IProduct[] = productosPaginados?.datos ?? [];
  const total: number = productosPaginados?.paginacion?.total ?? 0;
  const totalPaginas: number = productosPaginados?.paginacion?.totalPaginas ?? 1;

  // Query para obtener todos los productos para el PDF
  const { data: todosProductosPaginados } = useMisProductos({ limite: 1000, disponible: true });
  const allProductsForPdf = (todosProductosPaginados?.datos ?? []).filter((p) => p.stock > 0);

  const { data: myShop } = useMyShop();
  const tiendaInfo = myShop?.datos
    ? {
        nombre: myShop.datos.nombre,
        tagline: (myShop.datos.configuracion as any)?.tagline || myShop.datos.dominio,
        logo: (myShop.datos.configuracion as any)?.logoUrl || undefined,
      }
    : { nombre: 'Tienda' };

  const { toPDF, targetRef } = usePDF({
    filename: 'catalogo.pdf',
    canvas: { useCORS: true },
  });

  const [pdfTheme, setPdfTheme] = useState<'minimal' | 'modern' | 'lookbook'>('minimal');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      try {
        await toPDF();
      } catch (error) {
        console.error('Error generando PDF', error);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 150);
  };

  // ============================================================================
  // 5. MANEJADORES DE EVENTOS
  // ============================================================================

  const toggleCreate = () => setExpandedId((prev) => (prev === 'create' ? null : 'create'));
  const toggleEdit = (id: number) => setExpandedId((prev) => (prev === id ? null : id));
  const cerrarPaneles = () => setExpandedId(null);

  // ============================================================================
  // 6. RENDERIZADO (UI)
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-0 space-y-6 pb-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total > 0
              ? `${total} producto${total !== 1 ? 's' : ''} en tu tienda`
              : 'Gestioná tu catálogo'}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start flex-wrap">
          {/* Menú de Tema PDF */}
          <div className="relative group">
            <select
              value={pdfTheme}
              onChange={(e) => setPdfTheme(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm px-3 py-2.5 pr-8 focus:outline-none focus:border-gray-400 cursor-pointer"
              title="Elegir diseño del PDF"
            >
              <option value="minimal">Minimalista</option>
              <option value="modern">Moderno</option>
              <option value="lookbook">Lookbook</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          {/* Catálogo PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-1.5 px-3 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-bold rounded-xl transition-all shadow-sm ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
            title="Descargar catálogo de productos en PDF"
          >
            {isGeneratingPdf ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
            </span>
          </button>

          {/* Exportar */}
          <button
            onClick={() => exportar.mutate()}
            disabled={exportar.isPending}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Exportar catálogo a Excel"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Excel</span>
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
          <FormProduct onSuccess={cerrarPaneles} />
        </div>
      )}

      <ProductsFilters
        busqueda={busqueda}
        onBusquedaChange={(value) => {
          setBusqueda(value);
          setPagina(1);
        }}
        filtroActivo={filtroActivo}
        onFiltroChange={(value) => {
          setFiltroActivo(value);
          setPagina(1);
        }}
      />

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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-5">
                    {/* Grupo de Identificación */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
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
                          {/* Stock Badges */}
                          {producto.stock <= 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                              <AlertCircle className="w-2.5 h-2.5" /> Sin Stock
                            </span>
                          )}
                          {producto.stock > 0 && producto.stock <= 5 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                              Bajo Stock: {producto.stock}
                            </span>
                          )}
                          {producto.stock > 5 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                              Stock: {producto.stock}
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
                              <p className="text-xs text-gray-400 truncate hidden sm:block">
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
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:pr-2 border-t border-gray-50 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                      {/* Destacado Toggle */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${producto.destacado ? 'text-amber-600' : 'text-slate-500'}`}
                        >
                          Destacado
                        </span>
                        <button
                          onClick={() =>
                            actualizar.mutate({
                              id: producto.id,
                              payload: { destacado: !producto.destacado },
                            })
                          }
                          disabled={actualizar.isPending}
                          className={`relative w-11 h-6 rounded-full border transition-all duration-200 disabled:opacity-50 ${
                            producto.destacado
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-slate-100 border-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white border shadow-sm transition-all duration-200 flex items-center justify-center ${
                              producto.destacado
                                ? 'left-[calc(100%-1.375rem)] border-amber-300'
                                : 'left-0.5 border-slate-300'
                            }`}
                          >
                            <Star
                              className={`w-2.5 h-2.5 transition-colors ${
                                producto.destacado
                                  ? 'stroke-amber-600 fill-none'
                                  : 'stroke-slate-400 fill-none'
                              }`}
                            />
                          </span>
                        </button>
                      </div>

                      {/* Divisor */}
                      <div className="w-px h-8 bg-gray-100" />

                      {/* Visible Toggle */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${producto.disponible ? 'text-emerald-600' : 'text-slate-500'}`}
                        >
                          Visible
                        </span>
                        <button
                          onClick={() =>
                            actualizar.mutate({
                              id: producto.id,
                              payload: { disponible: !producto.disponible },
                            })
                          }
                          disabled={actualizar.isPending}
                          className={`relative w-11 h-6 rounded-full border transition-all duration-200 disabled:opacity-50 ${
                            producto.disponible
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-slate-100 border-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white border shadow-sm transition-all duration-200 flex items-center justify-center ${
                              producto.disponible
                                ? 'left-[calc(100%-1.375rem)] border-emerald-300'
                                : 'left-0.5 border-slate-300'
                            }`}
                          >
                            <Package
                              className={`w-2.5 h-2.5 transition-colors ${producto.disponible ? 'stroke-emerald-600' : 'stroke-slate-400'}`}
                            />
                          </span>
                        </button>
                      </div>

                      {/* Botón editar */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {isEditing ? 'Cerrar' : 'Editar'}
                        </span>
                        <button
                          onClick={() => toggleEdit(producto.id)}
                          className={`p-2 rounded-xl transition-all border ${
                            isEditing
                              ? 'text-gray-900 bg-gray-100 border-gray-200 shadow-inner'
                              : 'text-gray-600 bg-white border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                          title={isEditing ? 'Cerrar edición' : 'Editar producto'}
                        >
                          {isEditing ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <Pencil className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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

      {/* Hidden PDF component */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CatalogoPDF
          ref={targetRef}
          productos={allProductsForPdf}
          tienda={tiendaInfo}
          tema={pdfTheme}
        />
      </div>
    </div>
  );
};

export default ProductsSection;
