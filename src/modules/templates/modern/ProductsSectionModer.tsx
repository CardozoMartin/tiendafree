import { useState } from 'react';
import type { Product } from './types';
import { CATEGORIES, PRODUCTS } from './types';

// ─── STAR RATING ─────────────────────────────────────────────────────────────
export const StarIcon = ({ filled, accent = '#c9a96e' }: { filled: boolean; accent?: string }) => (
  <svg width="13" height="12" viewBox="0 0 18 17" fill="none">
    <path
      d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
      fill={filled ? accent : 'none'}
      fillOpacity={filled ? 0.85 : 0}
      stroke={accent}
      strokeOpacity={filled ? 0 : 0.35}
      strokeWidth="0.8"
    />
  </svg>
);

export const StarRating = ({
  rating,
  max = 5,
  accent,
}: {
  rating: number;
  max?: number;
  accent?: string;
}) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <StarIcon key={i} filled={i < rating} accent={accent} />
    ))}
  </div>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
export const ProductCardModer = ({
  product,
  onSelect,
  onAddToCart,
  accent = '#c9a96e',
  borderRadius = '12px',
  showPrice = true,
  showBadge = true,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  accent?: string;
  borderRadius?: string;
  showPrice?: boolean;
  showBadge?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      className="group cursor-pointer flex flex-col"
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-[3/4] mb-3"
        style={{
          borderRadius: `var(--border-radius, ${borderRadius})`,
          background: '#1a1a22',
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500"
          style={{
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            filter: 'brightness(0.9) saturate(0.85)',
          }}
        />

        {/* Hover overlay + CTA */}
        <div
          className="absolute inset-0 flex items-end p-3 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(13,13,18,0.8) 0%, transparent 55%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          <button
            className="w-full py-2.5 text-xs font-medium tracking-widest uppercase transition-all"
            style={{
              background: accent,
              color: '#0d0d12',
              border: 'none',
              borderRadius: '8px',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            Añadir al carrito
          </button>
        </div>

        {/* Badge */}
        {showBadge && product.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-medium uppercase tracking-wider"
            style={{
              background: 'rgba(13,13,18,0.72)',
              border: `0.5px solid ${accent}`,
              color: accent,
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              backdropFilter: 'blur(6px)',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(13,13,18,0.55)',
            borderRadius: '50%',
            border: '0.5px solid rgba(245,240,232,0.15)',
            backdropFilter: 'blur(6px)',
            cursor: 'pointer',
            opacity: hovered || wishlisted ? 1 : 0,
            transform: hovered || wishlisted ? 'scale(1)' : 'scale(0.8)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted((w) => !w);
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={wishlisted ? accent : 'none'}
            stroke={accent}
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-0.5">
        <StarRating rating={product.rating} accent={accent} />
        <p
          className="text-sm font-light truncate mt-0.5"
          style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.78rem' }}
        >
          {product.name}
        </p>
        {showPrice && (
          <div className="flex items-baseline gap-2">
            {product.mrp && (
              <span className="text-xs line-through" style={{ color: 'rgba(245,240,232,0.2)' }}>
                ${product.mrp}
              </span>
            )}
            <span
              className="font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                color: accent,
              }}
            >
              ${product.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────────
const ProductsSectionModer = ({
  onSelectProduct,
  onAddToCart,
  accent = '#c9a96e',
  borderRadius,
  showPrice,
  showBadge,
}: {
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  accent?: string;
  borderRadius?: string;
  showPrice?: boolean;
  showBadge?: boolean;
}) => {
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered =
    activeCategory === 'Todo' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
  
  const visibleProducts = filtered.slice(0, visibleCount);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(12);
  };

  return (
    <section
      className="px-6 md:px-16 lg:px-24 xl:px-32 py-16"
      id="productos"
      style={{ background: '#0d0d12' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3" style={{ color: accent }}>
            <div style={{ width: '1.6rem', height: '1px', background: accent }} />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ letterSpacing: '0.24em' }}
            >
              Catálogo
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f5f0e8' }}
          >
            Todos los <em style={{ color: accent, fontStyle: 'italic' }}>Productos</em>
          </h2>
        </div>
        <span
          className="text-xs"
          style={{ color: 'rgba(245,240,232,0.25)', letterSpacing: '0.1em' }}
        >
          {filtered.length} productos
        </span>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="px-4 py-1.5 text-xs transition-all cursor-pointer"
              style={{
                borderRadius: '20px',
                border: `0.5px solid ${isActive ? accent : 'rgba(245,240,232,0.12)'}`,
                background: isActive ? `${accent}18` : 'transparent',
                color: isActive ? accent : 'rgba(245,240,232,0.4)',
                fontFamily: "'Jost', sans-serif",
                letterSpacing: '0.1em',
                fontWeight: isActive ? 500 : 300,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
        {visibleProducts.map((product) => (
          <ProductCardModer
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
            accent={accent}
            borderRadius={borderRadius}
            showPrice={showPrice}
            showBadge={showBadge}
          />
        ))}
      </div>

      {/* Button Load More */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((v) => v + 12)}
            className="px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 border"
            style={{
              borderColor: accent,
              color: accent,
              borderRadius: '30px',
              fontFamily: "'Jost', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = accent;
              e.currentTarget.style.color = '#0d0d12';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = accent || '#c9a96e';
            }}
          >
            Ver más productos
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductsSectionModer;
