import { useState } from "react";
import type { Product } from "./types";

const ProductCard = ({
  product,
  onView,
  onAddCart,
  borderRadius = '16px',
  showPrice = true,
  showBadge = true,
}: {
  product: Product;
  onView: (p: Product) => void;
  onAddCart: (p: Product) => void;
  borderRadius?: string;
  showPrice?: boolean;
  showBadge?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="max-w-full cursor-pointer group" onClick={() => onView(product)}>
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{ borderRadius: 'var(--border-radius, ' + borderRadius + ')' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={hovered ? product.image2 : product.image1}
          alt={product.name}
          className="w-full h-72 object-cover transition-all duration-500"
        />
        {showBadge && product.offerPrice < product.price && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-rose-100">
            <span className="text-[10px] font-black uppercase text-rose-500">Oferta</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddCart(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:brightness-110 btn-primary"
        >
          + Agregar al carrito
        </button>
      </div>
      <div className="mt-2.5 px-1">
        <p className="text-xs text-primary font-medium" style={{ opacity: 0.8 }}>{product.category}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{product.name}</p>
      {showPrice && (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-base font-bold text-primary">${product.offerPrice}</p>
          <p className="text-xs text-slate-400 line-through">${product.price}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductCard;
