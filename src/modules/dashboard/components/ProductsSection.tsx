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

const ProductsSection = () => {
  const [busqueda, setBusqueda] = useState("");
  const [debouncedBusqueda, setDebouncedBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtroActivo, setFiltroActivo] = useState<
    "todos" | "activos" | "ocultos" | "destacados" | "bajo_stock"
  >("todos");
  const LIMITE = 12;

  // Efecto para actualizar la búsqueda de los productos con debounce de 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [busqueda]);

  // Construimos el objeto de filtros para la consulta, omitiendo los que no aplican
  const filtros: IProductFilters = {
    pagina,
    limite: LIMITE,
    busqueda: debouncedBusqueda || undefined,
    disponible:
      filtroActivo === "activos"
        ? true
        : filtroActivo === "ocultos"
          ? false
          : undefined,
    destacado: filtroActivo === "destacados" ? true : undefined,
    bajoStock: filtroActivo === "bajo_stock" ? true : undefined,
  };

  // Consulta principal para obtener los productos paginados según los filtros
  const { data: productosPaginados, isLoading } = useMisProductos(filtros);
  const actualizar = useActualizarProducto();

  // Extraemos la lista de productos y la metadata de paginación de la respuesta
  const productos: IProduct[] = productosPaginados?.datos ?? [];
  const total: number = productosPaginados?.paginacion?.total ?? 0;
  const totalPaginas: number =
    productosPaginados?.paginacion?.totalPaginas ?? 1;

  // Estado del formulario inline (null = cerrado, 'create' = nuevo, number = editar id)
  const [expandedId, setExpandedId] = useState<"create" | number | null>(null);

  const toggleCreate = () =>
    setExpandedId((prev) => (prev === "create" ? null : "create"));

  const toggleEdit = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // Si está cargando, mostramos un spinner centrado
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
      <ProductSectionHeader
        total={total}
        expandedId={expandedId}
        onToggleCreate={toggleCreate}
      />

      {/* Formulario para crear un nuevo Producto */}
      {expandedId === "create" && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Nuevo producto
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Completá los datos y guardá.
            </p>
          </div>
          <FormProduct onSuccess={() => setExpandedId(null)} />
        </div>
      )}

      <ProductFilters
        busqueda={busqueda}
        filtroActivo={filtroActivo}
        onSearchChange={(value) => setBusqueda(value)}
        onFilterChange={(value) => {
          setFiltroActivo(value);
          setPagina(1);
        }}
      />

      {productos.length === 0 && <ProductEmptyState busqueda={debouncedBusqueda} />}

      {/* Lista de productos */}
      {productos.length > 0 && (
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Catálogo
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {debouncedBusqueda
                ? `Resultados para "${debouncedBusqueda}"`
                : "Todos tus productos activos e inactivos"}
            </p>
          </div>

          <ProductList
            productos={productos}
            expandedId={expandedId}
            toggleEdit={toggleEdit}
            actualizar={actualizar}
            onEditSuccess={() => setExpandedId(null)}
          />
        </div>
      )}

      {totalPaginas > 1 && (
        <ProductPagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          onPageChange={setPagina}
        />
      )}
    </div>
  );
};

export default ProductsSection;
