import { useState } from 'react';
import { STATUS_META } from '../constant/constants';
import MI from './MaterialIcon';
import { useOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from '../hooks/useOrders';
import { useMyShop } from '../hooks/useShop';
import DashboardHelp from './DashboardHelp';

// Estado de pago: etiqueta + colores
const PAGO_META: Record<string, { label: string; bg: string; text: string }> = {
  PENDIENTE: { label: 'Pago pendiente', bg: 'bg-amber-50', text: 'text-amber-600' },
  APROBADO: { label: 'Pagado', bg: 'bg-green-50', text: 'text-green-600' },
  RECHAZADO: { label: 'Pago rechazado', bg: 'bg-red-50', text: 'text-red-600' },
  EN_PROCESO: { label: 'Pago en proceso', bg: 'bg-blue-50', text: 'text-blue-600' },
  DEVUELTO: { label: 'Pago devuelto', bg: 'bg-slate-100', text: 'text-slate-600' },
  CANCELADO: { label: 'Pago cancelado', bg: 'bg-slate-100', text: 'text-slate-500' },
};

// Correos postales con URL base de seguimiento
const CORREOS = [
  { label: 'Correo Argentino', urlBase: 'https://www.correoargentino.com.ar/formularios/omnicanal?id=' },
  { label: 'OCA', urlBase: 'https://www.oca.com.ar/seguimiento/?numero_envio=' },
  { label: 'Andreani', urlBase: 'https://www.andreani.com/#!/informacionEnvio/' },
  { label: 'Otro (solo número)', urlBase: '' },
];

// ── Badge Component ────────────────────────────────────────────────────────
const Badge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
};

const OrdersSection = ({ accent }: { accent: string }) => {
  const { data: myShop } = useMyShop();
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  // Modal de seguimiento postal
  const [trackingModal, setTrackingModal] = useState<{ orderId: number } | null>(null);
  const [nroSeguimiento, setNroSeguimiento] = useState('');
  const [correoSeleccionado, setCorreoSeleccionado] = useState(CORREOS[0]);

  const { data: ordersRes, isLoading } = useOrders({
    tiendaId: myShop?.id,
    estado: filter === 'all' ? undefined : filter,
    pagina: 1,
    limite: 50,
  });

  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updatePayment } = useUpdatePaymentStatus();

  const orders = ordersRes?.datos || [];

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'PENDIENTE', label: 'Pendientes' },
    { id: 'CONFIRMADO', label: 'Confirmados' },
    { id: 'EN_CAMINO', label: 'En camino' },
    { id: 'ENTREGADO', label: 'Entregados' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-slate-200 border-t-slate-800 rounded-full" />
      </div>
    );
  }

  // ── VISTA DE DETALLE ──
  if (selectedOrder) {
    // Tomamos la versión fresca del pedido desde la lista (refleja cambios de estado/pago)
    const o = orders.find((x: any) => x.id === selectedOrder.id) || selectedOrder;
    return (
      <OrderDetail
        order={o}
        accent={accent}
        onBack={() => setSelectedOrder(null)}
        updateStatus={updateStatus}
        updatePayment={updatePayment}
        onTrackingOpen={() => { setTrackingModal({ orderId: o.id }); setNroSeguimiento(''); setCorreoSeleccionado(CORREOS[0]); }}
        trackingModal={trackingModal}
        setTrackingModal={setTrackingModal}
        nroSeguimiento={nroSeguimiento}
        setNroSeguimiento={setNroSeguimiento}
        correoSeleccionado={correoSeleccionado}
        setCorreoSeleccionado={setCorreoSeleccionado}
        onAfterTracking={() => setSelectedOrder(null)}
      />
    );
  }

  // ── VISTA DE TABLA ──
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Pedidos</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all border-none cursor-pointer"
              style={filter === f.id ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f1f5f9', color: '#64748b' }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <DashboardHelp activeSection="orders" accent={accent} />
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm mt-8">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <MI name="receipt_long" className="!text-3xl" />
          </div>
          <h3 className="text-slate-900 font-bold mb-1">No hay pedidos</h3>
          <p className="text-slate-400 text-sm">Aún no recibiste pedidos con estos filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Productos</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                  <th className="px-5 py-3 text-[.65rem] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <span className="font-black text-slate-900 text-sm">#{o.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {o.compradorNombre}
                        {o.notasCliente && <MI name="bubble" className="!text-[12px] text-amber-500" />}
                      </p>
                      <p className="text-xs text-slate-400">{o.compradorTel}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(o.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-slate-600">{o._count?.items ?? o.items?.length ?? 0}</td>
                    <td className="px-5 py-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">${Number(o.total).toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge status={o.estado} />
                        <span className={`inline-flex items-center gap-1 text-[.6rem] font-bold ${o.estadoPago === 'APROBADO' ? 'text-green-600' : 'text-amber-500'}`}>
                          <MI name={o.estadoPago === 'APROBADO' ? 'check_circle' : 'schedule'} className="!text-[11px]" />
                          {o.estadoPago === 'APROBADO' ? 'Pagado' : 'Sin pagar'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center justify-center size-8 rounded-lg text-slate-400 group-hover:text-slate-600">
                        <MI name="chevron_right" className="!text-lg" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ── Componente de detalle ──────────────────────────────────────────────────
function OrderDetail({
  order: o, accent, onBack, updateStatus, updatePayment, onTrackingOpen,
  trackingModal, setTrackingModal, nroSeguimiento, setNroSeguimiento,
  correoSeleccionado, setCorreoSeleccionado, onAfterTracking,
}: any) {
  const pago = PAGO_META[o.estadoPago] || PAGO_META.PENDIENTE;
  const estaPagado = o.estadoPago === 'APROBADO';
  return (
    <div className="space-y-6 animate-expand-down">
      {/* Header con volver */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-200 transition-colors border-none"
        >
          <MI name="arrow_back" className="!text-base" /> Volver
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900">Pedido #{o.id}</h1>
          <Badge status={o.estado} />
        </div>
        <span className="text-xs text-slate-400 ml-auto">{new Date(o.creadoEn).toLocaleString('es-AR')}</span>
      </div>

      {/* Cliente */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Datos del Cliente</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><MI name="person" className="text-slate-300 !text-lg" /><span className="text-[.9rem] font-bold text-slate-700">{o.compradorNombre}</span></div>
          <div className="flex items-center gap-3"><MI name="mail" className="text-slate-300 !text-lg" /><span className="text-[.9rem] text-slate-500">{o.compradorEmail}</span></div>
          <div className="flex items-center gap-3"><MI name="call" className="text-slate-300 !text-lg" /><span className="text-[.9rem] text-slate-500">{o.compradorTel}</span></div>
        </div>
      </div>

      {/* Dirección y Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-3">Envío</h4>
          <p className="text-[.85rem] font-bold text-slate-700 leading-tight">{o.direccionCalle} {o.direccionNumero}</p>
          <p className="text-[.75rem] text-slate-400 mt-1">{o.direccionCiudad}, {o.direccionProv}</p>
          {o.direccionNotas && <p className="text-[.75rem] text-slate-400 mt-1 italic">{o.direccionNotas}</p>}
          <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-[.65rem] font-bold text-slate-500">
            <MI name="local_shipping" className="!text-[12px]" /> {o.metodoEntrega?.nombre || 'Default'}
          </div>
          {o.nroSeguimiento && (
            <div className="mt-2 text-[.7rem] text-slate-500">
              Seguimiento: {o.urlSeguimiento
                ? <a href={o.urlSeguimiento} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: accent }}>{o.nroSeguimiento}</a>
                : <span className="font-mono font-bold">{o.nroSeguimiento}</span>}
            </div>
          )}
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-3">Pago</h4>
          <p className="text-[.85rem] font-bold text-slate-700">{o.metodoPago?.nombre || 'Default'}</p>
          <div className={`mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded text-[.65rem] font-bold ${pago.bg} ${pago.text}`}>
            <MI name={estaPagado ? 'check_circle' : 'schedule'} className="!text-[12px]" /> {pago.label}
          </div>
          {/* Marcar pagado manualmente (transferencia/efectivo) */}
          <div className="mt-3 flex gap-2 flex-wrap">
            {!estaPagado && (
              <button
                onClick={() => updatePayment({ id: o.id, estadoPago: 'APROBADO' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-[.7rem] font-bold cursor-pointer hover:bg-green-700 transition-colors border-none"
              >
                <MI name="check" className="!text-[14px]" /> Marcar como pagado
              </button>
            )}
            {estaPagado && (
              <button
                onClick={() => updatePayment({ id: o.id, estadoPago: 'PENDIENTE' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[.7rem] font-bold cursor-pointer hover:bg-slate-200 transition-colors border-none"
              >
                Marcar pendiente
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notas */}
      {o.notasCliente && (
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 border-dashed">
          <h4 className="text-[.65rem] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MI name="priority_high" className="!text-xs" /> Nota del Cliente
          </h4>
          <p className="text-[.85rem] text-amber-800 italic leading-relaxed">"{o.notasCliente}"</p>
        </div>
      )}

      {/* Productos */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Productos</h4>
        <div className="space-y-4">
          {o.items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 overflow-hidden">
                  {item.imagenUrl ? <img src={item.imagenUrl} alt={item.nombreProd} className="w-full h-full object-contain p-0.5" /> : `${item.cantidad}x`}
                </div>
                <div>
                  <p className="text-[.85rem] font-bold text-slate-800">{item.nombreProd}</p>
                  {item.nombreVar && <p className="text-[.7rem] text-slate-400 line-clamp-1">{item.nombreVar}</p>}
                  <p className="text-[.7rem] text-slate-400">{item.cantidad} u. × ${Number(item.precioUnit).toLocaleString()}</p>
                </div>
              </div>
              <span className="text-[.9rem] font-bold text-slate-700">${Number(item.subtotal).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-dashed border-slate-100 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[.85rem] text-slate-500 font-medium">
            <span>Subtotal</span><span>${(Number(o.total) - Number(o.costoEnvio || 0)).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-[.85rem] text-slate-500 font-medium">
            <span>Envío</span><span>${Number(o.costoEnvio || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-50">
            <span className="text-[.85rem] font-black text-slate-900 uppercase">Total Final</span>
            <span className="text-xl font-black text-slate-900">${Number(o.total).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3">
        {o.estado === 'PENDIENTE' && (
          <button onClick={() => updateStatus({ id: o.id, estado: 'CONFIRMADO' })} className="col-span-2 py-4 rounded-2xl bg-slate-900 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-colors">
            Confirmar Pedido
          </button>
        )}
        {o.estado === 'CONFIRMADO' && (
          <button onClick={onTrackingOpen} className="col-span-2 py-4 rounded-2xl bg-violet-600 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-violet-700 transition-colors">
            Marcar en Camino
          </button>
        )}
        {o.estado === 'EN_CAMINO' && (
          <button onClick={() => updateStatus({ id: o.id, estado: 'ENTREGADO' })} className="col-span-2 py-4 rounded-2xl bg-green-600 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-green-700 transition-colors">
            Marcar como Entregado
          </button>
        )}
        {o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO' && (
          <button onClick={() => updateStatus({ id: o.id, estado: 'CANCELADO' })} className="py-3 px-4 rounded-xl bg-red-50 text-red-600 border-none font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors">
            Cancelar
          </button>
        )}
        <a
          href={`https://wa.me/${o.compradorTel?.replace(/\D/g, '') || ''}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white border-none font-bold text-xs uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-90 no-underline"
        >
          <MI name="chat" className="!text-sm" /> WhatsApp
        </a>
      </div>

      <style>{`
        @keyframes expandDown { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-expand-down { animation: expandDown 0.25s ease-out; }
      `}</style>

      {/* Modal Seguimiento Postal */}
      {trackingModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setTrackingModal(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <MI name="local_shipping" className="!text-[20px] text-violet-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Marcar en Camino</h3>
                <p className="text-xs text-slate-400">Opcional: agregá datos de seguimiento postal</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Servicio de envío</label>
              <select
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none"
                value={correoSeleccionado.label}
                onChange={(e) => { const cc = CORREOS.find(c => c.label === e.target.value) || CORREOS[0]; setCorreoSeleccionado(cc); }}
              >
                {CORREOS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">N° de seguimiento</label>
              <input
                type="text" value={nroSeguimiento}
                onChange={(e) => setNroSeguimiento(e.target.value)}
                placeholder="Ej: CA123456789AR"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none font-mono tracking-wider"
              />
              <p className="text-xs text-slate-400 mt-1">Dejalo vacío si no usás envío postal.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTrackingModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => {
                  const urlSeguimiento = nroSeguimiento && correoSeleccionado.urlBase ? `${correoSeleccionado.urlBase}${nroSeguimiento}` : undefined;
                  updateStatus({ id: trackingModal.orderId, estado: 'EN_CAMINO', nroSeguimiento: nroSeguimiento || undefined, urlSeguimiento });
                  setTrackingModal(null);
                  onAfterTracking();
                }}
                className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-black cursor-pointer hover:bg-violet-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersSection;
