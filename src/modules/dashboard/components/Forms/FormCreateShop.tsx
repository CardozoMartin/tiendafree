import {
  Building2,
  FileText,
  Globe,
  Instagram,
  Map,
  Phone,
  Store as StoreIcon,
  Type,
  Check,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type Path } from 'react-hook-form';

import { useQuery } from '@tanstack/react-query';
import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import { useCreateShop } from '../../hooks/useShop';
import { getRubrosFn } from '../../api/shop.api';
import InputProduct from './InputProduct';
import TextAreaProduct from './TextAreaProduct';

export interface IShopData {
  rubro: string;
  nombre: string;
  titulo: string;
  descripcion: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  slug: string;
  pais: string;
  provincia: string;
  ciudad: string;
}

// ─── Definición de pasos ─────────────────────────────────────────────────────
// Cada paso agrupa campos afines y trae una explicación para guiar al usuario.

const STEPS = [
  {
    id: 'rubro',
    title: '¿Qué vendés?',
    subtitle: 'Elegí el rubro de tu tienda. Vamos a preparar las categorías para vos.',
    fields: ['rubro'] as Path<IShopData>[],
  },
  {
    id: 'identidad',
    title: 'Identidad',
    subtitle: 'El nombre e información principal de tu tienda.',
    // Campos que se validan antes de avanzar (solo los requeridos del paso).
    fields: ['nombre', 'titulo', 'slug'] as Path<IShopData>[],
  },
  {
    id: 'redes',
    title: 'Redes sociales',
    subtitle: 'Para que tus clientes te encuentren y te escriban.',
    fields: [] as Path<IShopData>[],
  },
  {
    id: 'ubicacion',
    title: 'Ubicación',
    subtitle: 'Dónde está tu tienda.',
    fields: ['pais', 'provincia', 'ciudad'] as Path<IShopData>[],
  },
];

// ─── Componente ──────────────────────────────────────────────────────────────

interface FormCreateShopProps {
  accent?: string;
}

const FormCreateShop = ({ accent = '#6344ee' }: FormCreateShopProps) => {
  const {
    register,
    handleSubmit: onSubmitRHF,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<IShopData>({
    defaultValues: {
      nombre: '',
      slug: '',
    },
    mode: 'onTouched',
  });

  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

  // Rubros para el paso "¿Qué vendés?".
  const { data: rubros = [], isLoading: rubrosLoading } = useQuery({
    queryKey: ['rubros'],
    queryFn: getRubrosFn,
  });
  const rubroSel = watch('rubro');

  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const nombre = watch('nombre');

  useEffect(() => {
    const suggested = (nombre ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slugEditedManually) {
      setValue('slug', suggested);
    }
  }, [nombre, setValue, slugEditedManually]);

  const { confirm, ConfirmModal } = useConfirm();
  const { mutateAsync: createShop, isPending } = useCreateShop();

  // Avanza al siguiente paso solo si los campos del paso actual son válidos.
  const handleNext = async () => {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

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
    <form onSubmit={onSubmitRHF(handleSubmit)} noValidate className="space-y-6">
      {ConfirmModal}

      {/* ══════════════════════════
          BARRA DE PROGRESO (PASOS)
      ══════════════════════════ */}
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors shrink-0"
                  style={{
                    backgroundColor: done || current ? accent : '#e5e7eb',
                    color: done || current ? '#fff' : '#9ca3af',
                  }}
                >
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-[13px] font-semibold hidden sm:block ${
                    current ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-[2px] mx-2 sm:mx-3 rounded-full transition-colors"
                  style={{ backgroundColor: i < step ? accent : '#e5e7eb' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Encabezado del paso ── */}
      <div>
        <h2 className="text-lg font-black text-slate-900">{STEPS[step].title}</h2>
        <p className="text-sm text-slate-400 mt-0.5">{STEPS[step].subtitle}</p>
      </div>

      {/* ══════════════════════════
          PASO 1: RUBRO
      ══════════════════════════ */}
      {step === 0 && (
        <div className="space-y-4">
          <StepHint accent={accent}>
            Elegí qué vas a vender. Según el rubro te vamos a ofrecer solo las{' '}
            <strong>categorías que corresponden</strong> — así clasificar tus productos es más rápido
            y tu tienda se ve profesional desde el arranque.
          </StepHint>

          {/* Registramos el campo (required) sin input visible; se setea al tocar una tarjeta. */}
          <input type="hidden" {...register('rubro', { required: 'Elegí un rubro' })} />

          {rubrosLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="animate-spin h-6 w-6 border-4 border-slate-200 border-t-slate-800 rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {rubros.map((r) => {
                const activo = rubroSel === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setValue('rubro', r.id, { shouldValidate: true })}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer bg-white"
                    style={{
                      borderColor: activo ? accent : '#e5e7eb',
                      boxShadow: activo ? `0 0 0 2px ${accent}33` : 'none',
                    }}
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          {errors.rubro && <p className="text-sm text-red-500">{errors.rubro.message}</p>}
        </div>
      )}

      {/* ══════════════════════════
          PASO 2: IDENTIDAD
      ══════════════════════════ */}
      {step === 1 && (
        <div className="space-y-4">
          <StepHint accent={accent}>
            Estos son los datos que verán tus clientes. El <strong>nombre</strong> identifica tu
            tienda, el <strong>título</strong> es el saludo que aparece arriba de tu sitio, y la{' '}
            <strong>URL</strong> es la dirección web donde la gente accede. Elegilos con cuidado: la
            URL es la que vas a compartir.
          </StepHint>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* Nombre */}
            <InputProduct
              label="Nombre"
              name="nombre"
              placeholder="Mi Tienda"
              icon={<StoreIcon className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{ required: 'El nombre es requerido' }}
            />

            {/* Título */}
            <InputProduct
              label="Título del sitio"
              name="titulo"
              placeholder="Bienvenidos a mi tienda"
              icon={<Type className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{ required: 'El título es requerido' }}
            />

            {/* URL de la tienda */}
            <InputProduct
              label="URL de tu tienda"
              name="slug"
              placeholder="mi-tienda"
              icon={<Globe className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{
                required: 'La URL es requerida',
                pattern: {
                  value: /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/,
                  message:
                    'La URL solo puede contener letras minúsculas, números, guiones y guiones bajos',
                },
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 60, message: 'Máximo 60 caracteres' },
                onChange: () => setSlugEditedManually(true),
              }}
            />
            {!errors.slug && (
              <div className="px-5 pb-3 pt-0">
                <p className="text-[11px] text-gray-400">
                  URL pública:{' '}
                  <span className="font-semibold">
                    https://tiendizi.netlify.app/{watch('slug') || 'mi-tienda'}
                  </span>
                </p>
              </div>
            )}

            {/* Descripción */}
            <TextAreaProduct
              label="Descripción"
              name="descripcion"
              placeholder="Contá de qué trata tu tienda…"
              icon={<FileText className="w-4 h-4" />}
              register={register}
              errors={errors}
              rows={3}
              opcional
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════
          PASO 3: REDES SOCIALES
      ══════════════════════════ */}
      {step === 2 && (
        <div className="space-y-4">
          <StepHint accent={accent}>
            Estos campos son <strong>opcionales</strong>, pero muy recomendados: son el canal por el
            que tus clientes te van a escribir y comprar. El <strong>WhatsApp</strong> habilita el
            botón de contacto directo en tu tienda.
          </StepHint>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* WhatsApp */}
            <InputProduct
              label="WhatsApp"
              name="whatsapp"
              placeholder="+54 9 11 1234 5678"
              icon={<Phone className="w-4 h-4" />}
              register={register}
              errors={errors}
              type="tel"
              opcional
            />

            {/* Instagram */}
            <InputProduct
              label="Instagram"
              name="instagram"
              placeholder="usuario"
              icon={<Instagram className="w-4 h-4" />}
              register={register}
              errors={errors}
              opcional
            />

            {/* Facebook */}
            <InputProduct
              label="Facebook"
              name="facebook"
              placeholder="usuario o URL"
              icon={<Globe className="w-4 h-4" />}
              register={register}
              errors={errors}
              opcional
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════
          PASO 4: UBICACIÓN
      ══════════════════════════ */}
      {step === 3 && (
        <div className="space-y-4">
          <StepHint accent={accent}>
            Indicá dónde está ubicada tu tienda. Esto ayuda a calcular envíos y a que tus clientes
            sepan desde dónde despachás los pedidos.
          </StepHint>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* País */}
            <InputProduct
              label="País"
              name="pais"
              placeholder="Argentina"
              icon={<Globe className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{ required: 'El país es requerido' }}
            />

            {/* Provincia */}
            <InputProduct
              label="Provincia"
              name="provincia"
              placeholder="Tucumán"
              icon={<Map className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{ required: 'La provincia es requerida' }}
            />

            {/* Ciudad */}
            <InputProduct
              label="Ciudad"
              name="ciudad"
              placeholder="San Miguel de Tucumán"
              icon={<Building2 className="w-4 h-4" />}
              register={register}
              errors={errors}
              required
              validacion={{ required: 'La ciudad es requerida' }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════
          NAVEGACIÓN
      ══════════════════════════ */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white transition-all hover:bg-slate-50 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: accent }}
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ backgroundColor: isPending ? undefined : accent }}
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
        )}
      </div>
    </form>
  );
};

// ─── Panel de explicación por paso ───────────────────────────────────────────

interface StepHintProps {
  accent: string;
  children: React.ReactNode;
}

const StepHint = ({ accent, children }: StepHintProps) => (
  <div
    className="flex gap-3 rounded-2xl p-4"
    style={{ backgroundColor: `${accent}0f` }}
  >
    <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
    <p className="text-[13px] leading-relaxed text-slate-600">{children}</p>
  </div>
);

export default FormCreateShop;
