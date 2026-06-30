import {
  Building2,
  FileText,
  Globe,
  Instagram,
  Map,
  Phone,
  Store as StoreIcon,
  Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import { useCreateShop } from '../../hooks/useShop';
import InputProduct from './InputProduct';
import TextAreaProduct from './TextAreaProduct';

export interface IShopData {
  nombre: string;
  titulo: string;
  descripcion: string;
  plantillaId: number;
  whatsapp: string;
  instagram: string;
  facebook: string;
  slug: string;
  pais: string;
  provincia: string;
  ciudad: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

interface FormCreateShopProps {
  accent?: string;
}

const FormCreateShop = ({ accent }: FormCreateShopProps) => {
  const {
    register,
    handleSubmit: onSubmitRHF,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IShopData>({
    defaultValues: {
      nombre: '',
      slug: '',
      plantillaId: 1,
    },
  });

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

  const handleSubmit = async (data: IShopData) => {
    const userConfirmed = await confirm({
      titulo: '¿Estas seguro?',
      descripcion: '¿Estás seguro de que deseas crear la tienda?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Si, crear tienda',
      variant: 'info',
    });
    if (userConfirmed) await createShop({ ...data, plantillaId: 1 });
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

      {/* ══════════════════════════
          SECCIÓN: REDES SOCIALES
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Redes sociales
          </h2>
          <p className="text-xs text-gray-400 mt-1">Para que tus clientes te encuentren.</p>
        </div>

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

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
        style={{ backgroundColor: accent ?? '#111827' }}
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
