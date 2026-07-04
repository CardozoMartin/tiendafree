import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownUp,
  BadgePercent,
  DollarSign,
  FileText,
  Hash,
  Image as ImageIcon,
  ImagePlus,
  LayoutGrid,
  Package,
  Plus,
  SquarePen,
  Tag,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { comprimirImagen } from '../../utils/comprimirImagen';
import { getCategoriasFn } from '../../api/product.api';
import {
  useActualizarProducto,
  useActualizarVariante,
  useAgregarImagen,
  useCrearProducto,
  useCrearVariante,
  useEliminarImagen,
  useEliminarVariante,
  useSubirImagenVariante,
} from '../../hooks/useProduct';
import { useGuiasTalles } from '../../hooks/useGuiasTalles';
import type { IProduct, IProductVariant } from '../../types/product.type';
import InputProduct from './InputProduct';
import SelectProduct from './SelectProduct';
import TextAreaProduct from './TextAreaProduct';
import { Toggle } from './Toggle';

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
  guiaTallesId: number | '';
}

interface VariantePendiente {
  nombre: string;
  color?: string;
  talle?: string;
  sku: string;
  precioExtra: number;
  stock: number;
  disponible: boolean;
}

// Tipos de grupo que se guardan estructurados (permiten selectores separados en la tienda)
const TIPOS_ESTRUCTURADOS = ['Color', 'Talle', 'Talla numérica'];

// Presets de talle para carga rápida
const PRESET_TALLES_LETRA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRESET_TALLES_CALZADO = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

// Colores comunes con su valor hex (para swatches). Clave normalizada en minúsculas.
const COLORES_COMUNES: { nombre: string; hex: string }[] = [
  { nombre: 'Negro', hex: '#111111' },
  { nombre: 'Blanco', hex: '#ffffff' },
  { nombre: 'Gris', hex: '#9ca3af' },
  { nombre: 'Azul', hex: '#2563eb' },
  { nombre: 'Celeste', hex: '#38bdf8' },
  { nombre: 'Rojo', hex: '#dc2626' },
  { nombre: 'Verde', hex: '#16a34a' },
  { nombre: 'Amarillo', hex: '#eab308' },
  { nombre: 'Rosa', hex: '#ec4899' },
  { nombre: 'Violeta', hex: '#7c3aed' },
  { nombre: 'Beige', hex: '#e7dcc7' },
  { nombre: 'Marrón', hex: '#78350f' },
];

interface FormProductProps {
  producto?: IProduct;
  onSuccess?: () => void;
}

// ─── Clases base de input ────────────────────────────────────────────────────

const inputCls =
  'w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 transition-all';

const miniInputCls =
  'w-20 px-2 py-1 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-all text-right';

// ─── Fila de variante existente con edición inline de stock / extra ─────────

interface VarianteExistenteRowProps {
  v: IProductVariant;
  onGuardar: (payload: { stock?: number; precioExtra?: number; disponible?: boolean }) => Promise<unknown>;
  onEliminar: () => void;
  onSubirFoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VarianteExistenteRow = ({ v, onGuardar, onEliminar, onSubirFoto }: VarianteExistenteRowProps) => {
  const [stock, setStock] = useState<string>(String(v.stock));
  const [extra, setExtra] = useState<string>(String(v.precioExtra));

  useEffect(() => {
    setStock(String(v.stock));
    setExtra(String(v.precioExtra));
  }, [v.stock, v.precioExtra]);

  const commit = async () => {
    const nuevoStock = Math.max(0, Number(stock) || 0);
    const nuevoExtra = Math.max(0, Number(extra) || 0);
    if (nuevoStock === v.stock && nuevoExtra === Number(v.precioExtra)) return;
    await onGuardar({ stock: nuevoStock, precioExtra: nuevoExtra });
  };

  return (
    <li className="px-5 py-3.5 flex flex-wrap items-center gap-3 justify-between hover:bg-gray-50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 flex items-center gap-2 flex-wrap">
          {v.nombre}
          {v.color && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
              {v.color}
            </span>
          )}
          {v.talle && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
              Talle {v.talle}
            </span>
          )}
        </p>
        {v.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {v.sku}</p>}
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          Stock
          <input
            type="number"
            min={0}
            className={miniInputCls}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          Extra $
          <input
            type="number"
            min={0}
            step="0.01"
            className={miniInputCls}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          />
        </label>
        <button
          type="button"
          onClick={() => onGuardar({ disponible: !v.disponible })}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            v.disponible
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-500 hover:bg-red-100'
          }`}
          title="Click para cambiar disponibilidad"
        >
          {v.disponible ? 'Disponible' : 'Oculta'}
        </button>
        {v.imagenUrl && (
          <img src={v.imagenUrl} alt={v.nombre} className="w-8 h-8 rounded object-cover shadow-sm" />
        )}
        <label
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title={
            v.color
              ? `Subir foto del color ${v.color} (se aplica a todos los talles de ese color)`
              : 'Subir imagen'
          }
        >
          <UploadCloud className="w-4 h-4" />
          <input type="file" className="hidden" accept="image/*" onChange={onSubirFoto} />
        </label>
        <button
          type="button"
          onClick={onEliminar}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar variante"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
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
      precioOferta: producto?.precioOferta || '',
      moneda: producto?.moneda ?? 'ARS',
      disponible: producto?.disponible ?? true,
      destacado: producto?.destacado ?? false,
      stock: producto?.stock ?? 0,
      tags: producto?.tags?.map((t) => t.nombre).join(', ') ?? '',
      categoriaId: producto?.categoriaId ?? '',
      guiaTallesId: producto?.guiaTallesId ?? '',
    },
  });

  const { data: guiasTalles = [] } = useGuiasTalles();
  const guiaTallesId = watch('guiaTallesId');

  const precio = watch('precio');
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
        precioOferta: producto.precioOferta || '',
        moneda: producto.moneda,
        disponible: producto.disponible,
        destacado: producto.destacado,
        stock: producto.stock,
        tags: producto.tags?.map((t) => t.nombre).join(', ') ?? '',
        categoriaId: producto.categoriaId ?? '',
        guiaTallesId: producto.guiaTallesId ?? '',
      });
      setImagePreview(producto.imagenPrincipalUrl ?? '');
      setImageFile(null);
    }
  }, [producto, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const comprimido = await comprimirImagen(file);
      setImageFile(comprimido);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(comprimido);
    }
  };

  const { mutateAsync: crearProducto, isPending: creando } = useCrearProducto();
  const { mutateAsync: actualizarProducto, isPending: actualizando } = useActualizarProducto();
  const isPending = creando || actualizando;

  // ── Hooks extra para imágenes y variantes (solo editar) ──
  const { mutateAsync: agregarImagen, isPending: subiendoImagen } = useAgregarImagen();
  const { mutateAsync: eliminarImagen } = useEliminarImagen();
  const { mutateAsync: crearVariante, isPending: creandoVariante } = useCrearVariante();
  const { mutateAsync: actualizarVariante } = useActualizarVariante();
  const { mutateAsync: eliminarVariante } = useEliminarVariante();
  const { mutateAsync: subirImagenVariante } = useSubirImagenVariante();

  const handleSubirImagenExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && producto) {
      const comprimido = await comprimirImagen(file);
      await agregarImagen({ productoId: producto.id, file: comprimido });
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

  // Colores y talles que el producto YA tiene (para reusarlos con un click en edición)
  const coloresExistentes = useMemo(
    () => [...new Set((producto?.variantes ?? []).map((v) => v.color).filter(Boolean))] as string[],
    [producto]
  );
  const tallesExistentes = useMemo(
    () => [...new Set((producto?.variantes ?? []).map((v) => v.talle).filter(Boolean))] as string[],
    [producto]
  );

  // Inserta un valor en el grupo del tipo indicado (crea el grupo si no existe, evita repetir)
  const agregarValorAGrupo = (tipo: 'Color' | 'Talle', valor: string) => {
    setVarianteGroups((prev) => {
      const idx = prev.findIndex((g) => g.tipo === tipo);
      const parseVals = (s: string) =>
        s.split(',').map((v) => v.trim()).filter(Boolean);

      if (idx === -1) {
        return [...prev, { tipo, valores: valor }];
      }
      const yaEsta = parseVals(prev[idx].valores).some(
        (v) => v.toLowerCase() === valor.toLowerCase()
      );
      if (yaEsta) return prev;
      const nuevos = [...prev];
      const actuales = prev[idx].valores.trim();
      nuevos[idx] = { ...nuevos[idx], valores: actuales ? `${actuales}, ${valor}` : valor };
      return nuevos;
    });
  };

  // Inserta un valor en el grupo del índice indicado (evita repetir). Para chips de presets.
  const agregarValorAIndice = (idx: number, valor: string) => {
    setVarianteGroups((prev) => {
      const yaEsta = prev[idx].valores
        .split(',')
        .map((v) => v.trim())
        .some((v) => v.toLowerCase() === valor.toLowerCase());
      if (yaEsta) return prev;
      const nuevos = [...prev];
      const actuales = prev[idx].valores.trim();
      nuevos[idx] = { ...nuevos[idx], valores: actuales ? `${actuales}, ${valor}` : valor };
      return nuevos;
    });
  };

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
    const validGroups = varianteGroups.filter((g) => g.valores.trim() !== '');
    if (validGroups.length === 0) return;

    // Generar combinaciones (Producto Cartesiano) manteniendo tipo + valor
    type Parte = { tipo: string; valor: string };
    let combinations: Parte[][] = [[]];
    for (const group of validGroups) {
      const vals = group.valores
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const next: Parte[][] = [];
      for (const combo of combinations) {
        for (const val of vals) {
          next.push([...combo, { tipo: group.tipo, valor: val }]);
        }
      }
      combinations = next;
    }

    // Convertir cada combinación en una variante estructurada
    const nuevas: VariantePendiente[] = combinations.map((partes) => {
      const color = partes.find((p) => p.tipo === 'Color')?.valor;
      const talle = partes.find((p) => p.tipo === 'Talle' || p.tipo === 'Talla numérica')?.valor;
      // Nombre legible: "Rojo / M" (los tipos no estructurados conservan prefijo: "Material: Cuero")
      const nombre = partes
        .map((p) =>
          p.tipo && !TIPOS_ESTRUCTURADOS.includes(p.tipo) ? `${p.tipo}: ${p.valor}` : p.valor
        )
        .join(' / ');
      return {
        nombre,
        color,
        talle,
        sku: varianteMeta.skuBase
          ? `${varianteMeta.skuBase}-${nombre.replace(/[:/ ]/g, '')}`
          : '',
        precioExtra: varianteMeta.precioExtra,
        stock: varianteMeta.stock,
        disponible: varianteMeta.disponible,
      };
    });

    if (isEditing && producto) {
      // Clave de identidad de una variante: color+talle si es estructurada, si no el nombre
      const claveVariante = (v: { color?: string; talle?: string; nombre: string }) =>
        v.color || v.talle
          ? `ct::${(v.color ?? '').toLowerCase()}::${(v.talle ?? '').toLowerCase()}`
          : `n::${v.nombre.toLowerCase()}`;

      const existentes = new Set((producto.variantes ?? []).map(claveVariante));
      const aCrear = nuevas.filter((v) => !existentes.has(claveVariante(v)));
      const omitidas = nuevas.length - aCrear.length;

      const fallidas: string[] = [];
      for (const v of aCrear) {
        try {
          await crearVariante({
            productoId: producto.id,
            payload: { ...v, sku: v.sku || undefined },
          });
        } catch (e: any) {
          const msg = e?.response?.data?.mensaje ?? e?.message ?? 'Error desconocido';
          fallidas.push(`"${v.nombre}": ${msg}`);
        }
      }
      if (omitidas > 0) {
        toast.info(
          `Se agregaron ${aCrear.length} variante(s). ${omitidas} ya existían y se omitieron.`
        );
      }
      if (fallidas.length > 0) {
        toast.error(`No se pudieron crear ${fallidas.length} variante(s): ${fallidas.join(' · ')}`);
      }
    } else {
      // Evitar duplicados en la lista pendiente
      const existentes = new Set(variantesPendientes.map((v) => v.nombre.toLowerCase()));
      const sinDuplicados = nuevas.filter((v) => !existentes.has(v.nombre.toLowerCase()));
      if (sinDuplicados.length < nuevas.length) {
        toast.warning('Se omitieron variantes que ya estaban en la lista');
      }
      setVariantesPendientes((prev) => [...prev, ...sinDuplicados]);
    }
    // Limpiar solo los valores
    setVarianteGroups(varianteGroups.map((g) => ({ ...g, valores: '' })));
    setVarMeta((prev) => ({ ...prev, skuBase: '', precioExtra: 0, stock: 0 }));
  };

  const handleSubirFotoVariante = async (
    e: React.ChangeEvent<HTMLInputElement>,
    varianteId: number
  ) => {
    const file = e.target.files?.[0];
    if (file && producto) {
      const comprimido = await comprimirImagen(file);
      await subirImagenVariante({ productoId: producto.id, varianteId, file: comprimido });
    }
    e.target.value = '';
  };

  const handleEliminarVariantePendiente = (idx: number) => {
    setVariantesPendientes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (data: FormProductValues) => {
    const tagsArray = Array.from(
      new Set(
        (data.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((tag) => tag.toLowerCase())
      )
    );

    const payload = {
      ...data,
      precio: Number(data.precio),
      precioOferta: data.precioOferta && Number(data.precioOferta) > 0 ? Number(data.precioOferta) : null,
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
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Información
          </h2>
          <p className="text-xs text-gray-400 mt-1">Datos principales del producto.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">
          {/* Nombre */}
          <InputProduct
            label="Nombre"
            name="nombre"
            placeholder="Ej: Torta de chocolate"
            icon={<Tag className="w-4 h-4" />}
            register={register}
            errors={errors}
            required
            validacion={{
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            }}
          />

          {/* Descripción */}
          <TextAreaProduct
            label="Descripción"
            name="descripcion"
            placeholder="Contá algo sobre el producto…"
            icon={<FileText className="w-4 h-4" />}
            register={register}
            errors={errors}
            rows={3}
          />

          {/* Tags */}
          <InputProduct
            label="Tags"
            name="tags"
            placeholder="ropa, verano, oferta"
            icon={<Hash className="w-4 h-4" />}
            register={register}
            errors={errors}
            validacion={{
              validate: (value: string) => {
                const tags = value
                  .split(',')
                  .map((tag: string) => tag.trim())
                  .filter(Boolean);
                if (tags.length > 10) return 'Máximo 10 tags';
                if (new Set(tags.map((tag: string) => tag.toLowerCase())).size !== tags.length)
                  return 'No uses tags duplicados';
                return true;
              },
            }}
          />

          {/* Categoría */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-2">Categoría</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Categoría y subcategoría para clasificar el producto.
              </p>
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
                      setValue(
                        'categoriaId',
                        val ? Number(val) : selectedParentId !== '' ? Number(selectedParentId) : ''
                      );
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
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Precio</h2>
          <p className="text-xs text-gray-400 mt-1">Precio de venta y precio de oferta opcional.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">
          {/* Precio */}
          <InputProduct
            label="Precio"
            name="precio"
            placeholder="0.00"
            icon={<DollarSign className="w-4 h-4" />}
            register={register}
            errors={errors}
            type="number"
            step="0.01"
            min="0.01"
            required
            validacion={{
              required: 'El precio es requerido',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Debe ser mayor a 0' },
            }}
          />

          {/* Precio oferta */}
          <InputProduct
            label="Precio de oferta"
            name="precioOferta"
            placeholder="Dejar vacío para quitar oferta"
            icon={<BadgePercent className="w-4 h-4" />}
            register={register}
            errors={errors}
            type="number"
            step="0.01"
            opcional
            validacion={{
              validate: (value: string | number | undefined) => {
                if (value === '' || value === undefined || value === null || value === 0 || Number(value) === 0) return true;
                if (Number(value) < 0) return 'El precio de oferta debe ser mayor a 0';
                if (Number(precio) && Number(value) >= Number(precio)) {
                  return 'El precio de oferta debe ser menor al precio original';
                }
                return true;
              },
            }}
          />

          {/* Moneda */}
          <SelectProduct
            label="Moneda"
            name="moneda"
            icon={<ArrowDownUp className="w-4 h-4" />}
            register={register}
            errors={errors}
            options={[
              { value: 'ARS', label: 'ARS – Peso' },
              { value: 'USD', label: 'USD – Dólar' },
              { value: 'EUR', label: 'EUR – Euro' },
            ]}
          />
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
            <Toggle name="disponible" watch={watch} setValue={setValue} />
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Destacado</p>
              <p className="text-xs text-gray-400 mt-0.5">Aparece primero en la grilla</p>
            </div>
            <Toggle name="destacado" watch={watch} setValue={setValue} />
          </div>
          {(isEditing ? (producto?.variantes?.length ?? 0) > 0 : variantesPendientes.length > 0) ? (
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" /> Stock total
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Se calcula automáticamente sumando el stock de las variantes.
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {isEditing
                  ? (producto?.variantes ?? []).reduce((acc, v) => acc + (v.stock ?? 0), 0)
                  : variantesPendientes.reduce((acc, v) => acc + v.stock, 0)}{' '}
                unidades
              </span>
            </div>
          ) : (
            <InputProduct
              label="Stock disponible"
              name="stock"
              placeholder="0"
              icon={<Package className="w-4 h-4" />}
              register={register}
              errors={errors}
              type="number"
              validacion={{
                valueAsNumber: true,
                min: { value: 0, message: 'El stock no puede ser negativo' },
              }}
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: GUÍA DE TALLES
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Guía de talles
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Mostrá una tabla de medidas en la página del producto.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          {guiasTalles.length === 0 ? (
            <p className="text-sm text-gray-400">
              Todavía no creaste ninguna tabla de talles. Podés crearlas en{' '}
              <span className="font-medium text-gray-600">Editar sitio → Guías de talles</span>.
            </p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Tabla a mostrar</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  El cliente la verá con un botón “Guía de talles”.
                </p>
              </div>
              <select
                value={guiaTallesId}
                onChange={(e) =>
                  setValue('guiaTallesId', e.target.value ? Number(e.target.value) : '')
                }
                className="min-w-[200px] pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8 bg-white text-gray-700 cursor-pointer transition-all appearance-none"
              >
                <option value="">Sin guía de talles</option>
                {guiasTalles.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: VARIANTES (visible siempre)
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Variantes
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isEditing
              ? 'Talles, colores u otras opciones del producto.'
              : 'Podés agregar variantes ahora o después de crear el producto.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {/* Variantes existentes (modo editar) — stock y extra editables inline */}
            {isEditing &&
              producto?.variantes?.map((v) => (
                <VarianteExistenteRow
                  key={v.id}
                  v={v}
                  onGuardar={(payload) =>
                    actualizarVariante({ productoId: producto!.id, varianteId: v.id, payload })
                  }
                  onEliminar={() =>
                    eliminarVariante({ productoId: producto!.id, varianteId: v.id })
                  }
                  onSubirFoto={(e) => handleSubirFotoVariante(e, v.id)}
                />
              ))}

            {/* Variantes pendientes (modo crear) */}
            {!isEditing &&
              variantesPendientes.map((v, idx) => (
                <li
                  key={idx}
                  className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2 flex-wrap">
                      {v.nombre}
                      {v.color && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                          {v.color}
                        </span>
                      )}
                      {v.talle && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
                          Talle {v.talle}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {v.sku && `SKU: ${v.sku} · `}
                      Extra: ${v.precioExtra} ·{' '}
                      {v.disponible ? (
                        <span className="text-green-600 font-medium">Disponible</span>
                      ) : (
                        <span className="text-red-500 font-medium">Oculta</span>
                      )}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
                    Stock
                    <input
                      type="number"
                      min={0}
                      className={miniInputCls}
                      value={v.stock}
                      onChange={(e) =>
                        setVariantesPendientes((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, stock: Math.max(0, Number(e.target.value) || 0) } : p
                          )
                        )
                      }
                    />
                  </label>
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
              <li className="px-5 py-5 text-center text-sm text-gray-400 italic">
                No hay variantes cargadas
              </li>
            )}
            {!isEditing && variantesPendientes.length === 0 && (
              <li className="px-5 py-5 text-center text-sm text-gray-400 italic">
                Sin variantes — se creará sin opciones
              </li>
            )}
          </ul>

          {/* Mini-form generador inteligente */}
          <div className="bg-gray-50 p-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  Generador de combinaciones
                </p>
                <p className="text-[10px] text-gray-400">
                  {isEditing
                    ? 'Ej: color "Negro" x talle "XXL" agrega solo esa combinación. Las que ya existen se omiten.'
                    : 'Ej: "Rojo, Azul" x "S, M" = "Rojo-S, Rojo-M, Azul-S, Azul-M"'}
                </p>
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
                <div
                  key={idx}
                  className="flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="w-1/3">
                    <select
                      className={`${inputCls} py-2`}
                      value={group.tipo}
                      onChange={(e) => updateGroup(idx, 'tipo', e.target.value)}
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
                      onChange={(e) => updateGroup(idx, 'valores', e.target.value)}
                    />

                    {/* Presets rápidos de talle */}
                    {group.tipo === 'Talle' && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-gray-400">Rápido:</span>
                        {PRESET_TALLES_LETRA.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => agregarValorAIndice(idx, t)}
                            className="px-2 py-0.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            PRESET_TALLES_LETRA.forEach((t) => agregarValorAIndice(idx, t))
                          }
                          className="px-2 py-0.5 text-[11px] font-bold text-gray-900 underline hover:no-underline"
                        >
                          Todos
                        </button>
                      </div>
                    )}
                    {group.tipo === 'Talla numérica' && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-gray-400">Calzado:</span>
                        {PRESET_TALLES_CALZADO.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => agregarValorAIndice(idx, t)}
                            className="px-2 py-0.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Swatches de color comunes */}
                    {group.tipo === 'Color' && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-gray-400">Colores:</span>
                        {COLORES_COMUNES.map((col) => (
                          <button
                            key={col.nombre}
                            type="button"
                            onClick={() => agregarValorAIndice(idx, col.nombre)}
                            className="flex items-center gap-1 pl-1 pr-2 py-0.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                            title={`Agregar ${col.nombre}`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                              style={{ background: col.hex }}
                            />
                            {col.nombre}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Reusar valores ya existentes del producto (solo en edición) */}
                    {isEditing &&
                      ((group.tipo === 'Color' && coloresExistentes.length > 0) ||
                        ((group.tipo === 'Talle' || group.tipo === 'Talla numérica') &&
                          tallesExistentes.length > 0)) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-gray-400">Ya usás:</span>
                          {(group.tipo === 'Color' ? coloresExistentes : tallesExistentes).map(
                            (val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() =>
                                  agregarValorAGrupo(
                                    group.tipo === 'Color' ? 'Color' : 'Talle',
                                    val
                                  )
                                }
                                className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                                title={`Agregar ${val}`}
                              >
                                + {val}
                              </button>
                            )
                          )}
                        </div>
                      )}
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
                onChange={(e) => setVarMeta({ ...varianteMeta, skuBase: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Stock</span>
                <input
                  type="number"
                  placeholder="0"
                  className={`${inputCls} py-2 w-full`}
                  value={varianteMeta.stock || ''}
                  onChange={(e) => setVarMeta({ ...varianteMeta, stock: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Extra $</span>
                <input
                  type="number"
                  placeholder="0"
                  className={`${inputCls} py-2 w-full`}
                  value={varianteMeta.precioExtra || ''}
                  onChange={(e) =>
                    setVarMeta({ ...varianteMeta, precioExtra: Number(e.target.value) })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={varianteMeta.disponible}
                  onChange={(e) => setVarMeta({ ...varianteMeta, disponible: e.target.checked })}
                  className="rounded text-gray-900 focus:ring-gray-900/10 cursor-pointer"
                />
                Disponible
              </label>
            </div>

            {!isEditing && (
              <p className="text-xs text-gray-500 mb-3 italic">
                La subida de imagen para cada variante se habilitará luego de guardar el producto
                por primera vez.
              </p>
            )}

            <button
              type="button"
              onClick={handleAgregarVariante}
              disabled={
                varianteGroups.every((g) => !g.valores.trim()) ||
                (isEditing ? creandoVariante : false)
              }
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
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Imágenes extra
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Podés subir fotos adicionales de este producto.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {producto.imagenes?.map((img) => (
                <div
                  key={img.id}
                  className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-200 group"
                >
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

              <label
                className={`w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer shrink-0 transition-all ${subiendoImagen ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Agregar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSubirImagenExtra}
                />
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
