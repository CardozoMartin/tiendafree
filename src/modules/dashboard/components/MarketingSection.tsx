import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getConfigEmailFn, eliminarConfigEmailFn } from '../api/shop.api';
import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import EmailConfigSection from './EmailConfigSection';
import CampanasSection from './CampanasSection';
import MI from './MaterialIcon';

// Contenedor de Email Marketing. Une el servicio de email y las campañas en un
// solo lugar:
//  - Si NO hay proveedor configurado → se muestra la pantalla de configuración.
//  - Si YA hay proveedor → se muestran las campañas, con una barra arriba que
//    resume el proveedor y permite editar o eliminar la configuración.
const MarketingSection = ({ accent = '#6366f1' }: { accent?: string }) => {
  const qc = useQueryClient();
  const { confirm, ConfirmModal } = useConfirm();

  // Cuando el usuario toca "Editar" en la barra, mostramos la config a pantalla completa.
  const [editandoConfig, setEditandoConfig] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ['configEmail'],
    queryFn: getConfigEmailFn,
  });

  const eliminar = useMutation({
    mutationFn: eliminarConfigEmailFn,
    onSuccess: () => {
      toast.success('Configuración de email eliminada');
      qc.invalidateQueries({ queryKey: ['configEmail'] });
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.mensaje ?? 'No se pudo eliminar la configuración'),
  });

  if (isLoading) {
    return <div className="p-6 text-slate-400 text-sm">Cargando…</div>;
  }

  const tieneProveedor = !!config?.proveedor;
  const verificado = config?.verificado ?? false;

  // Sin proveedor, o el usuario pidió editar → pantalla de configuración completa.
  if (!tieneProveedor || editandoConfig) {
    return (
      <EmailConfigSection
        accent={accent}
        arrancarEditando={editandoConfig}
        // Solo mostramos "Volver a campañas" si ya había un proveedor (modo editar).
        onVolver={tieneProveedor ? () => setEditandoConfig(false) : undefined}
      />
    );
  }

  // Con proveedor → barra de resumen + campañas.
  const pedirEliminar = async () => {
    const ok = await confirm({
      titulo: 'Eliminar configuración de email',
      descripcion:
        'Vas a desconectar tu proveedor de email. No vas a poder enviar campañas hasta configurarlo de nuevo. ¿Continuar?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Sí, eliminar',
      variant: 'danger',
    });
    if (ok) eliminar.mutate();
  };

  return (
    <div className="space-y-5">
      {ConfirmModal}

      {/* Barra del proveedor configurado */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
        <div
          className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
            verificado ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <MI name={verificado ? 'mark_email_read' : 'pending'} className="!text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 capitalize truncate">
            {config?.proveedor}
            {config?.remitente ? <span className="font-normal text-slate-400"> · {config.remitente}</span> : null}
          </p>
          <p className={`text-xs font-semibold ${verificado ? 'text-green-600' : 'text-amber-600'}`}>
            {verificado ? 'Conexión verificada — listo para enviar' : 'Pendiente de verificación'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditandoConfig(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 transition"
          >
            <MI name="settings" className="!text-sm" />
            Configuración
          </button>
          <button
            onClick={pedirEliminar}
            disabled={eliminar.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
            title="Eliminar configuración"
          >
            <MI name="delete" className="!text-sm" />
          </button>
        </div>
      </div>

      {/* Aviso si aún no verificó */}
      {!verificado && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700 flex items-center justify-between gap-3">
          <span>Tu proveedor todavía no está verificado. Verificalo para poder enviar.</span>
          <button
            onClick={() => setEditandoConfig(true)}
            className="shrink-0 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200 transition"
          >
            Ir a verificar
          </button>
        </div>
      )}

      {/* Campañas */}
      <CampanasSection accent={accent} />
    </div>
  );
};

export default MarketingSection;
