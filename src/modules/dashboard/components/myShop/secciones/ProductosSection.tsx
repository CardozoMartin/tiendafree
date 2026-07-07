import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useUpdateShopVisual } from '../../../hooks/useShop';
import { api } from '../../../../../api/ApiBase';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

type CardVariante = 'CLASICO' | 'MODERNO';

interface FormValues {
  cardMostrarPrecio: boolean;
  cardMostrarBadge: boolean;
  cardVariante: CardVariante;
}

interface DemoCardProps {
  imagen: string;
  nombre: string;
  precio: string;
  precioAnterior?: string;
  descuento?: number;
  destacado: boolean;
  mostrarPrecio: boolean;
  mostrarBadge: boolean;
  acento: string;
}

// Réplica fiel del ProductCard de shop-users-v2 (usa las mismas variables --s-*).
const DemoCard = ({ imagen, nombre, precio, precioAnterior, descuento, destacado, mostrarPrecio, mostrarBadge, acento }: DemoCardProps) => (
  <div className="group w-full cursor-default select-none block">
    <div className="relative">
      {/* Badge destacado */}
      {destacado && mostrarBadge && (
        <span
          className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-md"
          style={{ background: acento, fontSize: 11 }}
        >
          <svg width="11" height="11" viewBox="0 0 18 17" fill="none">
            <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#fff" />
          </svg>
          Destacado
        </span>
      )}
      {/* Badge de descuento */}
      {descuento && (
        <span className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-white text-xs font-bold shadow-md" style={{ background: '#16a34a', fontSize: 11 }}>
          -{descuento}%
        </span>
      )}
      <img
        className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-48 sm:h-72 object-contain bg-white p-2"
        src={imagen}
        alt={nombre}
        style={destacado ? { boxShadow: `0 0 0 2px ${acento}` } : undefined}
      />
    </div>

    <p className="text-sm mt-2" style={{ color: 'var(--s-txt)' }}>{nombre}</p>

    {/* Precio viejo tachado */}
    {mostrarPrecio && precioAnterior && (
      <p className="text-xs line-through mt-1" style={{ color: 'var(--s-muted)' }}>{precioAnterior}</p>
    )}
    {/* Precio actual + % descuento */}
    {mostrarPrecio && (
      <div className="flex items-center gap-2">
        <p className="text-xl" style={{ color: 'var(--s-txt)' }}>{precio}</p>
        {descuento && (
          <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>{descuento}% OFF</span>
        )}
      </div>
    )}
  </div>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function ProductosSection({ tienda, onVolver }: Props) {
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      cardMostrarPrecio: tienda?.temaConfig?.cardMostrarPrecio ?? true,
      cardMostrarBadge:  tienda?.temaConfig?.cardMostrarBadge  ?? true,
      cardVariante:      tienda?.temaConfig?.cardVariante      ?? 'CLASICO',
    },
  });

  const updateShopVisual = useUpdateShopVisual();
  const isSaving = updateShopVisual.isPending;

  const mostrarPrecio = watch('cardMostrarPrecio');
  const mostrarBadge  = watch('cardMostrarBadge');
  const cardVariante  = watch('cardVariante');

  // ── Filas por categoría en el home (array ordenado de IDs) ──
  // Endpoint público por tienda (no requiere rol admin).
  const { data: categorias = [] } = useQuery({
    queryKey: ['categoriasTienda', tienda?.id],
    queryFn: async () => {
      const { data } = await api.get(`/tiendas/${tienda.id}/productos/categorias`);
      return (data.datos ?? []) as any[];
    },
    enabled: !!tienda?.id,
  });
  const MAX_FILAS = 8;
  const [homeFilas, setHomeFilas] = useState<number[]>(
    Array.isArray(tienda?.temaConfig?.homeCategoriaFilas) ? tienda.temaConfig.homeCategoriaFilas : []
  );

  const nombreCategoria = (id: number) =>
    categorias.find((c: any) => c.id === id)?.nombre ?? `#${id}`;
  const disponibles = categorias.filter((c: any) => !homeFilas.includes(c.id));

  const agregarFila = (id: number) =>
    setHomeFilas((f) => (f.length >= MAX_FILAS || f.includes(id) ? f : [...f, id]));
  const quitarFila = (id: number) => setHomeFilas((f) => f.filter((x) => x !== id));
  const moverFila = (idx: number, dir: -1 | 1) =>
    setHomeFilas((f) => {
      const j = idx + dir;
      if (j < 0 || j >= f.length) return f;
      const copia = [...f];
      [copia[idx], copia[j]] = [copia[j], copia[idx]];
      return copia;
    });

  // Acento real de la tienda. La preview va sobre la card blanca del panel,
  // así que usamos texto oscuro fijo (no seguimos el modoOscuro del sitio).
  const acento = tienda?.temaConfig?.colorAcento ?? '#111827';
  const cssVars = {
    '--s-txt': '#1d293d',
    '--s-muted': '#748298',
    '--s-acento': acento,
  } as React.CSSProperties;

  const handleSave = async (data: FormValues) => {
    await updateShopVisual.mutateAsync({ ...data, homeCategoriaFilas: homeFilas } as any);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Secciones
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-slate-900">Productos</h1>
        </div>
        <button
          onClick={handleSubmit(handleSave)}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando…
            </>
          ) : 'Guardar'}
        </button>
      </div>

      <div className="space-y-6 pb-20">

        {/* Variante de card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Diseño de la card</p>
          <p className="text-xs text-gray-400 mb-4">Elegí cómo se muestra cada producto en la grilla.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Variantes seleccionables */}
            {([
              { value: 'CLASICO' as const, label: 'Clásica', desc: 'Imagen arriba, nombre y precio abajo.' },
              { value: 'MODERNO' as const, label: 'Moderna', desc: 'Nuevo diseño (en construcción).' },
            ]).map((v) => {
              const activo = cardVariante === v.value;
              return (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setValue('cardVariante', v.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    activo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${activo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{v.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{v.desc}</p>
                </button>
              );
            })}

            {/* Próxima variante — bloqueada */}
            <div className="w-full p-3 rounded-xl border-2 border-dashed border-gray-200 text-left opacity-50 cursor-not-allowed select-none">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800">Minimal</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">Imagen cuadrada, sin texto debajo.</p>
              <span className="inline-block mt-1.5 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                Próximamente
              </span>
            </div>
          </div>
        </div>

        {/* Filas por categoría en el home */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-800">Filas por categoría en el inicio</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${homeFilas.length >= MAX_FILAS ? 'text-amber-600 bg-amber-50' : 'text-gray-400 bg-gray-100'}`}>
              {homeFilas.length}/{MAX_FILAS}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Mostrá carruseles de productos por categoría en tu inicio (ej: Camperas, Buzos…). Cada fila lleva un “Ver más” a esa categoría.
          </p>

          {/* Seleccionadas (ordenables) */}
          {homeFilas.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 mb-3">
              Todavía no elegiste ninguna. Agregá categorías abajo.
            </p>
          ) : (
            <div className="space-y-2 mb-4">
              {homeFilas.map((id, idx) => (
                <div key={id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="text-[11px] font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800 truncate">{nombreCategoria(id)}</span>
                  <button type="button" onClick={() => moverFila(idx, -1)} disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-30" title="Subir">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button type="button" onClick={() => moverFila(idx, 1)} disabled={idx === homeFilas.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-800 disabled:opacity-30" title="Bajar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button type="button" onClick={() => quitarFila(id)}
                    className="p-1 text-gray-300 hover:text-red-500" title="Quitar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Disponibles para agregar */}
          {homeFilas.length < MAX_FILAS && disponibles.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Agregar categoría</p>
              <div className="flex flex-wrap gap-2">
                {disponibles.map((c: any) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => agregarFila(c.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-800 hover:text-gray-900 transition-colors"
                  >
                    + {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Opciones de la card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-4">Opciones de la card</p>
          <div className="space-y-3">

            {/* Mostrar precio */}
            <button
              type="button"
              onClick={() => setValue('cardMostrarPrecio', !mostrarPrecio)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Mostrar precio</p>
                  <p className="text-xs text-gray-400">El precio aparece debajo del nombre del producto.</p>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                mostrarPrecio ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-300'
              }`}>
                {mostrarPrecio && <IconCheck />}
              </div>
              <input type="checkbox" className="sr-only" {...register('cardMostrarPrecio')} />
            </button>

            {/* Mostrar badge destacado */}
            <button
              type="button"
              onClick={() => setValue('cardMostrarBadge', !mostrarBadge)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Mostrar badge "Destacado"</p>
                  <p className="text-xs text-gray-400">Etiqueta visible en productos marcados como destacados.</p>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                mostrarBadge ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-300'
              }`}>
                {mostrarBadge && <IconCheck />}
              </div>
              <input type="checkbox" className="sr-only" {...register('cardMostrarBadge')} />
            </button>

          </div>
        </div>

        {/* Preview real de las cards — fiel a shop-users-v2 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Vista previa</p>
          <p className="text-xs text-gray-400 mb-5">Así se verán las cards en tu tienda.</p>
          {/* Contenedor con las variables --s-* según el modo de la tienda (igual que la sección Productos real) */}
          <div className="rounded-xl p-5 sm:p-8" style={cssVars}>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-md mx-auto">
              <DemoCard
                imagen="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                nombre="Reloj clásico dorado"
                precio="$24.900"
                precioAnterior="$31.000"
                descuento={20}
                destacado={true}
                mostrarPrecio={mostrarPrecio}
                mostrarBadge={mostrarBadge}
                acento={acento}
              />
              <DemoCard
                imagen="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
                nombre="Zapatilla urbana roja"
                precio="$18.500"
                destacado={false}
                mostrarPrecio={mostrarPrecio}
                mostrarBadge={mostrarBadge}
                acento={acento}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
