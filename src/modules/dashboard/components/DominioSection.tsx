import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEstadoDominioFn, guardarDominioFn, verificarDominioFn } from '../api/shop.api';
import MI from './MaterialIcon';

// Sección del panel para que el dueño configure un dominio propio (ej: www.mitienda.com)
// y lo verifique vía registro TXT en su DNS.
const DominioSection = ({ accent = '#6366f1' }: { accent?: string }) => {
  const qc = useQueryClient();
  const [input, setInput] = useState('');

  const { data: estado, isLoading } = useQuery({
    queryKey: ['estadoDominio'],
    queryFn: getEstadoDominioFn,
  });

  const guardar = useMutation({
    mutationFn: () => guardarDominioFn(input.trim().toLowerCase()),
    onSuccess: () => {
      toast.success('Dominio guardado. Ahora configurá el registro TXT.');
      qc.invalidateQueries({ queryKey: ['estadoDominio'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.mensaje ?? 'Error al guardar el dominio'),
  });

  const verificar = useMutation({
    mutationFn: verificarDominioFn,
    onSuccess: (r) => {
      toast.success(r.mensaje ?? 'Dominio verificado');
      qc.invalidateQueries({ queryKey: ['estadoDominio'] });
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.mensaje ?? 'Todavía no encontramos el registro TXT'),
  });

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast.success('Copiado al portapapeles');
  };

  if (isLoading) {
    return <div className="p-6 text-slate-400 text-sm">Cargando…</div>;
  }

  const dominioActual = estado?.dominio ?? null;
  const verificado = estado?.verificado ?? false;
  const dns = estado?.instruccionDns ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dominio propio</h1>
        <p className="text-sm text-slate-500 mt-1">
          Conectá tu propio dominio (ej: www.mitienda.com) para que tus clientes vean tu tienda en él.
        </p>
      </div>

      {/* Estado actual */}
      {dominioActual && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-3">
          <div
            className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
              verificado ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <MI name={verificado ? 'check_circle' : 'pending'} className="!text-xl" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">{dominioActual}</p>
            <p className={`text-xs font-semibold ${verificado ? 'text-green-600' : 'text-amber-600'}`}>
              {verificado ? 'Verificado y activo' : 'Pendiente de verificación'}
            </p>
          </div>
        </div>
      )}

      {/* Form para cargar/cambiar el dominio */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
        <label className="text-sm font-bold text-slate-700">
          {dominioActual ? 'Cambiar dominio' : 'Conectar un dominio'}
        </label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="www.mitienda.com"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
          />
          <button
            onClick={() => guardar.mutate()}
            disabled={!input.trim() || guardar.isPending}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {guardar.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Instrucción de verificación (TXT) */}
      {dns && !verificado && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm space-y-3">
          <p className="text-sm font-bold text-slate-800">Verificá que el dominio es tuyo</p>
          <p className="text-xs text-slate-500">
            Entrá al panel de tu proveedor de dominio y agregá este registro:
          </p>

          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm bg-white rounded-xl p-4 border border-slate-100">
            <span className="text-slate-400 font-semibold">Tipo</span>
            <span className="font-mono text-slate-800">{dns.tipo}</span>
            <span className="text-slate-400 font-semibold">Host</span>
            <span className="font-mono text-slate-800">{dns.host}</span>
            <span className="text-slate-400 font-semibold">Valor</span>
            <button
              onClick={() => copiar(dns.valor)}
              className="font-mono text-slate-800 text-left break-all hover:text-indigo-600 flex items-center gap-1"
              title="Copiar"
            >
              {dns.valor}
              <MI name="content_copy" className="!text-sm text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => verificar.mutate()}
            disabled={verificar.isPending}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {verificar.isPending ? 'Verificando…' : 'Ya lo configuré, verificar'}
          </button>
          <p className="text-[11px] text-slate-400 text-center">
            El DNS puede tardar unos minutos en propagarse.
          </p>
        </div>
      )}
    </div>
  );
};

export default DominioSection;
