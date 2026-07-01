import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getConfigEmailFn,
  guardarConfigEmailFn,
  verificarConfigEmailFn,
  type ProveedorEmail,
  type GuardarConfigEmailInput,
} from '../api/shop.api';
import MI from './MaterialIcon';

// Sección del panel para que el dueño configure SU PROPIO proveedor de email
// (Brevo / Gmail / SMTP). Es requisito para luego poder enviar campañas masivas.
// La credencial (API key o app password) se cifra en el backend; acá nunca la
// recibimos de vuelta, solo sabemos si hay una cargada.

const PROVEEDORES: { id: ProveedorEmail; label: string; ayuda: string }[] = [
  { id: 'brevo', label: 'Brevo', ayuda: 'Solo necesitás tu API key de Brevo.' },
  { id: 'gmail', label: 'Gmail', ayuda: 'Usá una contraseña de aplicación, no la de tu cuenta.' },
  { id: 'smtp', label: 'Otro (SMTP)', ayuda: 'Cualquier proveedor con servidor SMTP.' },
];

interface EmailConfigSectionProps {
  accent?: string;
  // Cuando se monta desde Marketing con "Editar", arranca en modo edición.
  arrancarEditando?: boolean;
  // Botón para volver a la vista de campañas (solo se muestra si se pasa).
  onVolver?: () => void;
}

const EmailConfigSection = ({ accent = '#6366f1', arrancarEditando = false, onVolver }: EmailConfigSectionProps) => {
  const qc = useQueryClient();

  const { data: estado, isLoading } = useQuery({
    queryKey: ['configEmail'],
    queryFn: getConfigEmailFn,
  });

  // Estado del formulario
  const [proveedor, setProveedor] = useState<ProveedorEmail>('brevo');
  const [remitente, setRemitente] = useState('');
  const [remitenteNombre, setRemitenteNombre] = useState('');
  const [credencial, setCredencial] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [usuario, setUsuario] = useState('');
  // Cuando la config ya está verificada, el form arranca bloqueado (solo-lectura).
  // "Editar" lo desbloquea, igual que hace Mercado Pago en MethodsSection.
  const [editando, setEditando] = useState(arrancarEditando);

  // Precargamos el form con la config guardada (sin la credencial, que no viaja).
  useEffect(() => {
    if (!estado) return;
    if (estado.proveedor) setProveedor(estado.proveedor);
    setRemitente(estado.remitente ?? '');
    setRemitenteNombre(estado.remitenteNombre ?? '');
    setHost(estado.host ?? '');
    setPort(estado.port ? String(estado.port) : '');
    setUsuario(estado.usuario ?? '');
  }, [estado]);

  const esSmtp = proveedor === 'gmail' || proveedor === 'smtp';

  const guardar = useMutation({
    mutationFn: () => {
      const input: GuardarConfigEmailInput = {
        proveedor,
        remitente: remitente.trim().toLowerCase(),
        remitenteNombre: remitenteNombre.trim() || undefined,
        credencial: credencial.trim() || undefined,
      };
      if (esSmtp) {
        input.host = host.trim() || undefined;
        input.port = port ? Number(port) : undefined;
        input.usuario = usuario.trim() || undefined;
      }
      return guardarConfigEmailFn(input);
    },
    onSuccess: () => {
      toast.success('Configuración guardada. Verificá la conexión para empezar a enviar.');
      setCredencial(''); // no la dejamos en pantalla
      setEditando(false);
      qc.invalidateQueries({ queryKey: ['configEmail'] });
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.mensaje ?? 'No se pudo guardar la configuración'),
  });

  const verificar = useMutation({
    mutationFn: verificarConfigEmailFn,
    onSuccess: (r) => {
      toast.success(r.mensaje ?? 'Conexión verificada');
      qc.invalidateQueries({ queryKey: ['configEmail'] });
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.mensaje ?? 'No pudimos verificar la conexión'),
  });

  if (isLoading) {
    return <div className="p-6 text-slate-400 text-sm">Cargando…</div>;
  }

  const verificado = estado?.verificado ?? false;
  const tieneCredencial = estado?.tieneCredencial ?? false;
  const placeholderCred = proveedor === 'brevo' ? 'Tu API key de Brevo' : 'Contraseña / app password';
  // El form se bloquea cuando la config está verificada y no estamos editando.
  const bloqueado = verificado && !editando;

  return (
    <div className="space-y-5">
      {onVolver && (
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"
        >
          <MI name="arrow_back" className="!text-base" /> Volver a campañas
        </button>
      )}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Servicio de email</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configurá tu proveedor de email para poder enviar campañas a tus clientes. Tus
          credenciales se guardan cifradas y nunca se comparten.
        </p>
      </div>

      {/* Estado actual */}
      {estado?.proveedor && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-3">
          <div
            className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
              verificado ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <MI name={verificado ? 'mark_email_read' : 'pending'} className="!text-xl" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 capitalize">{estado.proveedor}</p>
            <p className={`text-xs font-semibold ${verificado ? 'text-green-600' : 'text-amber-600'}`}>
              {verificado ? 'Conexión verificada — listo para enviar' : 'Pendiente de verificación'}
            </p>
          </div>
        </div>
      )}

      {/* ── VISTA BLOQUEADA (config verificada, solo-lectura) ── */}
      {bloqueado ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">Configuración</label>
            <button
              onClick={() => setEditando(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 transition"
            >
              <MI name="edit" className="!text-sm" />
              Editar
            </button>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <span className="text-slate-400 font-semibold">Proveedor</span>
            <span className="text-slate-800 capitalize">{estado?.proveedor}</span>
            <span className="text-slate-400 font-semibold">Remitente</span>
            <span className="text-slate-800 break-all">
              {estado?.remitenteNombre ? `${estado.remitenteNombre} · ` : ''}
              {estado?.remitente}
            </span>
            {esSmtp && (
              <>
                <span className="text-slate-400 font-semibold">Servidor</span>
                <span className="text-slate-800">
                  {estado?.host}{estado?.port ? `:${estado.port}` : ''}
                </span>
              </>
            )}
            <span className="text-slate-400 font-semibold">Credencial</span>
            <span className="text-slate-800 font-mono">•••••••• (guardada)</span>
          </div>
        </div>
      ) : (
        /* ── VISTA EDITABLE (formulario) ── */
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-700">Proveedor</label>
          <div className="grid grid-cols-3 gap-2">
            {PROVEEDORES.map((p) => (
              <button
                key={p.id}
                onClick={() => setProveedor(p.id)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  proveedor === p.id
                    ? 'border-transparent text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
                style={proveedor === p.id ? { backgroundColor: accent } : undefined}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{PROVEEDORES.find((p) => p.id === proveedor)?.ayuda}</p>

          {/* Remitente */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Email del remitente</label>
            <input
              value={remitente}
              onChange={(e) => setRemitente(e.target.value)}
              placeholder="ventas@mitienda.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Nombre visible */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Nombre visible (opcional)</label>
            <input
              value={remitenteNombre}
              onChange={(e) => setRemitenteNombre(e.target.value)}
              placeholder="Mi Tienda"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Campos SMTP (solo Gmail / SMTP) */}
          {esSmtp && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-slate-600">Host SMTP</label>
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder={proveedor === 'gmail' ? 'smtp.gmail.com' : 'smtp.tuproveedor.com'}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Puerto</label>
                <input
                  value={port}
                  onChange={(e) => setPort(e.target.value.replace(/\D/g, ''))}
                  placeholder="587"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Usuario</label>
                <input
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="tu email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>
          )}

          {/* Credencial */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              {proveedor === 'brevo' ? 'API key' : 'Contraseña / app password'}
            </label>
            <input
              type="password"
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              placeholder={tieneCredencial ? '•••••••• (dejá vacío para conservar)' : placeholderCred}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => guardar.mutate()}
              disabled={!remitente.trim() || guardar.isPending}
              className="flex-1 rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {guardar.isPending ? 'Guardando…' : 'Guardar configuración'}
            </button>
            {/* Cancelar solo tiene sentido si veníamos de una config ya verificada */}
            {verificado && (
              <button
                onClick={() => { setEditando(false); setCredencial(''); }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verificación de conexión */}
      {estado?.proveedor && (
        <div
          className={`rounded-2xl border p-5 shadow-sm space-y-3 ${
            verificado ? 'border-green-100 bg-green-50/40' : 'border-amber-100 bg-amber-50/50'
          }`}
        >
          <p className="text-sm font-bold text-slate-800">
            {verificado ? 'Conexión verificada' : 'Probá tu conexión'}
          </p>
          <p className="text-xs text-slate-500">
            {verificado
              ? 'Tu proveedor está listo. Ya vas a poder enviar campañas a tus clientes.'
              : 'Verificamos que tus credenciales funcionen conectándonos a tu proveedor.'}
          </p>
          <button
            onClick={() => verificar.mutate()}
            disabled={verificar.isPending || !tieneCredencial}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: verificado ? '#16a34a' : accent }}
          >
            {verificar.isPending
              ? 'Verificando…'
              : verificado
                ? 'Volver a verificar'
                : 'Verificar conexión'}
          </button>
          {!tieneCredencial && (
            <p className="text-[11px] text-slate-400 text-center">
              Guardá primero tu credencial para poder verificar.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailConfigSection;
