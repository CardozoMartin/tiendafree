import { useState } from 'react';
import {
  useMetodosPagoCatalogo,
  useMetodosEntregaCatalogo,
  useAgregarMetodoPago,
  useEliminarMetodoPago,
  useAgregarMetodoEntrega,
  useEliminarMetodoEntrega,
  useMyShop,
} from '../../hooks/useShop';
import {
  Banknote, Building2, QrCode, CreditCard, Wallet,
  Store, Truck, Package, Handshake, Bike, CircleHelp, Check, Plus, Trash2
} from 'lucide-react';
import DashboardHelp from '../DashboardHelp';

const getLucideIcon = (name: string, className?: string) => {
  const map: Record<string, any> = {
    payments: Banknote,
    account_balance: Building2,
    qr_code_2: QrCode,
    credit_card: CreditCard,
    account_balance_wallet: Wallet,
    storefront: Store,
    local_shipping: Truck,
    package_2: Package,
    handshake: Handshake,
    moped: Bike,
    payment: CreditCard,
  };
  const Icon = map[name] || CircleHelp;
  return <Icon className={className || "w-5 h-5"} strokeWidth={1.5} />;
};

// ── Custom Icon Mapping ────────────────────────────────────────────────────────
const METHOD_IMG_MAP: Record<string, string> = {
  // Pagos
  'efectivo': '/src/assets/SVG/Efectivo.png',
  'transferencia bancaria': '/src/assets/SVG/Transferencias.png',
  'transferencia': '/src/assets/SVG/Transferencias.png',
  'transferencias': '/src/assets/SVG/Transferencias.png',
  'tarjeta de crédito': '/src/assets/SVG/TarjetaDeCredito.png',
  'tarjeta de credito': '/src/assets/SVG/TarjetaDeCredito.png',
  'tarjeta de débito': '/src/assets/SVG/TarjetaDeCredito.png',
  'tarjeta de debito': '/src/assets/SVG/TarjetaDeCredito.png',
  'mercado pago': '/src/assets/SVG/PagosQR.png',
  'pagos qr': '/src/assets/SVG/PagosQR.png',
  'pago con qr': '/src/assets/SVG/PagosQR.png',
  'qr': '/src/assets/SVG/PagosQR.png',
  
  // Envíos
  'retiro en local': '/src/assets/SVG/RetiroLocal.png',
  'retiro del local': '/src/assets/SVG/RetiroLocal.png',
  'retiro por sucursal': '/src/assets/SVG/RetiroLocal.png',
  'retiro en el local': '/src/assets/SVG/RetiroLocal.png',
  'retiro por el local': '/src/assets/SVG/RetiroLocal.png',
  'punto de encuentro': '/src/assets/SVG/PuntoEncuentro.png',
  'cadetería propia': '/src/assets/SVG/CadeteriaPropia.png',
  'cadeteria propia': '/src/assets/SVG/CadeteriaPropia.png',
  'envio a domicilio con cadeteria propia': '/src/assets/SVG/CadeteriaPropia.png',
  'envío a todo el país': '/src/assets/SVG/EnvioTodoPais.png',
  'envio a todo el pais': '/src/assets/SVG/EnvioTodoPais.png',
  'correo argentino': '/src/assets/SVG/EnvioTodoPais.png',
  'uber flash': '/src/assets/SVG/Uber.png',
  'uber': '/src/assets/SVG/Uber.png',
  'envio a domicilio con ubber': '/src/assets/SVG/Uber.png',
};

const MethodIcon = ({ metodo, className }: { metodo: any, className?: string }) => {
  const nombreNormalizado = metodo.nombre?.toLowerCase().trim();
  const customImg = METHOD_IMG_MAP[nombreNormalizado];
  
  if (customImg) {
    return (
      <img 
        src={customImg} 
        alt={metodo.nombre} 
        className={className || "w-7 h-7 object-contain"} 
      />
    );
  }
  
  return getLucideIcon(metodo.icono || (metodo.metodoPagoId ? 'payments' : 'local_shipping'), className);
};

export default function MethodsSection({ accent }: { accent: string }) {
  const { data: myShop, isLoading: loadingShop } = useMyShop();
  const { data: pagoCatalogo = [], isLoading: loadingPago } = useMetodosPagoCatalogo();
  const { data: entregaCatalogo = [], isLoading: loadingEntrega } = useMetodosEntregaCatalogo();
  console.log('Métodos de pago en catálogo:', pagoCatalogo);
  console.log('Métodos de entrega en catálogo:', entregaCatalogo);

  const addPago = useAgregarMetodoPago();
  const removePago = useEliminarMetodoPago();
  const addEntrega = useAgregarMetodoEntrega();
  const removeEntrega = useEliminarMetodoEntrega();

  const [expandPago, setExpandPago] = useState<number | null>(null);
  const [expandEntrega, setExpandEntrega] = useState<number | null>(null);
  const [detalle, setDetalle] = useState('');
  const [zona, setZona] = useState('');

  // ── Loading ──
  if (loadingShop || loadingPago || loadingEntrega) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  const misMetodosPago: any[] = myShop?.metodosPago || [];
  const misMetodosEntrega: any[] = myShop?.metodosEntrega || [];

  const handleAddPago = (metodoPagoId: number) => {
    addPago.mutate(
      { metodoPagoId, detalle: detalle || undefined },
      { onSuccess: () => { setExpandPago(null); setDetalle(''); } }
    );
  };

  const handleAddEntrega = (metodoEntregaId: number) => {
    addEntrega.mutate(
      { metodoEntregaId, zonaCobertura: zona || undefined, detalle: detalle || undefined },
      { onSuccess: () => { setExpandEntrega(null); setZona(''); setDetalle(''); } }
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Métodos de pago y envío</h1>
          <p className="text-sm text-slate-500 mt-0.5">Elegí cómo cobrar y cómo entregar tus productos.</p>
        </div>
        <DashboardHelp activeSection="store-methods" accent={accent} />
      </div>

      <div className="space-y-8">

        {/* ══════════════════════════
            SECCIÓN: PAGOS
        ══════════════════════════ */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
                Pagos
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Activa o desactiva qué opciones ofreces a tus clientes.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {pagoCatalogo.map((metodo: any) => {
              const added = misMetodosPago.find((m: any) => m.metodoPagoId === metodo.id);
              const isOpen = expandPago === metodo.id;

              return (
                <div key={metodo.id} className="flex flex-col">
                  {/* Fila principal */}
                  <div className="flex items-center gap-4 px-6 py-5">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                      <MethodIcon metodo={metodo} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{metodo.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{metodo.descripcion}</p>
                    </div>

                    <div className="flex items-center gap-3">
                       {added ? (
                        <>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-100/50">
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Activo</span>
                          </div>
                          <button
                            onClick={() => removePago.mutate(metodo.id)}
                            disabled={removePago.isPending}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setExpandPago(isOpen ? null : metodo.id); setDetalle(''); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-white"
                          style={{ backgroundColor: accent }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalles activos (solo visual, si tiene texto y no está editando) */}
                  {added?.detalle && !isOpen && (
                    <div className="px-6 pb-4 pt-1">
                      <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 italic">
                          <span className="font-semibold not-italic mr-1 text-gray-600">Detalle:</span> {added.detalle}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Formulario de agregar */}
                  {isOpen && !added && (
                    <div className="px-6 pb-5 pt-2">
                       <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                          Información adicional (Opcional)
                        </label>
                        <input
                          className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400 bg-white"
                          placeholder="Ej: Alias: mialias, CBU: 000..."
                          value={detalle}
                          onChange={(e) => setDetalle(e.target.value)}
                        />
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleAddPago(metodo.id)}
                            disabled={addPago.isPending}
                            className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                            style={{ backgroundColor: accent }}
                          >
                            {addPago.isPending ? 'Guardando...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setExpandPago(null)}
                            className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-200/50 hover:text-gray-800 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════
            SECCIÓN: ENVÍOS
        ══════════════════════════ */}
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Envíos y Retiros
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Habilita las formas en que entregas tus productos.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {entregaCatalogo.map((metodo: any) => {
              const added = misMetodosEntrega.find((m: any) => m.metodoEntregaId === metodo.id);
              const isOpen = expandEntrega === metodo.id;

              return (
                <div key={metodo.id} className="flex flex-col">
                  {/* Fila principal */}
                  <div className="flex items-center gap-4 px-6 py-5">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                      <MethodIcon metodo={metodo} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{metodo.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{metodo.descripcion}</p>
                    </div>

                    <div className="flex items-center gap-3">
                       {added ? (
                        <>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-100/50">
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Activo</span>
                          </div>
                          <button
                            onClick={() => removeEntrega.mutate(metodo.id)}
                            disabled={removeEntrega.isPending}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setExpandEntrega(isOpen ? null : metodo.id); setDetalle(''); setZona(''); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-white"
                          style={{ backgroundColor: accent }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalles activos */}
                  {added && (added.detalle || added.zonaCobertura) && !isOpen && (
                    <div className="px-6 pb-4 pt-1">
                      <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 space-y-1">
                        {added.zonaCobertura && (
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-600 mr-1">Zona:</span> {added.zonaCobertura}
                          </p>
                        )}
                        {added.detalle && (
                          <p className="text-xs text-gray-500 italic">
                            <span className="font-semibold not-italic text-gray-600 mr-1">Detalle:</span> {added.detalle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Formulario de agregar */}
                  {isOpen && !added && (
                    <div className="px-6 pb-5 pt-2">
                       <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">
                        {metodo.permiteZona && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                              Zona de cobertura
                            </label>
                            <input
                              className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400 bg-white"
                              placeholder="Ej: CABA y GBA, o Todo el país"
                              value={zona}
                              onChange={(e) => setZona(e.target.value)}
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                            Información adicional (Opcional)
                          </label>
                          <input
                            className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400 bg-white"
                            placeholder="Ej: Despacho a partir de las 14hs..."
                            value={detalle}
                            onChange={(e) => setDetalle(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAddEntrega(metodo.id)}
                            disabled={addEntrega.isPending}
                            className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                            style={{ backgroundColor: accent }}
                          >
                            {addEntrega.isPending ? 'Guardando...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setExpandEntrega(null)}
                            className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-200/50 hover:text-gray-800 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
