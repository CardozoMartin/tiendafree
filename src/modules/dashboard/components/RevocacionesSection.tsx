import { useState } from 'react';
import { Mail, Phone, Package, FileText, ChevronDown } from 'lucide-react';
import {
  useActualizarRevocacion,
  useRevocaciones,
} from '../hooks/useRevocaciones';
import type { EstadoRevocacion, IRevocacion } from '../api/revocaciones.api';

interface Props {
  accent: string;
}

const ESTADOS: { value: EstadoRevocacion; label: string; cls: string }[] = [
  { value: 'PENDIENTE', label: 'Pendiente', cls: 'bg-amber-100 text-amber-700' },
  { value: 'EN_PROCESO', label: 'En proceso', cls: 'bg-blue-100 text-blue-700' },
  { value: 'RESUELTA', label: 'Resuelta', cls: 'bg-green-100 text-green-700' },
  { value: 'RECHAZADA', label: 'Rechazada', cls: 'bg-red-100 text-red-600' },
];

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function RevocacionesSection({ accent }: Props) {
  const { data: solicitudes = [], isLoading } = useRevocaciones();
  const actualizar = useActualizarRevocacion();
  const [expandida, setExpandida] = useState<number | null>(null);

  const cambiarEstado = (id: number, estado: EstadoRevocacion) =>
    actualizar.mutate({ id, payload: { estado } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Botón de arrepentimiento</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Solicitudes de revocación de compra de tus clientes (Ley 24.240, art. 34).
        </p>
      </div>

      {/* Aviso legal */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-sm text-blue-900/80 mb-6 flex gap-3">
        <FileText className="w-5 h-5 shrink-0 text-blue-500" />
        <p>
          El consumidor puede arrepentirse de su compra dentro de los <strong>10 días corridos</strong>{' '}
          de recibido el producto, sin costo ni justificación. El <strong>costo de devolución</strong>{' '}
          corre por tu cuenta. Gestioná cada solicitud y mantené actualizado su estado.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400 py-8 text-center">Cargando…</p>
      ) : solicitudes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-slate-500">Todavía no recibiste solicitudes de arrepentimiento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <SolicitudCard
              key={s.id}
              s={s}
              accent={accent}
              expandida={expandida === s.id}
              onToggle={() => setExpandida(expandida === s.id ? null : s.id)}
              onEstado={(estado) => cambiarEstado(s.id, estado)}
              onResponder={(respuestaOwner) =>
                actualizar.mutate({ id: s.id, payload: { respuestaOwner } })
              }
              guardando={actualizar.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  s: IRevocacion;
  accent: string;
  expandida: boolean;
  onToggle: () => void;
  onEstado: (estado: EstadoRevocacion) => void;
  onResponder: (respuesta: string) => void;
  guardando: boolean;
}

function SolicitudCard({ s, accent, expandida, onToggle, onEstado, onResponder, guardando }: CardProps) {
  const [respuesta, setRespuesta] = useState(s.respuestaOwner ?? '');
  const estadoActual = ESTADOS.find((e) => e.value === s.estado) ?? ESTADOS[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Cabecera */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${accent}15`, color: accent }}>
              {s.codigo}
            </span>
            <span className="text-sm font-semibold text-slate-800">{s.nombre}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${estadoActual.cls}`}>
              {estadoActual.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{fmtFecha(s.creadoEn)}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${expandida ? 'rotate-180' : ''}`} />
      </button>

      {/* Detalle */}
      {expandida && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-4">
          {/* Datos del cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-3">
            <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <Mail className="w-4 h-4 text-slate-400" /> {s.email}
            </a>
            {s.telefono && (
              <a href={`tel:${s.telefono}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <Phone className="w-4 h-4 text-slate-400" /> {s.telefono}
              </a>
            )}
            {(s.pedidoId || s.nroPedidoTexto) && (
              <div className="flex items-center gap-2 text-slate-600">
                <Package className="w-4 h-4 text-slate-400" />
                Pedido #{s.pedidoId ?? s.nroPedidoTexto}
                {!s.pedidoId && s.nroPedidoTexto && (
                  <span className="text-[11px] text-amber-600">(no encontrado)</span>
                )}
              </div>
            )}
          </div>

          {s.motivo && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Motivo</p>
              <p className="text-sm text-slate-700">{s.motivo}</p>
            </div>
          )}

          {/* Cambiar estado */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Estado</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((e) => {
                const activo = s.estado === e.value;
                return (
                  <button
                    key={e.value}
                    onClick={() => onEstado(e.value)}
                    disabled={guardando || activo}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      activo ? e.cls + ' border-transparent' : 'bg-white text-slate-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nota interna / respuesta */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Nota de gestión
            </p>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              rows={2}
              placeholder="Ej. Se coordinó retiro por correo el 05/07. Reembolso procesado."
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 text-slate-800"
            />
            <button
              onClick={() => onResponder(respuesta)}
              disabled={guardando || respuesta === (s.respuestaOwner ?? '')}
              className="mt-2 px-4 py-2 text-white text-sm font-bold rounded-lg disabled:opacity-40 transition-all"
              style={{ background: accent }}
            >
              Guardar nota
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
