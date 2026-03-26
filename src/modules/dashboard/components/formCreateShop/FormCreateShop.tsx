import { useForm } from 'react-hook-form';
import {
  Store as StoreIcon, Type, FileText, Phone, Instagram,
  Globe, Map, Building2, LayoutTemplate,
} from 'lucide-react';

import { useConfirm } from '../../../../hooks/useConfirm';
import { useCreateShop } from '../../hooks/useShop';

export interface IShopData {
  nombre: string;
  titulo: string;
  descripcion: string;
  plantillaId: number;
  whatsapp: string;
  instagram: string;
  facebook: string;
  pais: string;
  provincia: string;
  ciudad: string;
}

// ─── Estilos compartidos (idénticos a FormProduct) ───────────────────────────

const inputCls =
  'w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 transition-all';

const inputErrorCls = 'border-red-300 focus:border-red-400 focus:ring-red-100';

// ─── IconInput ───────────────────────────────────────────────────────────────

const IconInput = ({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ElementType;
  error?: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <Icon
      className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
        error ? 'text-red-400' : 'text-gray-300'
      }`}
    />
    {children}
  </div>
);

// ─── Componente ──────────────────────────────────────────────────────────────

const FormCreateShop = () => {
  const {
    register,
    handleSubmit: onSubmitRHF,
    formState: { errors },
  } = useForm<IShopData>();

  const { confirm, ConfirmModal } = useConfirm();
  const { mutateAsync: createShop, isPending } = useCreateShop();

  const handleSubmit = async (data: IShopData) => {
    const userConfirmed = await confirm({
      titulo: '¿Estas seguro?',
      descripcion: '¿Estás seguro de que deseas crear la tienda?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Si, crear tienda',
      variant: 'info',
    });
    if (userConfirmed) await createShop(data);
  };

  return (
    <form onSubmit={onSubmitRHF(handleSubmit)} noValidate className="space-y-8">
      {ConfirmModal}

      {/* ══════════════════════════
          SECCIÓN: IDENTIDAD
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Identidad
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            El nombre e información principal de tu tienda.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

          {/* Nombre */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Nombre <span className="text-red-400">*</span>
            </label>
            <IconInput icon={StoreIcon} error={!!errors.nombre}>
              <input
                type="text"
                placeholder="Mi Tienda"
                className={`${inputCls} ${errors.nombre ? inputErrorCls : ''}`}
                {...register('nombre', { required: 'El nombre es requerido' })}
              />
            </IconInput>
            {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre.message}</p>}
          </div>

          {/* Título */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Título del sitio <span className="text-red-400">*</span>
            </label>
            <IconInput icon={Type} error={!!errors.titulo}>
              <input
                type="text"
                placeholder="Bienvenidos a mi tienda"
                className={`${inputCls} ${errors.titulo ? inputErrorCls : ''}`}
                {...register('titulo', { required: 'El título es requerido' })}
              />
            </IconInput>
            {errors.titulo && <p className="text-red-400 text-xs">{errors.titulo.message}</p>}
          </div>

          {/* Descripción */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Descripción</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
              <textarea
                rows={3}
                placeholder="Contá de qué trata tu tienda…"
                className={`${inputCls} resize-none`}
                style={{ paddingLeft: '2.25rem' }}
                {...register('descripcion')}
              />
            </div>
          </div>

          {/* Plantilla */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Plantilla <span className="text-red-400">*</span>
            </label>
            <IconInput icon={LayoutTemplate} error={!!errors.plantillaId}>
              <input
                type="number"
                placeholder="1"
                className={`${inputCls} ${errors.plantillaId ? inputErrorCls : ''}`}
                {...register('plantillaId', {
                  required: 'La plantilla es requerida',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Debe ser un ID válido' },
                })}
              />
            </IconInput>
            {errors.plantillaId && (
              <p className="text-red-400 text-xs">{errors.plantillaId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: REDES SOCIALES
      ══════════════════════════ */}
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Redes sociales
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Para que tus clientes te encuentren.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">
            Opcional
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

          {/* WhatsApp */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">WhatsApp</label>
            <IconInput icon={Phone}>
              <input
                type="tel"
                placeholder="+54 9 11 1234 5678"
                className={inputCls}
                {...register('whatsapp')}
              />
            </IconInput>
          </div>

          {/* Instagram */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Instagram</label>
            <IconInput icon={Instagram}>
              <input
                type="text"
                placeholder="usuario"
                className={inputCls}
                {...register('instagram')}
              />
            </IconInput>
          </div>

          {/* Facebook */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Facebook</label>
            <IconInput icon={Globe}>
              <input
                type="text"
                placeholder="usuario o URL"
                className={inputCls}
                {...register('facebook')}
              />
            </IconInput>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: UBICACIÓN
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Ubicación
          </h2>
          <p className="text-xs text-gray-400 mt-1">Dónde está tu tienda.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

          {/* País */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              País <span className="text-red-400">*</span>
            </label>
            <IconInput icon={Globe} error={!!errors.pais}>
              <input
                type="text"
                placeholder="Argentina"
                className={`${inputCls} ${errors.pais ? inputErrorCls : ''}`}
                {...register('pais', { required: 'El país es requerido' })}
              />
            </IconInput>
            {errors.pais && <p className="text-red-400 text-xs">{errors.pais.message}</p>}
          </div>

          {/* Provincia */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Provincia <span className="text-red-400">*</span>
            </label>
            <IconInput icon={Map} error={!!errors.provincia}>
              <input
                type="text"
                placeholder="Tucumán"
                className={`${inputCls} ${errors.provincia ? inputErrorCls : ''}`}
                {...register('provincia', { required: 'La provincia es requerida' })}
              />
            </IconInput>
            {errors.provincia && <p className="text-red-400 text-xs">{errors.provincia.message}</p>}
          </div>

          {/* Ciudad */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Ciudad <span className="text-red-400">*</span>
            </label>
            <IconInput icon={Building2} error={!!errors.ciudad}>
              <input
                type="text"
                placeholder="San Miguel de Tucumán"
                className={`${inputCls} ${errors.ciudad ? inputErrorCls : ''}`}
                {...register('ciudad', { required: 'La ciudad es requerida' })}
              />
            </IconInput>
            {errors.ciudad && <p className="text-red-400 text-xs">{errors.ciudad.message}</p>}
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creando tienda…
          </>
        ) : (
          <>
            <StoreIcon className="w-4 h-4" />
            Crear Tienda
          </>
        )}
      </button>
    </form>
  );
};

export default FormCreateShop;
