import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  ImagePlus, Tag, DollarSign, FileText, Hash,
  SquarePen, ArrowDownUp, BadgePercent, LayoutGrid
} from 'lucide-react';
import { useCrearProducto, useActualizarProducto } from '../../hooks/useProduct';
import { getCategoriasFn } from '../../api/product.api';
import type { IProduct } from '../../types/product.type';

interface FormProductValues {
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | '';
  moneda: string;
  disponible: boolean;
  destacado: boolean;
  tags: string;
  categoriaId: number | '';
}

interface FormProductProps {
  producto?: IProduct;
  onSuccess?: () => void;
}

// ─── Clases base de input ────────────────────────────────────────────────────

const inputCls =
  'w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 transition-all';

const inputErrorCls = 'border-red-300 focus:border-red-400 focus:ring-red-100';

// ─── Componente IconInput ────────────────────────────────────────────────────

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
      className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
        error ? 'text-red-400' : 'text-gray-300'
      }`}
    />
    {children}
  </div>
);

// ─── Toggle CSS (idéntico a EditingSite) ────────────────────────────────────

const Toggle = ({
  name,
  register,
}: {
  name: 'disponible' | 'destacado';
  register: any;
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" {...register(name)} className="sr-only peer" />
    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
  </label>
);

// ─── Componente principal ────────────────────────────────────────────────────

const FormProduct = ({ producto, onSuccess }: FormProductProps) => {
  const isEditing = !!producto;
  const [imagePreview, setImagePreview] = useState(producto?.imagenPrincipalUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategoriasFn,
  });

  const {
    register,
    handleSubmit: onSubmitRHF,
    reset,
    formState: { errors },
  } = useForm<FormProductValues>({
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio: producto?.precio ?? ('' as any),
      precioOferta: producto?.precioOferta ?? '',
      moneda: producto?.moneda ?? 'ARS',
      disponible: producto?.disponible ?? true,
      destacado: producto?.destacado ?? false,
      tags: producto?.tags?.map((t) => t.nombre).join(', ') ?? '',
      categoriaId: producto?.categoriaId ?? '',
    },
  });

  useEffect(() => {
    if (producto) {
      reset({
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        precio: producto.precio,
        precioOferta: producto.precioOferta ?? '',
        moneda: producto.moneda,
        disponible: producto.disponible,
        destacado: producto.destacado,
        tags: producto.tags?.map((t) => t.nombre).join(', ') ?? '',
        categoriaId: producto.categoriaId ?? '',
      });
      setImagePreview(producto.imagenPrincipalUrl ?? '');
      setImageFile(null);
    }
  }, [producto, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutateAsync: crearProducto, isPending: creando } = useCrearProducto();
  const { mutateAsync: actualizarProducto, isPending: actualizando } = useActualizarProducto();
  const isPending = creando || actualizando;

  const handleSubmit = async (data: FormProductValues) => {
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...data,
      precio: Number(data.precio),
      precioOferta: data.precioOferta !== '' ? Number(data.precioOferta) : undefined,
      tags: tagsArray,
      imagenPrincipal: imageFile || undefined,
      imagenPrincipalUrl: !imageFile ? producto?.imagenPrincipalUrl : undefined,
    };

    if (isEditing && producto) {
      await actualizarProducto({
        id: producto.id,
        payload: {
          ...payload,
          variantes: undefined,
        } as any,
      });
    } else {
      await crearProducto({
        ...payload,
        variantes: [],
      } as any);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={onSubmitRHF(handleSubmit)} noValidate className="space-y-8">

      {/* ══════════════════════════
          SECCIÓN: FOTO
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Foto</h2>
          <p className="text-xs text-gray-400 mt-1">Seleccioná una imagen para el producto.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Preview */}
          {imagePreview ? (
            <div className="h-40 bg-gray-50 overflow-hidden relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImagePreview('')}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs font-medium">Click para cambiar</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative h-40 bg-gray-50 border-b border-gray-100 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImagePlus className="mx-auto text-gray-200 w-8 h-8 group-hover:text-gray-300 transition-colors" />
                  <p className="text-xs text-gray-400 mt-1.5">Seleccionar imagen</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-5 py-4">
            <button
              type="button"
              onClick={() => document.getElementById('product-image-file')?.click()}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              <ImagePlus className="w-4 h-4 text-gray-400" />
              {imageFile || imagePreview ? 'Cambiar imagen' : 'Seleccionar archivo'}
            </button>
            <input
              id="product-image-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: INFORMACIÓN
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Información</h2>
          <p className="text-xs text-gray-400 mt-1">Datos principales del producto.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">

          {/* Nombre */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Nombre <span className="text-red-400">*</span>
            </label>
            <IconInput icon={Tag} error={!!errors.nombre}>
              <input
                type="text"
                placeholder="Ej: Torta de chocolate"
                className={`${inputCls} ${errors.nombre ? inputErrorCls : ''}`}
                {...register('nombre', {
                  required: 'El nombre es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
              />
            </IconInput>
            {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Descripción</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
              <textarea
                rows={3}
                placeholder="Contá algo sobre el producto…"
                className={`${inputCls} resize-none`}
                style={{ paddingLeft: '2.25rem' }}
                {...register('descripcion')}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Tags</label>
            <IconInput icon={Hash}>
              <input
                type="text"
                placeholder="ropa, verano, oferta"
                className={inputCls}
                {...register('tags')}
              />
            </IconInput>
            <p className="text-[11px] text-gray-400">Separalos con comas · Máximo 10</p>
          </div>

          {/* Categoría */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                Categoría
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Organizá tus productos</p>
            </div>
            <div className="relative min-w-[160px]">
              <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
              <select
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 bg-white text-gray-700 cursor-pointer transition-all appearance-none"
                {...register('categoriaId', { valueAsNumber: true })}
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: PRECIO
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Precio</h2>
          <p className="text-xs text-gray-400 mt-1">Precio de venta y precio de oferta opcional.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">

          {/* Precio */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Precio <span className="text-red-400">*</span>
            </label>
            <IconInput icon={DollarSign} error={!!errors.precio}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`${inputCls} ${errors.precio ? inputErrorCls : ''}`}
                {...register('precio', {
                  required: 'El precio es requerido',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Debe ser mayor a 0' },
                })}
              />
            </IconInput>
            {errors.precio && <p className="text-red-400 text-xs">{errors.precio.message}</p>}
          </div>

          {/* Precio oferta */}
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Precio de oferta
              <span className="ml-1.5 text-[11px] font-normal text-gray-400">Opcional</span>
            </label>
            <IconInput icon={BadgePercent}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={inputCls}
                {...register('precioOferta')}
              />
            </IconInput>
          </div>

          {/* Moneda */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Moneda</p>
              <p className="text-xs text-gray-400 mt-0.5">Código ISO</p>
            </div>
            <div className="relative">
              <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
              <select
                className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 bg-white text-gray-700 cursor-pointer transition-all appearance-none"
                {...register('moneda')}
              >
                <option value="ARS">ARS – Peso</option>
                <option value="USD">USD – Dólar</option>
                <option value="EUR">EUR – Euro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: ESTADO
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Estado</h2>
          <p className="text-xs text-gray-400 mt-1">Visibilidad y prioridad en el catálogo.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Disponible</p>
              <p className="text-xs text-gray-400 mt-0.5">Visible en tu tienda</p>
            </div>
            <Toggle name="disponible" register={register} />
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Destacado</p>
              <p className="text-xs text-gray-400 mt-0.5">Aparece primero en la grilla</p>
            </div>
            <Toggle name="destacado" register={register} />
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            <SquarePen className="w-4 h-4" />
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </>
        )}
      </button>
    </form>
  );
};

export default FormProduct;
