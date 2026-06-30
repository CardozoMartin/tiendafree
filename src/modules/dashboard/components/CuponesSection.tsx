import { useState } from 'react';
import { Ticket, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useCupones, useCrearCupon, useActualizarCupon, useEliminarCupon } from '../hooks/useCupones';
import type { Cupon, CuponPayload } from '../api/cupones.api';

interface Props { accent: string; }

function fmtFecha(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function estadoCupon(c: Cupon): { label: string; cls: string } {
  if (!c.activo) return { label: 'Inactivo', cls: 'bg-slate-100 text-slate-500' };
  const ahora = new Date();
  if (c.validoHasta && ahora > new Date(c.validoHasta)) return { label: 'Vencido', cls: 'bg-red-100 text-red-600' };
  if (c.validoDesde && ahora < new Date(c.validoDesde)) return { label: 'Programado', cls: 'bg-amber-100 text-amber-700' };
  if (c.usoMaximo != null && c.usoActual >= c.usoMaximo) return { label: 'Agotado', cls: 'bg-red-100 text-red-600' };
  return { label: 'Activo', cls: 'bg-green-100 text-green-700' };
}

export default function CuponesSection({ accent }: Props) {
  const { data: cupones = [], isLoading } = useCupones();
  const crear = useCrearCupon();
  const actualizar = useActualizarCupon();
  const eliminar = useEliminarCupon();

  const [editando, setEditando] = useState<Cupon | null>(null);
  const [creando, setCreando] = useState(false);

  // ── Vista de detalle (form) ──
  if (creando || editando) {
    return (
      <CuponForm
        accent={accent}
        cupon={editando}
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
          <h1 className="text-2xl font-black text-slate-900">Cupones de descuento</h1>
          <p className="text-sm text-slate-500">Creá códigos que tus clientes aplican en el checkout</p>
        </div>
        <button
          onClick={() => setCreando(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
          style={{ background: accent }}
        >
          <Plus className="w-4 h-4" /> Nuevo cupón
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="animate-spin h-7 w-7 border-4 border-slate-200 border-t-slate-800 rounded-full" />
        </div>
      ) : cupones.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-slate-900 font-bold mb-1">Todavía no tenés cupones</h3>
          <p className="text-slate-400 text-sm">Creá tu primer cupón para ofrecer descuentos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Código</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Descuento</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Vigencia</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Usos</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cupones.map((c) => {
                  const est = estadoCupon(c);
                  return (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">{c.codigo}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {c.tipoDescuento === 'PORCENTAJE' ? `${Number(c.valor)}%` : `$${Number(c.valor).toLocaleString('es-AR')}`}
                        {c.minCompra ? <span className="block text-[.65rem] text-slate-400 font-normal">mín. ${Number(c.minCompra).toLocaleString('es-AR')}</span> : null}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {c.validoDesde || c.validoHasta
                          ? <>{fmtFecha(c.validoDesde) ?? 'hoy'} → {fmtFecha(c.validoHasta) ?? 'sin límite'}</>
                          : <span className="text-slate-300">Siempre</span>}
                      </td>
                      <td className="px-5 py-4 text-center text-sm text-slate-600">
                        {c.usoActual}{c.usoMaximo != null ? ` / ${c.usoMaximo}` : ''}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[.65rem] font-black uppercase tracking-wider ${est.cls}`}>{est.label}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditando(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (confirm(`¿Eliminar el cupón ${c.codigo}?`)) eliminar.mutate(c.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer" title="Eliminar">
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
function CuponForm({ accent, cupon, onSave, onCancel, isSaving }: {
  accent: string;
  cupon: Cupon | null;
  onSave: (p: CuponPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    codigo: cupon?.codigo ?? '',
    tipoDescuento: cupon?.tipoDescuento ?? 'PORCENTAJE',
    valor: cupon?.valor != null ? String(cupon.valor) : '',
    minCompra: cupon?.minCompra != null ? String(cupon.minCompra) : '',
    validoDesde: cupon?.validoDesde ? cupon.validoDesde.slice(0, 10) : '',
    validoHasta: cupon?.validoHasta ? cupon.validoHasta.slice(0, 10) : '',
    usoMaximo: cupon?.usoMaximo != null ? String(cupon.usoMaximo) : '',
    activo: cupon?.activo ?? true,
  });
  const [error, setError] = useState('');

  const guardar = () => {
    setError('');
    if (!form.codigo.trim()) return setError('Ingresá un código.');
    const valor = Number(form.valor);
    if (!valor || valor <= 0) return setError('El valor del descuento debe ser mayor a 0.');
    if (form.tipoDescuento === 'PORCENTAJE' && valor > 100) return setError('El porcentaje no puede superar 100.');

    onSave({
      codigo: form.codigo.trim().toUpperCase(),
      tipoDescuento: form.tipoDescuento as 'PORCENTAJE' | 'MONTO_FIJO',
      valor,
      minCompra: form.minCompra ? Number(form.minCompra) : null,
      validoDesde: form.validoDesde || null,
      validoHasta: form.validoHasta || null,
      usoMaximo: form.usoMaximo ? Number(form.usoMaximo) : null,
      activo: form.activo,
    });
  };

  const input = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 transition-colors';
  const label = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border-none">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-2xl font-black text-slate-900">{cupon ? 'Editar cupón' : 'Nuevo cupón'}</h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className={label}>Código</label>
          <input className={`${input} font-mono uppercase`} value={form.codigo} onChange={(e) => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))} placeholder="VERANO20" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Tipo de descuento</label>
            <select className={input} value={form.tipoDescuento} onChange={(e) => setForm(f => ({ ...f, tipoDescuento: e.target.value as any }))}>
              <option value="PORCENTAJE">Porcentaje (%)</option>
              <option value="MONTO_FIJO">Monto fijo ($)</option>
            </select>
          </div>
          <div>
            <label className={label}>{form.tipoDescuento === 'PORCENTAJE' ? 'Porcentaje' : 'Monto'}</label>
            <input className={input} type="number" value={form.valor} onChange={(e) => setForm(f => ({ ...f, valor: e.target.value }))} placeholder={form.tipoDescuento === 'PORCENTAJE' ? '20' : '5000'} />
          </div>
        </div>

        <div>
          <label className={label}>Compra mínima (opcional)</label>
          <input className={input} type="number" value={form.minCompra} onChange={(e) => setForm(f => ({ ...f, minCompra: e.target.value }))} placeholder="Sin mínimo" />
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

        <div>
          <label className={label}>Usos máximos (opcional)</label>
          <input className={input} type="number" value={form.usoMaximo} onChange={(e) => setForm(f => ({ ...f, usoMaximo: e.target.value }))} placeholder="Ilimitado" />
          <p className="text-[11px] text-slate-400 mt-1">Cuántas veces en total se puede canjear este cupón.</p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.activo} onChange={(e) => setForm(f => ({ ...f, activo: e.target.checked }))} className="w-4 h-4" />
          <span className="text-sm text-slate-700 font-medium">Cupón activo</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={guardar} disabled={isSaving} className="flex-1 py-3 rounded-xl text-white font-bold text-sm cursor-pointer border-none disabled:opacity-50" style={{ background: accent }}>
            {isSaving ? 'Guardando...' : cupon ? 'Guardar cambios' : 'Crear cupón'}
          </button>
          <button onClick={onCancel} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm cursor-pointer hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
