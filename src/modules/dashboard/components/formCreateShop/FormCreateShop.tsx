import { useForm } from 'react-hook-form';
import { useCreateShop } from '../../hooks/useShop';
import { useConfirm } from '../../../../hooks/useConfirm';
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

const FormCreateShop = ({ accent = '#6344ee' }: { accent?: string }) => {

  //RHF para menejo del formulario
  const {
    register,
    handleSubmit: onSubmitRHF,
    formState: { errors },
  } = useForm<IShopData>();
  //Hook para preguntar antes al usuario si realmente quiere crar la tienda
  const { confirm, ConfirmModal } = useConfirm();

  //Hook para enviar la peticion con TQuery
  const { mutateAsync: createShop, isPending } = useCreateShop();
  //Funcion que se ejecuta al enviar el formulario, recibe los datos validados
  const handleSubmit = async (data: IShopData) => {

    const userConfirmed = await confirm({
      titulo: '¿Estas seguro?',
      descripcion: '¿Estás seguro de que deseas crear la tienda?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Si, crear tienda',
      variant: 'info',
    });

    if (!userConfirmed) {
      await createShop(data);
    }
  };

  // Clases base para inputs y labels, y mensaje de error
  const inputBase =
    'w-full border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition';

  const inputErrorCls = 'border-red-300 focus:ring-red-400';

  const labelBase = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';
  const errorMsg = 'text-red-500 text-xs mt-1 font-medium';

  // Componente para el icono de cada sección, con fondo del color accent y sombra
  const SectionIcon = ({ icon }: { icon: string }) => (
    <span
      className="size-7 rounded-lg flex items-center justify-center text-white shrink-0"
      style={{ backgroundColor: accent, boxShadow: `0 4px 10px ${accent}40` }}
    >
      <span className="material-symbols-outlined !text-[16px]">{icon}</span>
    </span>
  );

  // Render del formulario, dividido en secciones con sus respectivos campos y validaciones. El botón de submit muestra un spinner cuando se está enviando.
  return (
    <form onSubmit={onSubmitRHF(handleSubmit)} noValidate className="space-y-4">
      {ConfirmModal}
      {/* ── Información básica ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <SectionIcon icon="info" />
          <span className="text-sm font-black text-slate-700">Información básica</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>
                Nombre <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Mi Tienda"
                className={`${inputBase} rhf-input-focus ${errors.nombre ? inputErrorCls : ''}`}
                {...register('nombre', { required: 'El nombre es requerido' })}
              />
              {errors.nombre && <p className={errorMsg}>{errors.nombre.message}</p>}
            </div>

            <div>
              <label className={labelBase}>
                Título <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Bienvenidos a mi tienda"
                className={`${inputBase} rhf-input-focus ${errors.titulo ? inputErrorCls : ''}`}
                {...register('titulo', { required: 'El título es requerido' })}
              />
              {errors.titulo && <p className={errorMsg}>{errors.titulo.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelBase}>Descripción</label>
            <textarea
              rows={3}
              placeholder="Contá de qué trata tu tienda..."
              className={`${inputBase} rhf-input-focus resize-none`}
              {...register('descripcion')}
            />
          </div>

          <div className="sm:w-1/2">
            <label className={labelBase}>
              Plantilla <span style={{ color: accent }}>*</span>
            </label>
            <input
              type="number"
              placeholder="1"
              className={`${inputBase} rhf-input-focus ${errors.plantillaId ? inputErrorCls : ''}`}
              {...register('plantillaId', {
                required: 'La plantilla es requerida',
                valueAsNumber: true,
                min: { value: 1, message: 'Debe ser un ID válido' },
              })}
            />
            {errors.plantillaId && <p className={errorMsg}>{errors.plantillaId.message}</p>}
          </div>
        </div>
      </div>

      {/* ── Redes sociales ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <SectionIcon icon="share" />
          <span className="text-sm font-black text-slate-700">Redes sociales</span>
          <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Opcional
          </span>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>WhatsApp</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined !text-[18px]">chat</span>
                </span>
                <input
                  type="tel"
                  placeholder="+54 9 11 1234 5678"
                  className={`${inputBase} rhf-input-focus pl-9`}
                  {...register('whatsapp')}
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-black">
                  @
                </span>
                <input
                  type="text"
                  placeholder="usuario"
                  className={`${inputBase} rhf-input-focus pl-8`}
                  {...register('instagram')}
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>Facebook</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined !text-[18px]">language</span>
                </span>
                <input
                  type="text"
                  placeholder="usuario o URL"
                  className={`${inputBase} rhf-input-focus pl-9`}
                  {...register('facebook')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ubicación ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <SectionIcon icon="location_on" />
          <span className="text-sm font-black text-slate-700">Ubicación</span>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>
                País <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Argentina"
                className={`${inputBase} rhf-input-focus ${errors.pais ? inputErrorCls : ''}`}
                {...register('pais', { required: 'El país es requerido' })}
              />
              {errors.pais && <p className={errorMsg}>{errors.pais.message}</p>}
            </div>

            <div>
              <label className={labelBase}>
                Provincia <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Tucumán"
                className={`${inputBase} rhf-input-focus ${errors.provincia ? inputErrorCls : ''}`}
                {...register('provincia', { required: 'La provincia es requerida' })}
              />
              {errors.provincia && <p className={errorMsg}>{errors.provincia.message}</p>}
            </div>

            <div>
              <label className={labelBase}>
                Ciudad <span style={{ color: accent }}>*</span>
              </label>
              <input
                type="text"
                placeholder="San Miguel de Tucumán"
                className={`${inputBase} rhf-input-focus ${errors.ciudad ? inputErrorCls : ''}`}
                {...register('ciudad', { required: 'La ciudad es requerida' })}
              />
              {errors.ciudad && <p className={errorMsg}>{errors.ciudad.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: accent,
          boxShadow: `0 4px 16px ${accent}40`,
        }}
      >
        <span className="material-symbols-outlined !text-[18px]">
          {isPending ? 'autorenew' : 'storefront'}
        </span>
        {isPending ? 'Creando tienda...' : 'Crear Tienda'}
      </button>
    </form>
  );
};

export default FormCreateShop;
