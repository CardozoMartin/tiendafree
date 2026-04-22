import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategoriasFn } from "../../api/product.api";
import {
  useActualizarProducto,
  useAgregarImagen,
  useCrearProducto,
  useCrearVariante,
  useEliminarImagen,
} from "../../hooks/useProduct";
import { Toggle } from "./Toggle";
import type {
  FormProductProps,
  FormProductValues,
  VariantePendiente,
} from "../../types/FormProducts.types";
import InputProduct from "./InputProduct";
import TextAreaProduct from "./TextAreaProduct";
import SelectProduct from "./SelectProduct";
import { variantInputCls } from "../../constant/FormProducts";

// ─── Clases base de input ────────────────────────────────────────────────────

// ─── Componente principal ────────────────────────────────────────────────────

const FormProduct = ({ producto, onSuccess }: FormProductProps) => {
  const isEditing = !!producto;
  const [imagePreview, setImagePreview] = useState(
    producto?.imagenPrincipalUrl || "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Variantes pendientes (solo en modo crear)
  const [variantesPendientes, setVariantesPendientes] = useState<
    VariantePendiente[]
  >([]);

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategoriasFn,
  });

  const {
    register,
    handleSubmit: onSubmitRHF,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormProductValues>({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio: producto?.precio ?? ("" as any),
      precioOferta: producto?.precioOferta ?? "",
      moneda: producto?.moneda ?? "ARS",
      disponible: producto?.disponible ?? true,
      destacado: producto?.destacado ?? false,
      stock: producto?.stock ?? 0,
      tags: producto?.tags?.map((t) => t.nombre).join(", ") ?? "",
      categoriaId: producto?.categoriaId ?? "",
    },
  });

  const formCategoriaId = watch("categoriaId");
  let selectedParentId: number | "" = "";
  if (typeof formCategoriaId === "number") {
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
        descripcion: producto.descripcion ?? "",
        precio: producto.precio,
        precioOferta: producto.precioOferta ?? "",
        moneda: producto.moneda,
        disponible: producto.disponible,
        destacado: producto.destacado,
        stock: producto.stock,
        tags: producto.tags?.map((t) => t.nombre).join(", ") ?? "",
        categoriaId: producto.categoriaId ?? "",
      });
      setImagePreview(producto.imagenPrincipalUrl ?? "");
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
  const { mutateAsync: actualizarProducto, isPending: actualizando } =
    useActualizarProducto();
  const isPending = creando || actualizando;

  // ── Hooks extra para imágenes y variantes (solo editar) ──
  const { mutateAsync: agregarImagen, isPending: subiendoImagen } =
    useAgregarImagen();
  const { mutateAsync: eliminarImagen } = useEliminarImagen();
  const { mutateAsync: crearVariante, isPending: creandoVariante } =
    useCrearVariante();

  const handleSubirImagenExtra = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file && producto) {
      await agregarImagen({ productoId: producto.id, file });
    }
    e.target.value = "";
  };

  // ── Smart Variante Generator ──
  const [varianteGroups, setVarianteGroups] = useState([
    { tipo: "Color", valores: "" },
  ]);
  const [varianteMeta, setVarMeta] = useState({
    precioExtra: 0,
    stock: 0,
    skuBase: "",
    disponible: true,
  });

  const handleAddGroup = () => {
    setVarianteGroups([...varianteGroups, { tipo: "", valores: "" }]);
  };

  const handleRemoveGroup = (idx: number) => {
    if (varianteGroups.length > 1) {
      setVarianteGroups(varianteGroups.filter((_, i) => i !== idx));
    }
  };

  const updateGroup = (idx: number, key: "tipo" | "valores", val: string) => {
    const newGroups = [...varianteGroups];
    newGroups[idx][key] = val;
    setVarianteGroups(newGroups);
  };

  const handleAgregarVariante = async () => {
    const validGroups = varianteGroups.filter((g) => g.valores.trim() !== "");
    if (validGroups.length === 0) return;

    // Generar combinaciones (Producto Cartesiano)
    const combinations: string[][] = [[]];
    for (const group of validGroups) {
      const vals = group.valores
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const nextCombinations: string[][] = [];
      for (const combo of combinations) {
        for (const val of vals) {
          const prefix = group.tipo ? `${group.tipo}: ` : "";
          nextCombinations.push([...combo, `${prefix}${val}`]);
        }
      }
      combinations.splice(0, combinations.length, ...nextCombinations);
    }

    // Convertir combinaciones a strings finales (ej: "Color: Rojo - Talle: M")
    const finalNames = combinations.map((c) => c.join(" - "));

    if (isEditing && producto) {
      for (const nombreFinal of finalNames) {
        try {
          await crearVariante({
            productoId: producto.id,
            payload: {
              nombre: nombreFinal,
              sku: varianteMeta.skuBase
                ? `${varianteMeta.skuBase}-${nombreFinal.replace(/[: ]/g, "")}`
                : "",
              precioExtra: varianteMeta.precioExtra,
              stock: varianteMeta.stock,
              disponible: varianteMeta.disponible,
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      const nuevasP: VariantePendiente[] = finalNames.map((nombreFinal) => ({
        nombre: nombreFinal,
        sku: varianteMeta.skuBase
          ? `${varianteMeta.skuBase}-${nombreFinal.replace(/[: ]/g, "")}`
          : "",
        precioExtra: varianteMeta.precioExtra,
        stock: varianteMeta.stock,
        disponible: varianteMeta.disponible,
      }));
      setVariantesPendientes((prev) => [...prev, ...nuevasP]);
    }
    // Limpiar solo los valores
    setVarianteGroups(varianteGroups.map((g) => ({ ...g, valores: "" })));
    setVarMeta((prev) => ({ ...prev, skuBase: "", precioExtra: 0, stock: 0 }));
  };

  const handleSubmit = async (data: FormProductValues) => {
    const tagsArray = Array.from(
      new Set(
        (data.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((tag) => tag.toLowerCase()),
      ),
    );

    const payload = {
      ...data,
      precio: Number(data.precio),
      precioOferta: data.precioOferta !== "" ? Number(data.precioOferta) : null,
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
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Foto
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Seleccioná una imagen para el producto.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Preview */}
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full object-contain max-h-72 bg-zinc-50"
                onError={() => setImagePreview("")}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/90 rounded-xl px-4 py-2">
                  <ImagePlus className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Cambiar imagen
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative h-44 bg-zinc-50 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl border-[1.5px] border-dashed border-black/15 flex items-center justify-center group-hover:border-[#6344ee]/40 transition-colors">
                  <ImagePlus className="w-5 h-5 text-slate-300 group-hover:text-[#6344ee]/50 transition-colors" />
                </div>
                <p className="text-[13px] text-slate-400 group-hover:text-slate-500 transition-colors">
                  Hacé click para seleccionar
                </p>
              </div>
            </div>
          )}

          {/* Botón */}
          <div className="px-5 py-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() =>
                document.getElementById("product-image-file")?.click()
              }
              className="flex items-center justify-center gap-2 w-full h-10 rounded-[14px] border-[1.5px] border-black/20
        bg-zinc-50 text-[13px] font-medium text-slate-600
        hover:border-[#6344ee]/40 hover:text-[#6344ee] hover:bg-white
        transition-all duration-200"
            >
              <ImagePlus className="w-4 h-4" />
              {imageFile || imagePreview
                ? "Cambiar imagen"
                : "Seleccionar archivo"}
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

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Información
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Datos principales del producto.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">
          {/* Nombre */}
          <InputProduct
            label="Nombre"
            placeholder="Ej: Torta de chocolate"
            name="nombre"
            icon={<Tag size={16} />}
            register={register}
            errors={errors}
            required
            validacion={{
              required: "El nombre es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            }}
          />

          {/* Descripción */}
          <TextAreaProduct
            label="Descripción"
            placeholder="Contá algo sobre el producto…"
            name="descripcion"
            icon={<FileText size={16} />}
            register={register}
            errors={errors}
            rows={3}
          />

          {/* Tags */}
          <InputProduct
            label="Tags"
            placeholder="ropa, verano, oferta"
            name="tags"
            icon={<Hash size={16} />}
            register={register}
            errors={errors}
            validacion={{
              validate: (value: any) => {
                const tags = value
                  .split(",")
                  .map((tag: any) => tag.trim())
                  .filter(Boolean);
                if (tags.length > 10) return "Máximo 10 tags";
                if (
                  new Set(tags.map((tag: any) => tag.toLowerCase())).size !==
                  tags.length
                )
                  return "No uses tags duplicados";
                return true;
              },
            }}
          />

          {/* Categoría */}
          <SelectProduct
            label="Categoría"
            name="categoriaId"
            icon={<LayoutGrid size={16} />}
            register={register}
            errors={errors}
            placeholder="Sin categoría"
            options={categoriasPrincipales.map((c: any) => ({
              value: c.id,
              label: c.nombre,
            }))}
          />

          {/* Subcategoría — solo si hay */}
          {subcategoriasSeleccionadas.length > 0 && (
            <SelectProduct
              label="Subcategoría"
              name="categoriaId"
              icon={<LayoutGrid size={16} />}
              register={register}
              errors={errors}
              placeholder="Seleccionar subcategoría..."
              options={subcategoriasSeleccionadas.map((c: any) => ({
                value: c.id,
                label: c.nombre,
              }))}
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: PRECIO
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Precio
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Precio de venta y precio de oferta opcional.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">
          {/* Precio */}
          <InputProduct
            label="Precio"
            placeholder="0.00"
            name="precio"
            icon={<DollarSign size={16} />}
            type="number"
            step="0.01"
            min="0.01"
            register={register}
            errors={errors}
            required
            validacion={{
              required: "El precio es requerido",
              valueAsNumber: true,
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            }}
          />

          {/* Precio oferta */}
          <InputProduct
            label="Precio de oferta"
            placeholder="0.00"
            name="precioOferta"
            icon={<BadgePercent size={16} />}
            type="number"
            step="0.01"
            min="0.01"
            register={register}
            errors={errors}
            opcional
            validacion={{
              required: "El precio es requerido",
              valueAsNumber: true,
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            }}
          />

          {/* Moneda */}
          <SelectProduct
            label="Moneda"
            name="moneda"
            icon={<ArrowDownUp size={16} />}
            register={register}
            errors={errors}
            options={[
              { value: "ARS", label: "ARS – Peso" },
              { value: "USD", label: "USD – Dólar" },
              { value: "EUR", label: "EUR – Euro" },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: ESTADO
      ══════════════════════════ */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Estado
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Visibilidad y prioridad en el catálogo.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Disponible</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Visible en tu tienda
              </p>
            </div>
            <Toggle name="disponible" register={register} />
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Destacado</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Aparece primero en la grilla
              </p>
            </div>
            <Toggle name="destacado" register={register} />
          </div>
          <InputProduct
            label="Stock disponible"
            placeholder="0"
            name="stock"
            icon={<Package size={16} />}
            type="number"
            register={register}
            errors={errors}
            validacion={{
              valueAsNumber: true,
              min: { value: 0, message: "No puede ser negativo" },
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════
          SECCIÓN: VARIANTES (visible siempre)
      ══════════════════════════ */}
      <div className="bg-gray-50 p-5 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              Generador de combinaciones
            </p>
            <p className="text-[10px] text-gray-400">
              Ej: "Rojo, Azul" x "S, M" = "Rojo-S, Rojo-M, Azul-S, Azul-M"
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 text-[11px] font-semibold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Plus className="w-3 h-3" /> Agregar grupo
          </button>
        </div>

        {/* Grupos de variantes */}
        <div className="space-y-2.5 mb-5">
          {varianteGroups.map((group, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="w-1/3 relative">
                <select
                  className={variantInputCls}
                  value={group.tipo}
                  onChange={(e) => updateGroup(idx, "tipo", e.target.value)}
                >
                  <option value="">(Sin prefijo)</option>
                  <option value="Color">Color</option>
                  <option value="Talle">Talle</option>
                  <option value="Talla numérica">Talla numérica</option>
                  <option value="Material">Material</option>
                  <option value="Modelo">Modelo</option>
                </select>
                {/* Chevron */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Valores separados por coma (ej. Blanco, Negro)"
                  className={variantInputCls}
                  value={group.valores}
                  onChange={(e) => updateGroup(idx, "valores", e.target.value)}
                />
              </div>
              {varianteGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(idx)}
                  className="p-2 text-slate-300 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Meta: SKU, Stock, Extra, Disponible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          <input
            type="text"
            placeholder="SKU base (opcional)"
            className={variantInputCls}
            value={varianteMeta.skuBase}
            onChange={(e) =>
              setVarMeta({ ...varianteMeta, skuBase: e.target.value })
            }
          />
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-[11px] font-semibold text-slate-400 pointer-events-none">
              Stock
            </span>
            <input
              type="number"
              placeholder="0"
              className={`${variantInputCls} pl-14`}
              value={varianteMeta.stock || ""}
              onChange={(e) =>
                setVarMeta({ ...varianteMeta, stock: Number(e.target.value) })
              }
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-[11px] font-semibold text-slate-400 pointer-events-none">
              Extra $
            </span>
            <input
              type="number"
              placeholder="0"
              className={`${variantInputCls} pl-16`}
              value={varianteMeta.precioExtra || ""}
              onChange={(e) =>
                setVarMeta({
                  ...varianteMeta,
                  precioExtra: Number(e.target.value),
                })
              }
            />
          </div>
          <label className="flex items-center gap-2.5 h-10 px-3.5 rounded-[12px] border-[1.5px] border-black/10 bg-zinc-50 cursor-pointer hover:border-black/30 transition-all">
            <input
              type="checkbox"
              checked={varianteMeta.disponible}
              onChange={(e) =>
                setVarMeta({ ...varianteMeta, disponible: e.target.checked })
              }
              className="rounded text-[#6344ee] focus:ring-[#6344ee]/20 cursor-pointer"
            />
            <span className="text-[13px] text-slate-700">Disponible</span>
          </label>
        </div>

        {!isEditing && (
          <p className="text-[11px] text-slate-400 mb-3 italic">
            La subida de imagen para cada variante se habilitará luego de
            guardar el producto por primera vez.
          </p>
        )}

        <button
          type="button"
          onClick={handleAgregarVariante}
          disabled={
            varianteGroups.every((g) => !g.valores.trim()) ||
            (isEditing ? creandoVariante : false)
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800
      disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
      text-white text-xs font-bold rounded-xl transition-all w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          {isEditing ? "Generar variantes" : "Agregar variantes a la lista"}
        </button>
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
                  <img
                    src={img.url}
                    alt="Extra"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      eliminarImagen({
                        productoId: producto.id,
                        imagenId: img.id,
                      })
                    }
                    className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}

              <label
                className={`w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer shrink-0 transition-all ${subiendoImagen ? "opacity-50 pointer-events-none" : ""}`}
              >
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">
                  Agregar
                </span>
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
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </>
        )}
      </button>
    </form>
  );
};

export default FormProduct;
