import { useState } from 'react';
import { STATUS_META } from '../constant/constants';
import MI from './MaterialIcon';
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import { useMyShop } from '../hooks/useShop';

// ── Badge Component ────────────────────────────────────────────────────────
const Badge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700' };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider ${m.bg} ${m.text}`}
    >
      {m.label}
    </span>
  );
};

const OrdersSection = ({ accent }: { accent: string }) => {
  const { data: myShop } = useMyShop();
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: ordersRes, isLoading } = useOrders({
    tiendaId: myShop?.id,
    estado: filter === 'all' ? undefined : filter,
    pagina: 1,
    limite: 50
  });

  const { mutate: updateStatus } = useUpdateOrderStatus();

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
                style={
                filter === f.id
                    ? { backgroundColor: accent, color: 'white' }
                    : { backgroundColor: '#f1f5f9', color: '#64748b' }
                }
            >
                {f.label}
            </button>
            ))}
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {orders.map((o: any) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-black text-sm border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                      #{o.id}
                    </div>
                    <div>
                      <p className="text-[.95rem] font-bold text-slate-900 flex items-center gap-2">
                        {o.compradorNombre}
                        {o.notasCliente && <MI name="bubble" className="!text-[12px] text-amber-500" title="Tiene notas" />}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{o._count?.items || 0} productos · {new Date(o.creadoEn).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-lg font-black text-slate-900">
                      ${Number(o.total).toLocaleString()}
                    </span>
                    <Badge status={o.estado} />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-5 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(o);
                    }}
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-[0.7rem] font-black text-white hover:bg-slate-800 transition-colors border-none cursor-pointer uppercase tracking-wider"
                  >
                    Ver detalle
                  </button>
                  <a
                    href={`https://wa.me/${o.compradorTel?.replace(/\D/g, '') || ''}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="size-10 flex items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 shrink-0"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MI name="chat" className="!text-sm" />
                  </a>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* DETALLE MODAL / SLIDE-OVER */}
      {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
              <div className="relative w-full max-w-lg h-full bg-slate-50 shadow-2xl flex flex-col animate-slide-left">
                  <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                      <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-50 rounded-full border-none bg-transparent cursor-pointer text-slate-400">
                              <MI name="close" />
                          </button>
                          <h2 className="text-xl font-black text-slate-900">Pedido #{selectedOrder.id}</h2>
                      </div>
                      <Badge status={selectedOrder.estado} />
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Cliente */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Datos del Cliente</h4>
                          <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                  <MI name="person" className="text-slate-300 !text-lg" />
                                  <span className="text-[.9rem] font-bold text-slate-700">{selectedOrder.compradorNombre}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <MI name="mail" className="text-slate-300 !text-lg" />
                                  <span className="text-[.9rem] text-slate-500">{selectedOrder.compradorEmail}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <MI name="call" className="text-slate-300 !text-lg" />
                                  <span className="text-[.9rem] text-slate-500">{selectedOrder.compradorTel}</span>
                              </div>
                          </div>
                      </div>

                      {/* Dirección y Pago */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-3">Envío</h4>
                            <p className="text-[.85rem] font-bold text-slate-700 leading-tight">
                                {selectedOrder.direccionCalle} {selectedOrder.direccionNumero}
                            </p>
                            <p className="text-[.75rem] text-slate-400 mt-1">{selectedOrder.direccionCiudad}, {selectedOrder.direccionProv}</p>
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-[.65rem] font-bold text-slate-500">
                                <MI name="local_shipping" className="!text-[12px]" /> {selectedOrder.metodoEntrega?.nombre || 'Default'}
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                             <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-3">Pago</h4>
                             <p className="text-[.85rem] font-bold text-slate-700">{selectedOrder.metodoPago?.nombre || 'Default'}</p>
                             <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 text-[.65rem] font-bold text-green-600">
                                <MI name="payments" className="!text-[12px]" /> Pago registrado
                            </div>
                        </div>
                      </div>

                      {/* Notas */}
                      {selectedOrder.notasCliente && (
                          <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 border-dashed">
                              <h4 className="text-[.65rem] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                  <MI name="priority_high" className="!text-xs" /> Nota del Cliente
                              </h4>
                              <p className="text-[.85rem] text-amber-800 italic leading-relaxed">"{selectedOrder.notasCliente}"</p>
                          </div>
                      )}

                      {/* Info de Items - Simulado o fetched */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h4 className="text-[.65rem] font-black text-slate-400 uppercase tracking-widest mb-4">Productos</h4>
                          <div className="space-y-4">
                              {/* Esta info viene en la relación items si es que fetchById incluye items */}
                              {selectedOrder.items?.map((item: any) => (
                                  <div key={item.id} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                              {item.cantidad}x
                                          </div>
                                          <div>
                                              <p className="text-[.85rem] font-bold text-slate-800">{item.nombreProd}</p>
                                              {item.nombreVar && <p className="text-[.7rem] text-slate-400 line-clamp-1">{item.nombreVar}</p>}
                                          </div>
                                      </div>
                                      <span className="text-[.9rem] font-bold text-slate-700">${Number(item.subtotal).toLocaleString()}</span>
                                  </div>
                              ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-dashed border-slate-100 flex justify-between items-center">
                              <span className="text-[.85rem] font-black text-slate-900 uppercase">Total Pedido</span>
                              <span className="text-xl font-black text-slate-900">${Number(selectedOrder.total).toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  {/* Footer con acciones de estado */}
                  <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-3">
                      {selectedOrder.estado === 'PENDIENTE' && (
                          <button 
                            onClick={() => updateStatus({ id: selectedOrder.id, estado: 'CONFIRMADO' })}
                            className="col-span-2 py-4 rounded-2xl bg-slate-900 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-colors"
                          >
                              Confirmar Pedido
                          </button>
                      )}
                      {selectedOrder.estado === 'CONFIRMADO' && (
                           <button 
                            onClick={() => updateStatus({ id: selectedOrder.id, estado: 'EN_CAMINO' })}
                            className="col-span-2 py-4 rounded-2xl bg-violet-600 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-violet-700 transition-colors"
                           >
                               Marcar en Camino
                           </button>
                      )}
                      {selectedOrder.estado === 'EN_CAMINO' && (
                           <button 
                            onClick={() => updateStatus({ id: selectedOrder.id, estado: 'ENTREGADO' })}
                            className="col-span-2 py-4 rounded-2xl bg-green-600 border-none text-white font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-green-700 transition-colors"
                           >
                               Marcar como Entregado
                           </button>
                      )}
                      
                      {selectedOrder.estado !== 'ENTREGADO' && selectedOrder.estado !== 'CANCELADO' && (
                          <button 
                           onClick={() => updateStatus({ id: selectedOrder.id, estado: 'CANCELADO' })}
                           className="py-3 px-4 rounded-xl bg-red-50 text-red-600 border-none font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                          >
                              Cancelar
                          </button>
                      )}

                      <a
                        href={`https://wa.me/${selectedOrder.compradorTel?.replace(/\D/g, '') || ''}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white border-none font-bold text-xs uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-90 no-underline"
                      >
                          <MI name="chat" className="!text-sm" /> WhatsApp
                      </a>
                  </div>
              </div>
          </div>
      )}

      <style>{`
          @keyframes slideLeft {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
          }
          .animate-slide-left {
              animation: slideLeft 0.3s ease-out;
          }
          .no-scrollbar::-webkit-scrollbar {
              display: none;
          }
      `}</style>
    </div>
  );
};

export default OrdersSection;
