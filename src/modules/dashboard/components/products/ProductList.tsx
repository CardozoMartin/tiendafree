import type { IProduct } from '../../types/product.type';
import ProductCard from './ProductCard';

interface ProductListProps {
  productos: IProduct[];
  expandedId: 'create' | number | null;
  toggleEdit: (id: number) => void;
  actualizar: {
    mutate: (input: { id: number; payload: Record<string, any> }) => void;
    isPending: boolean;
  };
  onEditSuccess: () => void;
}

const ProductList = ({ productos, expandedId, toggleEdit, actualizar, onEditSuccess }: ProductListProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
    {productos.map((producto) => (
      <ProductCard
        key={producto.id}
        producto={producto}
        isEditing={expandedId === producto.id}
        toggleEdit={toggleEdit}
        actualizar={actualizar}
        onEditSuccess={onEditSuccess}
      />
    ))}
  </div>
);

export default ProductList;
