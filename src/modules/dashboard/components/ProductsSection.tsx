import { useEffect, useState } from 'react';
import { useActualizarProducto, useMisProductos } from '../hooks/useProduct';
import type { IProduct, IProductFilters } from '../types/product.type';
import FormProduct from './Forms/FormProduct';
import {
  ProductEmptyState,
  ProductFilters,
  ProductList,
  ProductPagination,
  ProductSectionHeader,
} from './products';

// Constantes globales del componente para evitar valores mágicos en el código
const PRODUCTOS_POR_PAGINA = 12;
const TIEMPO_ESPERA_BUSQUEDA_MS = 400;

const ProductsSection = () => {
  // ============================================================================
  // 1. ESTADOS LOCALES
  // ============================================================================
  
  // Término de búsqueda escrito por el usuario en el input
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // Término de búsqueda con retraso (debounce) para no realizar múltiples peticiones
  const [terminoBusquedaDebounced, setTerminoBusquedaDebounced] = useState("");
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<
    "todos" | "activos" | "ocultos" | "destacados" | "bajo_stock"
  >("todos");

  // Controla qué elemento está expandido en la interfaz:
  // null = ninguno, 'create' = formulario nuevo, un número = id de producto en edición
  const [panelExpandidoId, setPanelExpandidoId] = useState<"create" | number | null>(null);

  // ============================================================================
  // 2. EFECTOS SECUNDARIOS
  // ============================================================================

  // Efecto: Aplicar retraso (debounce) a la búsqueda para optimizar las peticiones a la API
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setTerminoBusquedaDebounced(terminoBusqueda);
      setPaginaActual(1); // Volver a la primera página al realizar una nueva búsqueda
    }, TIEMPO_ESPERA_BUSQUEDA_MS);
    
    // Limpieza del temporizador si el componente se desmonta o terminoBusqueda cambia rápido
    return () => clearTimeout(temporizador);
  }, [terminoBusqueda]);

  // ============================================================================
  // 3. PREPARACIÓN DE PARÁMETROS Y CONSULTAS (API)
  // ============================================================================

  // Construcción dinámica del objeto de filtros para la consulta a la base de datos
  const parametrosConsulta: IProductFilters = {
    pagina: paginaActual,
    limite: PRODUCTOS_POR_PAGINA,
    busqueda: terminoBusquedaDebounced || undefined, // Evitamos mandar strings vacíos
    disponible:
      filtroSeleccionado === "activos"
        ? true
        : filtroSeleccionado === "ocultos"
          ? false
          : undefined, // undefined ignora este filtro y trae todo
    destacado: filtroSeleccionado === "destacados" ? true : undefined,
    bajoStock: filtroSeleccionado === "bajo_stock" ? true : undefined,
  };

  // Peticiones usando hooks personalizados (React Query internamente)
  const { data: respuestaProductos, isLoading: cargandoProductos } = useMisProductos(parametrosConsulta);
  const mutacionActualizar = useActualizarProducto();

  // ============================================================================
  // 4. PROCESAMIENTO Y LIMPIEZA DE DATOS EXTRÍDOS
  // ============================================================================

  // Datos limpios con fallbacks (valores por defecto) para evitar errores "undefined"
  const productosFiltrados: IProduct[] = respuestaProductos?.datos ?? [];
  const cantidadTotalProductos: number = respuestaProductos?.paginacion?.total ?? 0;
  const totalDePaginas: number = respuestaProductos?.paginacion?.totalPaginas ?? 1;

  // ============================================================================
  // 5. MANEJADORES DE EVENTOS (HANDLERS)
  // ============================================================================

  const alternarFormularioCreacion = () => {
    setPanelExpandidoId((estadoActual) => (estadoActual === "create" ? null : "create"));
  };

  const alternarFormularioEdicion = (idProducto: number) => {
    setPanelExpandidoId((estadoActual) => (estadoActual === idProducto ? null : idProducto));
  };

  const cerrarPaneles = () => setPanelExpandidoId(null);

  // ============================================================================
  // 6. RENDERIZADO (UI)
  // ============================================================================

  // Vista de carga principal (Spinner)
  if (cargandoProductos) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-0 space-y-6 pb-6">
      {/* --- Encabezado --- */}
      <ProductSectionHeader
        total={cantidadTotalProductos}
        expandedId={panelExpandidoId}
        onToggleCreate={alternarFormularioCreacion}
      />

      {/* --- Sección: Nuevo Producto --- */}
      {panelExpandidoId === "create" && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Nuevo producto
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Completá los datos y guardá.
            </p>
          </div>
          <FormProduct onSuccess={cerrarPaneles} />
        </div>
      )}

      {/* --- Sección: Filtros y Buscador --- */}
      <ProductFilters
        busqueda={terminoBusqueda}
        filtroActivo={filtroSeleccionado}
        onSearchChange={(nuevoValor) => setTerminoBusqueda(nuevoValor)}
        onFilterChange={(nuevoFiltro) => {
          setFiltroSeleccionado(nuevoFiltro);
          setPaginaActual(1); // Al cambiar contenedor de filtros, volver al inicio
        }}
      />

      {/* --- Sección: Estado Vacío (sin resultados) --- */}
      {productosFiltrados.length === 0 && (
        <ProductEmptyState busqueda={terminoBusquedaDebounced} />
      )}

      {/* --- Sección: Lista del Catálogo --- */}
      {productosFiltrados.length > 0 && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Catálogo
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {terminoBusquedaDebounced
                ? `Resultados para "${terminoBusquedaDebounced}"`
                : "Todos tus productos activos e inactivos"}
            </p>
          </div>

          <ProductList
            productos={productosFiltrados}
            expandedId={panelExpandidoId}
            toggleEdit={alternarFormularioEdicion}
            actualizar={mutacionActualizar}
            onEditSuccess={cerrarPaneles}
          />
        </div>
      )}

      {/* --- Sección: Paginación --- */}
      {totalDePaginas > 1 && (
        <ProductPagination
          pagina={paginaActual}
          totalPaginas={totalDePaginas}
          onPageChange={setPaginaActual}
        />
      )}
    </div>
  );
};

export default ProductsSection;

