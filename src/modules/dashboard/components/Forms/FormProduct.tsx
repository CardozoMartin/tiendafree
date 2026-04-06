import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  ImagePlus, Tag, DollarSign, FileText, Hash,
  SquarePen, ArrowDownUp, BadgePercent, LayoutGrid, Trash2, Plus, Image as ImageIcon, UploadCloud, Package, ToggleRight
} from 'lucide-react';
import {
  useCrearProducto,
  useActualizarProducto,
  useAgregarImagen,
  useEliminarImagen,
  useCrearVariante,
  useEliminarVariante,
  useSubirImagenVariante
} from '../../hooks/useProduct';
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
  stock: number;
  tags: string;
  categoriaId: number | '';
}

interface VariantePendiente {
  nombre: string;
  sku: string;
  precioExtra: number;
  stock: number;
  disponible: boolean;
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
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" {...register(name)} className="sr-only peer" />
      <div className="relative w-14 h-8 rounded-full bg-slate-200 border border-slate-300 transition-colors duration-200 peer-checked:border-slate-500">
        <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-300 shadow-sm transition-transform duration-200 transform peer-checked:translate-x-[1.25rem] peer-checked:border-slate-500">
          <ToggleRight className="w-3.5 h-3.5 text-slate-400 peer-checked:text-slate-700" />
        </span>
      </div>
    </label>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

const FormProduct = ({ producto, onSuccess }: FormProductProps) => {
  const isEditing = !!producto;
  const [imagePreview, setImagePreview] = useState(producto?.imagenPrincipalUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Variantes pendientes (solo en modo crear)
  const [variantesPendientes, setVariantesPendientes] = useState<VariantePendiente[]>([]);


  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategoriasFn,
  });

  const {
    register,
    handleSubmit: onSubmitRHF,
    reset,
    watch,
    setValue,
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
      stock: producto?.stock ?? 0,
      tags: producto?.tags?.map((t) => t.nombre).join(', ') ?? '',
      categoriaId: producto?.categoriaId ?? '',
    },
  });

  const formCategoriaId = watch('categoriaId');
  let selectedParentId: number | '' = '';
  if (typeof formCategoriaId === 'number') {
    const catNode = categorias.find((c: any) => c.id === formCategoriaId);
    if (catNode) {
      selectedParentId = catNode.padreId ? catNode.padreId : catNode.id;
    }
  }

  const categoriasPrincipales = categorias.filter((c: any) => !c.padreId);
  const subcategoriasSeleccionadas = selectedParentId
    ? categorias.filter((c: any) => c.padreId === selectedParentId)
    : [];

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
        stock: producto.stock,
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

  // ── Hooks extra para imágenes y variantes (solo editar) ──
  const { mutateAsync: agregarImagen, isPending: subiendoImagen } = useAgregarImagen();
  const { mutateAsync: eliminarImagen } = useEliminarImagen();
  const { mutateAsync: crearVariante, isPending: creandoVariante } = useCrearVariante();
  const { mutateAsync: eliminarVariante } = useEliminarVariante();
  const { mutateAsync: subirImagenVariante } = useSubirImagenVariante();

  const handleSubirImagenExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && producto) {
      await agregarImagen({ productoId: producto.id, file });
    }
    e.target.value = '';
  };

  // ── Smart Variante Generator ──
  const [varianteGroups, setVarianteGroups] = useState([{ tipo: 'Color', valores: '' }]);
  const [varianteMeta, setVarMeta] = useState({
    precioExtra: 0,
    stock: 0,
    skuBase: '',
    disponible: true,
  });

  const handleAddGroup = () => {
    setVarianteGroups([...varianteGroups, { tipo: '', valores: '' }]);
  };

  const handleRemoveGroup = (idx: number) => {
    if (varianteGroups.length > 1) {
      setVarianteGroups(varianteGroups.filter((_, i) => i !== idx));
    }
  };

  const updateGroup = (idx: number, key: 'tipo' | 'valores', val: string) => {
    const newGroups = [...varianteGroups];
    newGroups[idx][key] = val;
    setVarianteGroups(newGroups);
  };

  const handleAgregarVariante = async () => {
    const validGroups = varianteGroups.filter(g => g.valores.trim() !== '');
    if (validGroups.length === 0) return;

    // Generar combinaciones (Producto Cartesiano)
    const combinations: string[][] = [[]];
    for (const group of validGroups) {
      const vals = group.valores.split(',').map(s => s.trim()).filter(Boolean);
      const nextCombinations: string[][] = [];
      for (const combo of combinations) {
        for (const val of vals) {
          const prefix = group.tipo ? `${group.tipo}: ` : '';
          nextCombinations.push([...combo, `${prefix}${val}`]);
        }
      }
      combinations.splice(0, combinations.length, ...nextCombinations);
    }

    // Convertir combinaciones a strings finales (ej: "Color: Rojo - Talle: M")
    const finalNames = combinations.map(c => c.join(' - '));

    if (isEditing && producto) {
      for (const nombreFinal of finalNames) {
        try {
          await crearVariante({ 
            productoId: producto.id, 
            payload: {
               nombre: nombreFinal,
               sku: varianteMeta.skuBase ? `${varianteMeta.skuBase}-${nombreFinal.replace(/[: ]/g, '')}` : '',
               precioExtra: varianteMeta.precioExtra,
               stock: varianteMeta.stock,
               disponible: varianteMeta.disponible
            } 
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      const nuevasP: VariantePendiente[] = finalNames.map(nombreFinal => ({
         nombre: nombreFinal,
         sku: varianteMeta.skuBase ? `${varianteMeta.skuBase}-${nombreFinal.replace(/[: ]/g, '')}` : '',
         precioExtra: varianteMeta.precioExtra,
         stock: varianteMeta.stock,
         disponible: varianteMeta.disponible
      }));
      setVariantesPendientes((prev) => [...prev, ...nuevasP]);
    }
    // Limpiar solo los valores
    setVarianteGroups(varianteGroups.map(g => ({ ...g, valores: '' })));
    setVarMeta(prev => ({ ...prev, skuBase: '', precioExtra: 0, stock: 0 }));
  };

  const handleSubirFotoVariante = async (e: React.ChangeEvent<HTMLInputElement>, varianteId: number) => {
    const file = e.target.files?.[0];
    if (file && producto) {
      await subirImagenVariante({ productoId: producto.id, varianteId, file });
    }
    e.target.value = '';
  };

  const handleEliminarVariantePendiente = (idx: number) => {
    setVariantesPendientes((prev) => prev.filter((_, i) => i !== idx));
  };


  const handleSubmit = async (data: FormProductValues) => {
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...data,
      precio: Number(data.precio),
      precioOferta: data.precioOferta !== '' ? Number(data.precioOferta) : null,
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
      // Al crear: pasamos las variantes pendientes acumuladas
      await crearProducto({
        ...payload,
        variantes: variantesPendientes,
      } as any);
      setVariantesPendientes([]);
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                Categoría
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Categoría y subcategoría para clasificar el producto.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative min-w-[170px]">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                <select
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 bg-white text-gray-700 cursor-pointer transition-all appearance-none"
                  value={selectedParentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setValue('categoriaId', val ? Number(val) : '');
                  }}
                >
                  <option value="">Sin categoría</option>
                  {categoriasPrincipales.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {subcategoriasSeleccionadas.length > 0 && (
                <div className="relative min-w-[170px]">
                  <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none opacity-50" />
                  <select
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 bg-white text-gray-700 cursor-pointer transition-all appearance-none"
                    value={formCategoriaId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue('categoriaId', val ? Number(val) : (selectedParentId !== '' ? Number(selectedParentId) : ''));
                    }}
                  >
                    <option value="">(Seleccionar subcategoría...)</option>
                    {subcategoriasSeleccionadas.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
          <div className="px-5 py-4 space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">Stock disponible</label>
            <IconInput icon={Package} error={!!errors.stock}>
              <input
                type="number"
                placeholder="0"
                className={`${inputCls} ${errors.stock ? inputErrorCls : ''}`}
                {...register('stock', { valueAsNumber: true, min: 0 })}
              />
            </IconInput>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: VARIANTES (visible siempre)
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Variantes</h2>
          <p className="text-xs text-gray-400 mt-1">
            {isEditing ? 'Talles, colores u otras opciones del producto.' : 'Podés agregar variantes ahora o después de crear el producto.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {/* Variantes existentes (modo editar) */}
            {isEditing && producto?.variantes?.map(v => (
              <li key={v.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {v.sku && `SKU: ${v.sku} · `}
                    Extra: ${v.precioExtra} · {' '}
                    Stock: {v.stock} · {' '}
                    {v.disponible ? <span className="text-green-600 font-medium">Disponible</span> : <span className="text-red-500 font-medium">Oculta</span>}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {v.imagenUrl && (
                    <img src={v.imagenUrl} alt={v.nombre} className="w-8 h-8 rounded object-cover shadow-sm" />
                  )}
                  <label className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Subir imagen">
                    <UploadCloud className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSubirFotoVariante(e, v.id)} />
                  </label>
                  <button
                    type="button"
                    onClick={() => eliminarVariante({ productoId: producto!.id, varianteId: v.id })}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar variante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}

            {/* Variantes pendientes (modo crear) */}
            {!isEditing && variantesPendientes.map((v, idx) => (
              <li key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {v.sku && `SKU: ${v.sku} · `}
                    Extra: ${v.precioExtra} · {' '}
                    Stock: {v.stock} · {' '}
                    {v.disponible ? <span className="text-green-600 font-medium">Disponible</span> : <span className="text-red-500 font-medium">Oculta</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminarVariantePendiente(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Quitar variante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}

            {/* Estado vacío */}
            {isEditing && (!producto?.variantes || producto.variantes.length === 0) && (
              <li className="px-5 py-5 text-center text-sm text-gray-400 italic">No hay variantes cargadas</li>
            )}
            {!isEditing && variantesPendientes.length === 0 && (
              <li className="px-5 py-5 text-center text-sm text-gray-400 italic">Sin variantes — se creará sin opciones</li>
            )}
          </ul>

          {/* Mini-form generador inteligente */}
          <div className="bg-gray-50 p-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Generador de combinaciones</p>
                <p className="text-[10px] text-gray-400">Ej: "Rojo, Azul" x "S, M" = "Rojo-S, Rojo-M, Azul-S, Azul-M"</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddGroup}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[11px] font-bold text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" /> Agregar Grupo
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {varianteGroups.map((group, idx) => (
                <div key={idx} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="w-1/3">
                    <select
                      className={`${inputCls} py-2`}
                      value={group.tipo}
                      onChange={e => updateGroup(idx, 'tipo', e.target.value)}
                    >
                      <option value="">(Sin prefijo)</option>
                      <option value="Color">Color</option>
                      <option value="Talle">Talle</option>
                      <option value="Talla numérica">Talla Numérica</option>
                      <option value="Material">Material</option>
                      <option value="Modelo">Modelo</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Valores separados por coma (ej. Blanco, Negro)"
                      className={`${inputCls} py-2`}
                      value={group.valores}
                      onChange={e => updateGroup(idx, 'valores', e.target.value)}
                    />
                  </div>
                  {varianteGroups.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGroup(idx)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="SKU Base (opcional)"
                className={`${inputCls} py-2`}
                value={varianteMeta.skuBase}
                onChange={e => setVarMeta({...varianteMeta, skuBase: e.target.value})}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Stock</span>
                <input
                  type="number"
                  placeholder="0"
                  className={`${inputCls} py-2 w-full`}
                  value={varianteMeta.stock || ''}
                  onChange={e => setVarMeta({...varianteMeta, stock: Number(e.target.value)})}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Extra $</span>
                <input
                  type="number"
                  placeholder="0"
                  className={`${inputCls} py-2 w-full`}
                  value={varianteMeta.precioExtra || ''}
                  onChange={e => setVarMeta({...varianteMeta, precioExtra: Number(e.target.value)})}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={varianteMeta.disponible}
                  onChange={e => setVarMeta({...varianteMeta, disponible: e.target.checked})}
                  className="rounded text-gray-900 focus:ring-gray-900/10 cursor-pointer"
                />
                Disponible
              </label>
            </div>
            
            {!isEditing && (
              <p className="text-xs text-gray-500 mb-3 italic">
                La subida de imagen para cada variante se habilitará luego de guardar el producto por primera vez.
              </p>
            )}

            <button
              type="button"
              onClick={handleAgregarVariante}
              disabled={varianteGroups.every(g => !g.valores.trim()) || (isEditing ? creandoVariante : false)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-xs font-bold rounded-lg transition-all w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              {isEditing ? 'Generar variantes' : 'Agregar variantes a la lista'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          IMÁGENES EXTRA (solo en edición)
      ══════════════════════════ */}
      {isEditing && producto && (
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Imágenes extra</h2>
            <p className="text-xs text-gray-400 mt-1">Podés subir fotos adicionales de este producto.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {producto.imagenes?.map((img) => (
                <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-200 group">
                  <img src={img.url} alt="Extra" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => eliminarImagen({ productoId: producto.id, imagenId: img.id })}
                    className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}

              <label className={`w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer shrink-0 transition-all ${subiendoImagen ? 'opacity-50 pointer-events-none' : ''}`}>
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Agregar</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleSubirImagenExtra} />
              </label>
            </div>
          </div>
        </div>
      )}

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
