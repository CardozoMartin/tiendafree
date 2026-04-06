import {
  AlertCircle,
  ChevronUp,
  Package,
  Pencil,
  Star,
} from 'lucide-react';
import type { IProduct } from '../../types/product.type';
import FormProduct from '../Forms/FormProduct';

interface ProductCardProps {
  producto: IProduct;
  isEditing: boolean;
  toggleEdit: (id: number) => void;
  actualizar: {
    mutate: (input: { id: number; payload: Record<string, any> }) => void;
    isPending: boolean;
  };
  onEditSuccess: () => void;
}

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

const ProductCard = ({ producto, isEditing, toggleEdit, actualizar, onEditSuccess }: ProductCardProps) => (
  <div className="flex flex-col">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100/50 overflow-hidden shrink-0 flex items-center justify-center">
          {producto.imagenPrincipalUrl ? (
            <img
              src={producto.imagenPrincipalUrl}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-5 h-5 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-gray-800 truncate">{producto.nombre}</p>
            {producto.destacado && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                <Star className="w-2.5 h-2.5 fill-amber-500 stroke-none" /> Destacado
              </span>
            )}
            {!producto.disponible && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                Oculto
              </span>
            )}
            {producto.stock <= 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="w-2.5 h-2.5" /> Sin Stock
              </span>
            )}
            {producto.stock > 0 && producto.stock <= 5 && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                Bajo Stock: {producto.stock}
              </span>
            )}
            {producto.stock > 5 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                Stock: {producto.stock}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400 font-medium">
              {formatPrice(producto.precio, producto.moneda)}
            </p>
            {producto.precioOferta && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(producto.precioOferta, producto.moneda)}
              </p>
            )}
            {producto.tags?.length > 0 && (
              <>
                <span className="text-gray-200">·</span>
                <p className="text-xs text-gray-400 truncate hidden sm:block">
                  {producto.tags
                    .slice(0, 2)
                    .map((t) => `#${t.nombre}`)
                    .join(' ')}
                  {producto.tags.length > 2 && ' ...'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:pr-2 border-t border-gray-50 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
        <div className="flex flex-col items-center gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${producto.destacado ? 'text-amber-600' : 'text-slate-500'}`}>
            Destacado
          </span>
          <button
            onClick={() =>
              actualizar.mutate({
                id: producto.id,
                payload: { destacado: !producto.destacado },
              })
            }
            disabled={actualizar.isPending}
            className={`relative w-11 h-6 rounded-full border transition-all duration-200 disabled:opacity-50 ${
              producto.destacado ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white border shadow-sm transition-all duration-200 flex items-center justify-center ${
                producto.destacado ? 'left-[calc(100%-1.375rem)] border-amber-300' : 'left-0.5 border-slate-300'
              }`}
            >
              <Star
                className={`w-2.5 h-2.5 transition-colors ${
                  producto.destacado ? 'stroke-amber-600 fill-none' : 'stroke-slate-400 fill-none'
                }`}
              />
            </span>
          </button>
        </div>

        <div className="w-px h-8 bg-gray-100" />

        <div className="flex flex-col items-center gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${producto.disponible ? 'text-emerald-600' : 'text-slate-500'}`}>
            Visible
          </span>
          <button
            onClick={() =>
              actualizar.mutate({
                id: producto.id,
                payload: { disponible: !producto.disponible },
              })
            }
            disabled={actualizar.isPending}
            className={`relative w-11 h-6 rounded-full border transition-all duration-200 disabled:opacity-50 ${
              producto.disponible ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white border shadow-sm transition-all duration-200 flex items-center justify-center ${
                producto.disponible ? 'left-[calc(100%-1.375rem)] border-emerald-300' : 'left-0.5 border-slate-300'
              }`}
            >
              <Package
                className={`w-2.5 h-2.5 transition-colors ${
                  producto.disponible ? 'stroke-emerald-600' : 'stroke-slate-400'
                }`}
              />
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isEditing ? 'Cerrar' : 'Editar'}
          </span>
          <button
            onClick={() => toggleEdit(producto.id)}
            className={`p-2 rounded-xl transition-all border ${
              isEditing
                ? 'text-gray-900 bg-gray-100 border-gray-200 shadow-inner'
                : 'text-gray-600 bg-white border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
            }`}
            title={isEditing ? 'Cerrar edición' : 'Editar producto'}
          >
            {isEditing ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>

    {isEditing && (
      <div className="px-6 pb-6 pt-2 border-t border-gray-50">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <FormProduct producto={producto} onSuccess={onEditSuccess} />
        </div>
      </div>
    )}
  </div>
);

export default ProductCard;
