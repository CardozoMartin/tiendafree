import ProductCard from "./ProductCard";
import type { Product } from "./types";
import { PRODUCTS } from "./types";

const ProductGrid = ({
  onView,
  onAddCart,
  products,
  accent,
  borderRadius,
  showPrice,
  showBadge,
}: {
  onView: (p: Product) => void;
  onAddCart: (p: Product) => void;
  products?: Product[];
  accent?: string;
  borderRadius?: string;
  showPrice?: boolean;
  showBadge?: boolean;
}) => (
  <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent || '#fb7185' }}>
        Productos
      </span>
      <h2 className="text-3xl font-black mt-2" style={{ color: accent || '#881337' }}>Nuestra colección</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {(products && products.length > 0 ? products : PRODUCTS).map((p) => (
        <ProductCard 
          key={p.id} 
          product={p} 
          onView={onView} 
          onAddCart={onAddCart} 
          borderRadius={borderRadius}
          showPrice={showPrice}
          showBadge={showBadge}
        />
      ))}
    </div>
  </section>
);

export default ProductGrid;
