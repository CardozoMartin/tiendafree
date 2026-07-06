import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, Tag, Package, Search, X } from 'lucide-react';
import {
  usePromociones,
  useCrearPromocion,
  useActualizarPromocion,
  useEliminarPromocion,
} from '../hooks/usePromociones';
import { useMisProductos } from '../hooks/useProduct';
import type { Promocion, PromocionPayload, TipoDescuento } from '../api/promociones.api';

interface Props { accent: string; }

function fmtFecha(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}


function descLabel(tipo?: TipoDescuento | null, valor?: number | null): string {
  if (tipo == null || valor == null) return '—';
  return tipo === 'PORCENTAJE' ? `${Number(valor)}%` : `$${Number(valor).toLocaleString('es-AR')}`;
}

export default function PromocionesSection({ accent }: Props) {
  const { data: promos = [], isLoading } = usePromociones();
  const crear = useCrearPromocion();
  const actualizar = useActualizarPromocion();
  const eliminar = useEliminarPromocion();

  const [editando, setEditando] = useState<Promocion | null>(null);
  const [creando, setCreando] = useState(false);
  const [viendoId, setViendoId] = useState<number | null>(null);

  // Vista de detalle: administrar los productos de una oferta.
  const viendo = viendoId != null ? promos.find((p) => p.id === viendoId) ?? null : null;
  if (viendo) {
    return (
      <PromocionDetalle
        accent={accent}
        promo={viendo}
        isSaving={actualizar.isPending}
        onBack={() => setViendoId(null)}
        onGuardarProductos={(productos) => actualizar.mutate({ id: viendo.id, payload: { productos } })}
      />
    );
  }

  if (creando || editando) {
    return (
      <PromocionForm
        accent={accent}
        promo={editando}
        isSaving={crear.isPending || actualizar.isPending}
        onCancel={() => { setCreando(false); setEditando(null); }}
        onSave={async (payload) => {
          if (editando) await actualizar.mutateAsync({ id: editando.id, payload });
          else await crear.mutateAsync(payload);
          setCreando(false); setEditando(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Ofertas</h1>
          <p className="text-sm text-slate-500">Agrupá productos con descuento; aparecen como sección en tu tienda</p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
          style={{ background: accent }}
        >
          <Plus className="w-4 h-4" /> Nueva oferta
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin h-7 w-7 border-4 border-slate-200 border-t-slate-800 rounded-full" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl grid place-items-center" style={{ background: `${accent}1a` }}>
            <Tag className="w-6 h-6" style={{ color: accent }} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Creá tu primera oferta</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Por ejemplo "Ofertas del Día del Padre": elegí productos y aplicales un descuento. Se muestra en el menú de tu tienda.
          </p>
          <button
            onClick={() => setCreando(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
            style={{ background: accent }}
          >
            <Plus className="w-4 h-4" /> Crear oferta
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Oferta</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Descuento</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Productos</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Vigencia</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => {
                  return (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <button onClick={() => setViendoId(p.id)} className="text-left border-none bg-transparent cursor-pointer p-0 group">
                          <span className="font-bold text-slate-900 text-sm group-hover:underline" style={{ textDecorationColor: accent }}>{p.nombre}</span>
                          <span className="block text-[.65rem] text-slate-400 font-mono">/{p.slug}</span>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {p.tipoDescuento ? descLabel(p.tipoDescuento, p.valor) : <span className="text-slate-400 font-normal">por producto</span>}
                      </td>
                      <td className="px-5 py-4 text-center text-sm text-slate-600">{p.productos?.length ?? 0}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {p.validoDesde || p.validoHasta
                          ? <>{fmtFecha(p.validoDesde) ?? 'hoy'} → {fmtFecha(p.validoHasta) ?? 'sin límite'}</>
                          : <span className="text-slate-300">Siempre</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          {/* Toggle activa/inactiva directo en la tabla */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={p.activa}
                            aria-label={p.activa ? 'Desactivar oferta' : 'Activar oferta'}
                            title={p.activa ? 'Desactivar' : 'Activar'}
                            disabled={actualizar.isPending}
                            onClick={() => actualizar.mutate({ id: p.id, payload: { activa: !p.activa } })}
                            className="relative inline-flex w-10 h-6 rounded-full transition-colors cursor-pointer border-none disabled:opacity-50"
                            style={{ background: p.activa ? '#22c55e' : '#cbd5e1' }}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${p.activa ? 'left-[18px]' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViendoId(p.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold cursor-pointer border-none"
                            style={{ background: accent }}
                          >
                            <Package className="w-3.5 h-3.5" /> Gestionar productos
                          </button>
                          <button onClick={() => setEditando(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer" title="Editar datos">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (confirm(`¿Eliminar la oferta "${p.nombre}"?`)) eliminar.mutate(p.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Formulario crear/editar ──
function PromocionForm({ accent, promo, onSave, onCancel, isSaving }: {
  accent: string;
  promo: Promocion | null;
  onSave: (p: PromocionPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    nombre: promo?.nombre ?? '',
    validoDesde: promo?.validoDesde ? promo.validoDesde.slice(0, 10) : '',
    validoHasta: promo?.validoHasta ? promo.validoHasta.slice(0, 10) : '',
    activa: promo?.activa ?? true,
  });
  const [error, setError] = useState('');

  const guardar = () => {
    setError('');
    if (!form.nombre.trim()) return setError('Poné un nombre a la oferta.');
    if (form.validoDesde && form.validoHasta && form.validoDesde > form.validoHasta) {
      return setError('La fecha "hasta" no puede ser anterior a "desde".');
    }

    // En este paso solo definimos los datos de la oferta. Los productos se agregan
    // después (al editar). En edición NO enviamos `productos` para no borrar los ya cargados.
    const payload: Partial<PromocionPayload> = {
      nombre: form.nombre.trim(),
      validoDesde: form.validoDesde || null,
      validoHasta: form.validoHasta || null,
      activa: form.activa,
    };
    if (!promo) (payload as PromocionPayload).productos = [];

    onSave(payload as PromocionPayload);
  };

  const input = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 transition-colors';
  const label = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border-none">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-2xl font-black text-slate-900">{promo ? 'Editar oferta' : 'Nueva oferta'}</h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className={label}>Nombre de la oferta</label>
          <input className={input} value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ofertas del Día del Padre" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Válido desde</label>
            <input className={input} type="date" value={form.validoDesde} onChange={(e) => setForm(f => ({ ...f, validoDesde: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Válido hasta</label>
            <input className={input} type="date" value={form.validoHasta} onChange={(e) => setForm(f => ({ ...f, validoHasta: e.target.value }))} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <span className="relative inline-flex">
            <input
              type="checkbox"
              checked={form.activa}
              onChange={(e) => setForm(f => ({ ...f, activa: e.target.checked }))}
              className="sr-only peer"
            />
            <span className="w-10 h-6 rounded-full bg-slate-200 peer-checked:bg-green-500 transition-colors" />
            <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
          <span className="text-sm text-slate-700 font-medium">
            {form.activa ? 'Oferta activa (visible en la tienda)' : 'Oferta inactiva (oculta)'}
          </span>
        </label>

        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500">
          Después de crear la oferta vas a poder <b>agregar los productos</b> y sus descuentos desde el botón <b>Editar</b>.
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={guardar} disabled={isSaving} className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer border-none disabled:opacity-50" style={{ background: accent }}>
            {isSaving ? 'Guardando...' : promo ? 'Guardar cambios' : 'Crear oferta'}
          </button>
          <button onClick={onCancel} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm cursor-pointer hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Vista de detalle: administrar los productos de una oferta ──
// Fila editable en el estado local; al presionar "Guardar" mandamos el set completo
// de productos (el backend reemplaza). Quitar un producto = sacarlo de esta lista.
type FilaProd = {
  productoId: number;
  nombre: string;
  precio: number;
  imagenPrincipalUrl?: string | null;
  tipoDescuento: TipoDescuento;
  valor: string; // vacío = hereda el descuento global de la oferta
};

function PromocionDetalle({ accent, promo, isSaving, onBack, onGuardarProductos }: {
  accent: string;
  promo: Promocion;
  isSaving: boolean;
  onBack: () => void;
  onGuardarProductos: (productos: PromocionPayload['productos']) => void;
}) {
  const [filas, setFilas] = useState<FilaProd[]>(() =>
    (promo.productos ?? []).map((pp) => ({
      productoId: pp.productoId,
      nombre: pp.producto?.nombre ?? `#${pp.productoId}`,
      precio: Number(pp.producto?.precio ?? 0),
      imagenPrincipalUrl: pp.producto?.imagenPrincipalUrl ?? null,
      tipoDescuento: (pp.tipoDescuento ?? 'PORCENTAJE') as TipoDescuento,
      valor: pp.valor != null ? String(pp.valor) : '',
    })),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const marcarDirty = () => setDirty(true);

  const quitar = (productoId: number) => {
    setFilas((prev) => prev.filter((f) => f.productoId !== productoId));
    marcarDirty();
  };

  const setFila = (productoId: number, patch: Partial<FilaProd>) => {
    setFilas((prev) => prev.map((f) => (f.productoId === productoId ? { ...f, ...patch } : f)));
    marcarDirty();
  };

  const agregarProductos = (nuevos: { id: number; nombre: string; precio: number; imagenPrincipalUrl?: string | null }[]) => {
    setFilas((prev) => {
      const existentes = new Set(prev.map((f) => f.productoId));
      const add = nuevos
        .filter((n) => !existentes.has(n.id))
        .map((n) => ({
          productoId: n.id,
          nombre: n.nombre,
          precio: Number(n.precio),
          imagenPrincipalUrl: n.imagenPrincipalUrl ?? null,
          tipoDescuento: 'PORCENTAJE' as TipoDescuento,
          valor: '',
        }));
      return [...prev, ...add];
    });
    marcarDirty();
    setModalOpen(false);
  };

  const guardar = () => {
    const productos: PromocionPayload['productos'] = filas.map((f) => {
      const v = f.valor.trim();
      return v !== ''
        ? { productoId: f.productoId, tipoDescuento: f.tipoDescuento, valor: Number(v) }
        : { productoId: f.productoId };
    });
    onGuardarProductos(productos);
    setDirty(false);
  };

  const precioFinal = (f: FilaProd): number | null => {
    const v = Number(f.valor);
    if (!f.valor.trim() || v <= 0) return null; // hereda global (no lo sabemos acá) → mostramos "global"
    return f.tipoDescuento === 'PORCENTAJE'
      ? Math.max(0, Math.round(f.precio * (1 - v / 100)))
      : Math.max(0, f.precio - v);
  };

  const yaEnOferta = new Set(filas.map((f) => f.productoId));

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border-none">
        <ArrowLeft className="w-4 h-4" /> Volver a ofertas
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{promo.nombre}</h1>
          <p className="text-sm text-slate-500">
            {promo.tipoDescuento
              ? <>Descuento general de la oferta: <b>{descLabel(promo.tipoDescuento, promo.valor)}</b>. Podés cambiarlo por producto abajo.</>
              : <>Definí el descuento de cada producto en la tabla.</>}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
          style={{ background: accent }}
        >
          <Plus className="w-4 h-4" /> Agregar productos
        </button>
      </div>

      {filas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl grid place-items-center" style={{ background: `${accent}1a` }}>
            <Package className="w-6 h-6" style={{ color: accent }} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Todavía no hay productos en esta oferta</h2>
          <p className="text-sm text-slate-500 mt-1">Agregá productos de tu catálogo para que aparezcan con descuento.</p>
          <button onClick={() => setModalOpen(true)} className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer border-none" style={{ background: accent }}>
            <Plus className="w-4 h-4" /> Agregar productos
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Precio</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Descuento</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Precio final</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Quitar</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => {
                  const final = precioFinal(f);
                  return (
                    <tr key={f.productoId} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {f.imagenPrincipalUrl
                            ? <img src={f.imagenPrincipalUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            : <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />}
                          <span className="text-sm font-semibold text-slate-800">{f.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">${f.precio.toLocaleString('es-AR')}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <select
                            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                            value={f.tipoDescuento}
                            onChange={(e) => setFila(f.productoId, { tipoDescuento: e.target.value as TipoDescuento })}
                          >
                            <option value="PORCENTAJE">%</option>
                            <option value="MONTO_FIJO">$</option>
                          </select>
                          <input
                            type="number"
                            className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                            value={f.valor}
                            onChange={(e) => setFila(f.productoId, { valor: e.target.value })}
                            placeholder="usa general"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                        {final != null ? `$${final.toLocaleString('es-AR')}` : <span className="text-slate-400 font-normal text-xs">según general</span>}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => quitar(f.productoId)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer" title="Quitar de la oferta">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={guardar}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm cursor-pointer border-none disabled:opacity-50 shadow-lg"
            style={{ background: accent }}
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}

      {modalOpen && (
        <ModalAgregarProductos
          accent={accent}
          yaEnOferta={yaEnOferta}
          onClose={() => setModalOpen(false)}
          onAgregar={agregarProductos}
        />
      )}
    </div>
  );
}

// ── Modal para elegir productos del catálogo (buscador + checkboxes) ──
function ModalAgregarProductos({ accent, yaEnOferta, onClose, onAgregar }: {
  accent: string;
  yaEnOferta: Set<number>;
  onClose: () => void;
  onAgregar: (nuevos: { id: number; nombre: string; precio: number; imagenPrincipalUrl?: string | null }[]) => void;
}) {
  const { data: prodResp, isLoading } = useMisProductos({ limite: 500 });
  const productos: any[] = prodResp?.datos ?? [];
  const [busqueda, setBusqueda] = useState('');
  const [sel, setSel] = useState<Set<number>>(new Set());

  const filtrados = productos.filter((p) => {
    const q = busqueda.trim().toLowerCase();
    return !q || String(p.nombre).toLowerCase().includes(q);
  });

  const toggle = (id: number) => {
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const confirmar = () => {
    const elegidos = productos
      .filter((p) => sel.has(p.id))
      .map((p) => ({ id: p.id, nombre: p.nombre, precio: Number(p.precio), imagenPrincipalUrl: p.imagenPrincipalUrl }));
    onAgregar(elegidos);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-900">Agregar productos a la oferta</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 border-none bg-transparent cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-slate-400"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto por nombre…"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Cargando productos…</div>
          ) : filtrados.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No hay productos que coincidan.</div>
          ) : (
            filtrados.map((p) => {
              const yaEsta = yaEnOferta.has(p.id);
              const checked = sel.has(p.id);
              return (
                <label key={p.id} className={`flex items-center gap-3 px-4 py-2.5 ${yaEsta ? 'opacity-50' : 'cursor-pointer hover:bg-slate-50'}`}>
                  <input type="checkbox" disabled={yaEsta} checked={checked || yaEsta} onChange={() => toggle(p.id)} className="w-4 h-4 shrink-0" />
                  {p.imagenPrincipalUrl
                    ? <img src={p.imagenPrincipalUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    : <div className="w-9 h-9 rounded-lg bg-slate-100 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.nombre}</p>
                    <p className="text-xs text-slate-400">${Number(p.precio).toLocaleString('es-AR')}{yaEsta ? ' · ya está en la oferta' : ''}</p>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">{sel.size} seleccionados</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm cursor-pointer hover:bg-slate-50">Cancelar</button>
            <button onClick={confirmar} disabled={sel.size === 0} className="px-4 py-2 rounded-xl text-white font-bold text-sm cursor-pointer border-none disabled:opacity-50" style={{ background: accent }}>
              Agregar {sel.size > 0 ? `(${sel.size})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
