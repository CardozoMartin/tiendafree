import { useState, useEffect, useRef } from 'react';
import { useClientes, useDetalleCliente, useClientesFiltros } from '../hooks/useClientes';
import type { ClienteResumen } from '../api/clientes.api';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatPeso(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE:   'bg-yellow-100 text-yellow-700',
  CONFIRMADO:  'bg-blue-100 text-blue-700',
  EN_PROCESO:  'bg-indigo-100 text-indigo-700',
  ENVIADO:     'bg-purple-100 text-purple-700',
  ENTREGADO:   'bg-green-100 text-green-700',
  CANCELADO:   'bg-red-100 text-red-600',
  APROBADO:    'bg-green-100 text-green-700',
  RECHAZADO:   'bg-red-100 text-red-600',
  EN_PROCESO_PAGO: 'bg-indigo-100 text-indigo-700',
};

// ── Panel de detalle ──────────────────────────────────────────────────────────

function PanelDetalle({ clienteId, onClose }: { clienteId: number; onClose: () => void }) {
  const { data: cliente, isLoading } = useDetalleCliente(clienteId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="relative h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Detalle del cliente</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Cargando...</div>
        )}

        {cliente && (
          <div className="flex-1 px-6 py-5 space-y-6">
            {/* Datos personales */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {cliente.nombre[0]?.toUpperCase()}{cliente.apellido[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-base">{cliente.nombre} {cliente.apellido}</p>
                <p className="text-sm text-gray-500">{cliente.email}</p>
                <p className="text-sm text-gray-500">{cliente.telefono}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    cliente.emailVerificado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cliente.emailVerificado ? 'Email verificado' : 'Sin verificar'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    cliente.activo ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-800">{cliente.stats.totalPedidos}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Pedidos</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-800">{formatPeso(cliente.stats.totalGastado)}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Total gastado</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{cliente.stats.pedidosAprobados}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Aprobados</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">Cliente desde {formatFecha(cliente.creadoEn)}</p>

            {/* Historial de pedidos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de pedidos</h3>
              {cliente.pedidos.length === 0 ? (
                <p className="text-sm text-gray-400">Sin pedidos todavía</p>
              ) : (
                <div className="space-y-3">
                  {cliente.pedidos.map(pedido => (
                    <div key={pedido.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      {/* Header pedido */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">#{pedido.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ESTADO_BADGE[pedido.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {pedido.estado}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ESTADO_BADGE[pedido.estadoPago] ?? 'bg-gray-100 text-gray-600'}`}>
                            {pedido.estadoPago}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{formatFecha(pedido.creadoEn)}</span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5">
                        {pedido.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {item.imagenUrl && (
                              <img src={item.imagenUrl} alt={item.nombreProd}
                                className="w-8 h-8 rounded object-cover flex-shrink-0 border border-gray-100" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700 truncate">
                                {item.nombreProd}{item.nombreVar ? ` — ${item.nombreVar}` : ''}
                              </p>
                              <p className="text-[10px] text-gray-400">{item.cantidad}x {formatPeso(Number(item.precioUnit))}</p>
                            </div>
                            <p className="text-xs font-medium text-gray-700 flex-shrink-0">{formatPeso(Number(item.subtotal))}</p>
                          </div>
                        ))}
                      </div>

                      {/* Footer pedido */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-[11px] text-gray-400 space-y-0.5">
                          <p>💳 {pedido.metodoPago?.nombre}</p>
                          <p>📦 {pedido.metodoEntrega?.nombre}</p>
                          <p>📍 {pedido.direccionCalle}, {pedido.direccionCiudad}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">{formatPeso(Number(pedido.total))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ClientesSection() {
  const { pagina, setPagina, busqueda, setBusqueda, limite, resetPagina } = useClientesFiltros();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [inputBusqueda, setInputBusqueda] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useClientes({ pagina, limite, busqueda: busqueda || undefined });

  const clientes: ClienteResumen[] = data?.datos ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = data?.totalPaginas ?? 1;

  // Debounce búsqueda
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setBusqueda(inputBusqueda);
      resetPagina();
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputBusqueda]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Clientes</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} registrados en tu tienda</p>
        </div>
        {/* Buscador */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none"
            stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={inputBusqueda}
            onChange={e => setInputBusqueda(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="pl-8 pr-8 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500 w-64"
          />
          {inputBusqueda && (
            <button onClick={() => { setInputBusqueda(''); setBusqueda(''); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Teléfono</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedidos</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Total gastado</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Último pedido</th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">Cargando clientes...</td></tr>
            )}
            {!isLoading && clientes.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">
                {busqueda ? 'No se encontraron clientes con esa búsqueda' : 'Todavía no tenés clientes registrados'}
              </td></tr>
            )}
            {clientes.map(cliente => (
              <tr
                key={cliente.id}
                onClick={() => setClienteSeleccionado(cliente.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">
                      {cliente.nombre[0]?.toUpperCase()}{cliente.apellido[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{cliente.nombre} {cliente.apellido}</p>
                      <p className="text-xs text-gray-400">{cliente.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{cliente.telefono}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    cliente.stats.totalPedidos > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cliente.stats.totalPedidos}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs font-medium text-gray-700 hidden sm:table-cell">
                  {cliente.stats.totalGastado > 0 ? formatPeso(cliente.stats.totalGastado) : '—'}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {cliente.stats.ultimoPedido ? (
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ESTADO_BADGE[cliente.stats.ultimoPedido.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {cliente.stats.ultimoPedido.estado}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{formatFecha(cliente.stats.ultimoPedido.fecha)}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {cliente.emailVerificado
                      ? <span className="w-2 h-2 rounded-full bg-green-500" title="Email verificado" />
                      : <span className="w-2 h-2 rounded-full bg-yellow-400" title="Sin verificar" />
                    }
                    {!cliente.activo && <span className="w-2 h-2 rounded-full bg-red-400" title="Inactivo" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Página {pagina} de {totalPaginas}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Panel lateral de detalle */}
      {clienteSeleccionado !== null && (
        <PanelDetalle
          clienteId={clienteSeleccionado}
          onClose={() => setClienteSeleccionado(null)}
        />
      )}
    </div>
  );
}
