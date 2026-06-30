import { useState } from 'react';
import {
  useMetodosPagoCatalogo,
  useMetodosEntregaCatalogo,
  useAgregarMetodoPago,
  useActualizarMetodoPago,
  useEliminarMetodoPago,
  useAgregarMetodoEntrega,
  useActualizarMetodoEntrega,
  useEliminarMetodoEntrega,
  useMyShop,
  useMpResumen,
  useTestMp,
  useDesconectarMp,
} from '../../hooks/useShop';

// ─── Helpers: detectar tipo de método ────────────────────────────────────────

function esMercadoPago(nombre: string) {
  const n = nombre.toLowerCase();
  return n.includes('mercado') || n.includes('mercadopago');
}

function esTransferencia(nombre: string) {
  const n = nombre.toLowerCase();
  return n.includes('transfer') || n.includes('cbu') || n.includes('alias');
}

// Resuelve el estado visual de un método de pago activo.
// Mercado Pago solo cuenta como "habilitado" si la conexión está verificada (estado 'activo').
type EstadoMetodo = { tipo: 'activo' | 'pendiente' | 'error'; label: string };
function estadoPago(nombre: string, config: any, mpResumen: any): EstadoMetodo {
  if (esMercadoPago(nombre)) {
    const tieneToken = !!config?.configExtra?.mpAccessToken;
    if (!tieneToken) return { tipo: 'pendiente', label: 'Falta configurar' };
    const estado = mpResumen?.estado ?? 'pendiente';
    if (estado === 'activo') return { tipo: 'activo', label: 'Activo' };
    if (estado === 'error') return { tipo: 'error', label: 'Falta verificar' };
    return { tipo: 'pendiente', label: 'Falta verificar' };
  }
  if (esTransferencia(nombre)) {
    const ok = config?.configExtra?.alias || config?.configExtra?.cbu;
    return ok ? { tipo: 'activo', label: 'Activo' } : { tipo: 'pendiente', label: 'Faltan datos' };
  }
  return { tipo: 'activo', label: 'Activo' };
}

const BADGE_ESTADO: Record<EstadoMetodo['tipo'], string> = {
  activo: 'bg-green-100 text-green-700',
  pendiente: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};
const DOT_ESTADO: Record<EstadoMetodo['tipo'], string> = {
  activo: 'bg-green-500',
  pendiente: 'bg-amber-500',
  error: 'bg-red-500',
};

function esEnvioConCosto(nombre: string) {
  const n = nombre.toLowerCase();
  return n.includes('domicilio') || n.includes('correo') || n.includes('oca') ||
    n.includes('andreani') || n.includes('pickit') || n.includes('envio') || n.includes('envío');
}

// ─── Íconos por método ────────────────────────────────────────────────────────

const METHOD_IMGS: Record<string, string> = {
  'efectivo': '/src/assets/SVG/Efectivo.png',
  'transferencia bancaria': '/src/assets/SVG/Transferencias.png',
  'transferencia': '/src/assets/SVG/Transferencias.png',
  'mercado pago': '/src/assets/SVG/MP.png',
  'mercadopago': '/src/assets/SVG/MP.png',
  'cuenta dni': '/src/assets/SVG/Cuenta-DNI.png',
  'uala': '/src/assets/SVG/Ualá.png',
  'naranja x': '/src/assets/SVG/Naranja-X.png',
  'retiro en tienda': '/src/assets/SVG/Local.png',
  'envío a domicilio': '/src/assets/SVG/Delivery.png',
  'envio a domicilio': '/src/assets/SVG/Delivery.png',
  'correo argentino': '/src/assets/SVG/CorreoArgentino.png',
  'oca': '/src/assets/SVG/OCA.png',
  'andreani': '/src/assets/SVG/Andreani.png',
  'pickit': '/src/assets/SVG/Pickit.png',
  'punto de retiro': '/src/assets/SVG/PuntodeRetiro.png',
};

function MethodIcon({ nombre, size = 28 }: { nombre: string; size?: number }) {
  const key = nombre.toLowerCase();
  const src = METHOD_IMGS[key];
  if (src) return <img src={src} alt={nombre} style={{ width: size, height: size, objectFit: 'contain' }} />;
  return (
    <div className="rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs"
      style={{ width: size, height: size }}>{nombre[0]?.toUpperCase()}</div>
  );
}

// ─── Formulario de configuración de PAGO ────────────────────────────────────

function FormPago({
  metodo,
  initial,
  onSave,
  onCancel,
  isSaving,
  mpResumen,
  onTestMp,
  isTestingMp,
  onDesconectar,
  isDisconnecting,
}: {
  metodo: any;
  initial: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
  mpResumen?: any;
  onTestMp?: () => void;
  isTestingMp?: boolean;
  onDesconectar?: () => void;
  isDisconnecting?: boolean;
}) {
  const [form, setForm] = useState({
    detalle: initial?.detalle ?? '',
    mpAccessToken: initial?.configExtra?.mpAccessToken ?? '',
    mpPublicKey: initial?.configExtra?.mpPublicKey ?? '',
    cbu: initial?.configExtra?.cbu ?? '',
    alias: initial?.configExtra?.alias ?? '',
    banco: initial?.configExtra?.banco ?? '',
    titular: initial?.configExtra?.titular ?? '',
  });

  const nombre = metodo?.nombre ?? '';
  const esMp = esMercadoPago(nombre);
  const esTrans = esTransferencia(nombre);

  const handleSave = () => {
    const configExtra: any = {};
    if (esMp) {
      if (form.mpAccessToken) configExtra.mpAccessToken = form.mpAccessToken;
      if (form.mpPublicKey) configExtra.mpPublicKey = form.mpPublicKey;
    } else if (esTrans) {
      if (form.cbu) configExtra.cbu = form.cbu;
      if (form.alias) configExtra.alias = form.alias;
      if (form.banco) configExtra.banco = form.banco;
      if (form.titular) configExtra.titular = form.titular;
    }
    onSave({ detalle: form.detalle || undefined, configExtra: Object.keys(configExtra).length ? configExtra : undefined });
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
      {/* Mercado Pago */}
      {esMp && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              Credenciales de Mercado Pago
            </p>
            {/* Badge de estado */}
            {mpResumen?.configurado && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                mpResumen.estado === 'activo'
                  ? 'bg-green-100 text-green-700'
                  : mpResumen.estado === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  mpResumen.estado === 'activo' ? 'bg-green-500'
                  : mpResumen.estado === 'error' ? 'bg-red-500'
                  : 'bg-yellow-500'
                }`} />
                {mpResumen.estado === 'activo'
                  ? `Activo · ${mpResumen.mpUser ?? ''}`
                  : mpResumen.estado === 'error'
                  ? 'Error de credenciales'
                  : 'Sin verificar'}
              </span>
            )}
          </div>

          {mpResumen?.configurado ? (
            /* ── YA CONFIGURADO: campos bloqueados + acciones ── */
            <div className="bg-indigo-50 rounded-lg p-3 space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Access Token</label>
                <input
                  type="text" readOnly disabled
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-100 text-gray-400 font-mono cursor-not-allowed"
                  value="••••••••••••••••••••••••"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Public Key</label>
                <input
                  type="text" readOnly disabled
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-100 text-gray-400 font-mono cursor-not-allowed"
                  value={mpResumen.tienePublicKey ? '••••••••••••••••••••••••' : '— sin public key —'}
                />
              </div>

              {mpResumen?.estado === 'error' && mpResumen.ultimoError && (
                <p className="text-[10px] text-red-500 bg-red-50 rounded px-2 py-1">{mpResumen.ultimoError}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                {onTestMp && (
                  <button
                    type="button"
                    onClick={onTestMp}
                    disabled={isTestingMp || isDisconnecting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                  >
                    {isTestingMp ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Probando...
                      </>
                    ) : 'Verificar conexión'}
                  </button>
                )}
                {onDesconectar && (
                  <button
                    type="button"
                    onClick={() => { if (confirm('¿Desconectar Mercado Pago? Vas a tener que volver a cargar el Access Token.')) onDesconectar(); }}
                    disabled={isDisconnecting || isTestingMp}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {isDisconnecting ? 'Desconectando...' : 'Desconectar'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── NO CONFIGURADO: inputs editables ── */
            <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
              <div>
                <label className="text-xs text-gray-500 font-medium">Access Token</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400 font-mono"
                  value={form.mpAccessToken}
                  onChange={e => setForm(f => ({ ...f, mpAccessToken: e.target.value }))}
                  placeholder="APP_USR-..."
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Obtené tu Access Token en{' '}
                  <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
                    developers.mercadopago.com
                  </a>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Public Key</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400 font-mono"
                  value={form.mpPublicKey}
                  onChange={e => setForm(f => ({ ...f, mpPublicKey: e.target.value }))}
                  placeholder="APP_USR-..."
                />
              </div>
              <p className="text-[10px] text-gray-500">Guardá las credenciales y después verificá la conexión.</p>
            </div>
          )}
        </div>
      )}

      {/* Transferencia */}
      {esTrans && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Datos bancarios
          </p>
          <div className="bg-blue-50 rounded-lg p-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 font-medium">CBU</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400 font-mono"
                value={form.cbu}
                onChange={e => setForm(f => ({ ...f, cbu: e.target.value }))}
                placeholder="0000000000000000000000"
                maxLength={22}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Alias</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400"
                value={form.alias}
                onChange={e => setForm(f => ({ ...f, alias: e.target.value }))}
                placeholder="mi.alias.banco"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Banco</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400"
                value={form.banco}
                onChange={e => setForm(f => ({ ...f, banco: e.target.value }))}
                placeholder="Ej: Banco Galicia"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Titular</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400"
                value={form.titular}
                onChange={e => setForm(f => ({ ...f, titular: e.target.value }))}
                placeholder="Nombre Apellido"
              />
            </div>
          </div>
        </div>
      )}

      {/* Detalle libre (para todos) */}
      <div>
        <label className="text-xs text-gray-500 font-medium">Nota visible al cliente (opcional)</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
          value={form.detalle}
          onChange={e => setForm(f => ({ ...f, detalle: e.target.value }))}
          placeholder="Ej: Solo efectivo en persona"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Formulario de configuración de ENVÍO ────────────────────────────────────

function FormEntrega({
  metodo,
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  metodo: any;
  initial: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    zonaCobertura: initial?.zonaCobertura ?? '',
    detalle: initial?.detalle ?? '',
    costo: initial?.costo != null ? String(initial.costo) : '',
    costoGratis: initial?.costoGratis != null ? String(initial.costoGratis) : '',
    tiempoEstimado: initial?.tiempoEstimado ?? '',
  });

  const conCosto = esEnvioConCosto(metodo?.nombre ?? '') || metodo?.metodoEntrega?.permiteZona;

  const handleSave = () => {
    onSave({
      zonaCobertura: form.zonaCobertura || undefined,
      detalle: form.detalle || undefined,
      costo: form.costo !== '' ? Number(form.costo) : null,
      costoGratis: form.costoGratis !== '' ? Number(form.costoGratis) : null,
      tiempoEstimado: form.tiempoEstimado || undefined,
    });
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
      {/* Costo de envío */}
      {conCosto && (
        <div className="bg-amber-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Configuración de costo
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 font-medium">Costo del envío ($)</label>
              <input
                type="number"
                min={0}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-amber-400"
                value={form.costo}
                onChange={e => setForm(f => ({ ...f, costo: e.target.value }))}
                placeholder="0 = gratis"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Gratis a partir de ($)</label>
              <input
                type="number"
                min={0}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-amber-400"
                value={form.costoGratis}
                onChange={e => setForm(f => ({ ...f, costoGratis: e.target.value }))}
                placeholder="Ej: 15000"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Tiempo estimado</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-amber-400"
              value={form.tiempoEstimado}
              onChange={e => setForm(f => ({ ...f, tiempoEstimado: e.target.value }))}
              placeholder="Ej: 2-3 días hábiles"
            />
          </div>
        </div>
      )}

      {/* Zona */}
      {metodo?.metodoEntrega?.permiteZona && (
        <div>
          <label className="text-xs text-gray-500 font-medium">Zona de cobertura</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
            value={form.zonaCobertura}
            onChange={e => setForm(f => ({ ...f, zonaCobertura: e.target.value }))}
            placeholder="Ej: Capital y GBA, Todo el país..."
          />
        </div>
      )}

      <div>
        <label className="text-xs text-gray-500 font-medium">Nota visible al cliente (opcional)</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
          value={form.detalle}
          onChange={e => setForm(f => ({ ...f, detalle: e.target.value }))}
          placeholder="Ej: Despacho a las 14hs, días hábiles"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MethodsSection(_props: { accent?: string } = {}) {
  const { data: tienda } = useMyShop();
  const { data: catalogoPagos = [] } = useMetodosPagoCatalogo();
  const { data: catalogoEntregas = [] } = useMetodosEntregaCatalogo();
  const { data: mpResumen } = useMpResumen();
  const testMp = useTestMp();
  const desconectarMp = useDesconectarMp();

  const agregarPago     = useAgregarMetodoPago();
  const actualizarPago  = useActualizarMetodoPago();
  const eliminarPago    = useEliminarMetodoPago();
  const agregarEntrega     = useAgregarMetodoEntrega();
  const actualizarEntrega  = useActualizarMetodoEntrega();
  const eliminarEntrega    = useEliminarMetodoEntrega();

  // Vista de detalle: cuando está seteada, mostramos solo la configuración de ese método
  const [detalle, setDetalle] = useState<{
    tipo: 'pago' | 'entrega';
    metodo: any;       // registro del catálogo
    config: any;       // config actual (null si es nuevo)
    isNew: boolean;
  } | null>(null);

  const pagosActivos: any[]    = tienda?.metodosPago ?? [];
  const entregasActivas: any[] = tienda?.metodosEntrega ?? [];

  const pagoActivoIds    = new Set(pagosActivos.map((p: any) => p.metodoPagoId));
  const entregaActivaIds = new Set(entregasActivas.map((e: any) => e.metodoEntregaId));

  const handleGuardarPago = async (metodoPagoId: number, isNew: boolean, data: any) => {
    if (isNew) await agregarPago.mutateAsync({ metodoPagoId, ...data });
    else await actualizarPago.mutateAsync({ id: metodoPagoId, data });
    setDetalle(null);
  };

  const handleGuardarEntrega = async (metodoEntregaId: number, isNew: boolean, data: any) => {
    if (isNew) await agregarEntrega.mutateAsync({ metodoEntregaId, ...data });
    else await actualizarEntrega.mutateAsync({ id: metodoEntregaId, data });
    setDetalle(null);
  };

  // ── VISTA DE DETALLE (configuración de un método) ──
  if (detalle) {
    const { tipo, metodo, config, isNew } = detalle;
    const esMp = tipo === 'pago' && esMercadoPago(metodo.nombre);
    return (
      <div className="space-y-6 max-w-2xl">
        <button
          onClick={() => setDetalle(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold cursor-pointer hover:bg-gray-200 transition-colors border-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>

        <div className="flex items-center gap-3">
          <MethodIcon nombre={metodo.nombre} size={44} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{metodo.nombre}</h2>
            <p className="text-xs text-gray-400">{isNew ? 'Configurar y activar este método' : 'Editar configuración'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {tipo === 'pago' ? (
            <FormPago
              metodo={metodo}
              initial={config}
              onSave={(data) => handleGuardarPago(metodo.id, isNew, data)}
              onCancel={() => setDetalle(null)}
              isSaving={agregarPago.isPending || actualizarPago.isPending}
              mpResumen={esMp ? mpResumen : undefined}
              onTestMp={esMp ? () => testMp.mutate() : undefined}
              isTestingMp={testMp.isPending}
              onDesconectar={esMp ? () => desconectarMp.mutate(undefined, { onSuccess: () => setDetalle(null) }) : undefined}
              isDisconnecting={desconectarMp.isPending}
            />
          ) : (
            <FormEntrega
              metodo={{ ...config, metodoEntrega: metodo }}
              initial={config}
              onSave={(data) => handleGuardarEntrega(metodo.id, isNew, data)}
              onCancel={() => setDetalle(null)}
              isSaving={agregarEntrega.isPending || actualizarEntrega.isPending}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── TABLA PAGOS ─────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Métodos de pago</h3>
        <p className="text-xs text-gray-400 mb-3">Activá los métodos que aceptás y configurá cada uno</p>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Configuración</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {catalogoPagos.map((metodo: any) => {
                const activo = pagoActivoIds.has(metodo.id);
                const config = pagosActivos.find((p: any) => p.metodoPagoId === metodo.id);

                return (
                  <tr key={metodo.id} className={`transition-colors ${activo ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <MethodIcon nombre={metodo.nombre} size={32} />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{metodo.nombre}</p>
                          {activo && config?.detalle && (
                            <p className="text-xs text-gray-400 mt-0.5">{config.detalle}</p>
                          )}
                          {activo && esTransferencia(metodo.nombre) && config?.configExtra?.alias && (
                            <p className="text-xs text-gray-400 mt-0.5">Alias: {config.configExtra.alias}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top hidden sm:table-cell">
                      {activo ? (
                        <p className="text-xs text-gray-400">{metodo.descripcion}</p>
                      ) : (
                        <p className="text-xs text-gray-300">{metodo.descripcion}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      {activo ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {(() => {
                            const est = estadoPago(metodo.nombre, config, mpResumen);
                            return (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_ESTADO[est.tipo]}`} title={est.tipo === 'error' ? (mpResumen?.ultimoError ?? undefined) : undefined}>
                                <span className={`w-1.5 h-1.5 rounded-full ${DOT_ESTADO[est.tipo]}`} />
                                {est.label}
                              </span>
                            );
                          })()}
                          <button
                            onClick={() => setDetalle({ tipo: 'pago', metodo, config, isNew: false })}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Configurar"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { if (confirm(`¿Quitar ${metodo.nombre}?`)) eliminarPago.mutate(metodo.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Quitar"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDetalle({ tipo: 'pago', metodo, config: null, isNew: true })}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                          </svg>
                          Configurar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TABLA ENVÍOS ─────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Métodos de envío y retiro</h3>
        <p className="text-xs text-gray-400 mb-3">Configurá precios, zonas y tiempos de entrega</p>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Costo / Zona</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {catalogoEntregas.map((metodo: any) => {
                const activo = entregaActivaIds.has(metodo.id);
                const config = entregasActivas.find((e: any) => e.metodoEntregaId === metodo.id);

                return (
                  <tr key={metodo.id} className={`transition-colors ${activo ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <MethodIcon nombre={metodo.nombre} size={32} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{metodo.nombre}</p>
                          {activo && config?.tiempoEstimado && (
                            <p className="text-xs text-gray-400 mt-0.5">{config.tiempoEstimado}</p>
                          )}
                          {activo && config?.zonaCobertura && (
                            <p className="text-xs text-gray-400 mt-0.5">📍 {config.zonaCobertura}</p>
                          )}
                          {activo && config?.detalle && (
                            <p className="text-xs text-gray-400 mt-0.5">{config.detalle}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top hidden sm:table-cell">
                      {activo && config?.costo != null ? (
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-gray-700">
                            {Number(config.costo) === 0 ? 'Gratis' : `$${Number(config.costo).toLocaleString('es-AR')}`}
                          </p>
                          {config.costoGratis && (
                            <p className="text-xs text-gray-400">
                              Gratis desde ${Number(config.costoGratis).toLocaleString('es-AR')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300">{metodo.descripcion || '—'}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      {activo ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Activo
                          </span>
                          <button
                            onClick={() => setDetalle({ tipo: 'entrega', metodo, config, isNew: false })}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Configurar"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { if (confirm(`¿Quitar ${metodo.nombre}?`)) eliminarEntrega.mutate(metodo.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Quitar"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDetalle({ tipo: 'entrega', metodo, config: null, isNew: true })}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                          </svg>
                          Configurar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
