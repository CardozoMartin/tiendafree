import { useState } from 'react';
import type { Product } from './types';
import { StarRating } from './ProductsSectionModer';
import { MetodoChip } from '../shared/MetodoIcons';

const ProductDetailModer = ({
  product,
  onClose,
  onAddToCart,
  accent = '#c9a96e',
  buttonBg,
  buttonText,
  tienda,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
  tienda?: any;
}) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const textMain = '#f5f0e8';
  const textMuted = 'rgba(245,240,232,0.4)';
  const border = 'rgba(245,240,232,0.07)';

  return (
    <div
      className="w-full px-6 md:px-16 lg:px-24 xl:px-32 py-10 mx-auto"
      style={{ background: '#0d0d12', minHeight: '100vh' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {['Inicio', 'Productos', product.category].map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="text-xs cursor-pointer transition-opacity hover:opacity-60"
              style={{ color: textMuted, fontSize: '0.7rem', letterSpacing: '0.08em' }}
            >
              {crumb}
            </span>
            <span style={{ color: 'rgba(245,240,232,0.15)', fontSize: '0.65rem' }}>/</span>
          </span>
        ))}
        <span
          className="text-xs"
          style={{ color: accent, fontSize: '0.7rem', letterSpacing: '0.08em' }}
        >
          {product.name}
        </span>
        <button
          onClick={onClose}
          className="ml-2 text-xs cursor-pointer transition-opacity hover:opacity-60 underline underline-offset-2"
          style={{ color: textMuted, background: 'none', border: 'none', fontSize: '0.7rem' }}
        >
          ← Volver
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 max-w-5xl">
        {/* Images */}
        <div className="flex gap-3 flex-shrink-0">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2.5">
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                className="w-16 h-20 overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  borderRadius: '8px',
                  border: `1.5px solid ${selectedImg === i ? accent : 'rgba(245,240,232,0.08)'}`,
                  background: '#1a1a22',
                  opacity: selectedImg === i ? 1 : 0.55,
                }}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '280px',
              maxWidth: '100%',
              aspectRatio: '3/4',
              borderRadius: '16px',
              background: '#1a1a22',
              border: `0.5px solid ${border}`,
            }}
          >
            <img
              src={product.images[selectedImg]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-opacity duration-300"
              style={{ filter: 'brightness(0.92) saturate(0.85)' }}
            />

            {/* Wishlist */}
            <button
              onClick={() => setWishlisted((w) => !w)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center cursor-pointer transition-all"
              style={{
                background: 'rgba(13,13,18,0.6)',
                borderRadius: '50%',
                border: `0.5px solid ${wishlisted ? accent : 'rgba(245,240,232,0.15)'}`,
                backdropFilter: 'blur(6px)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={wishlisted ? accent : 'none'}
                stroke={accent}
                strokeWidth="1.8"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Badge */}
            {product.badge && (
              <div
                className="absolute top-3 left-3"
                style={{
                  background: 'rgba(13,13,18,0.72)',
                  border: `0.5px solid ${accent}`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.58rem',
                    color: accent,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {product.badge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-5 flex-1">
          {/* Category tag */}
          <div className="flex items-center gap-3" style={{ color: accent }}>
            <div style={{ width: '1.4rem', height: '1px', background: accent }} />
            <span
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              color: textMain,
            }}
          >
            {product.name}
          </h1>

          {/* Stars + reviews */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} accent={accent} />
            <span style={{ fontSize: '0.72rem', color: textMuted }}>
              ({product.reviews} reseñas)
            </span>
          </div>

          {/* Price */}
          <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '1.25rem' }}>
            {product.mrp && (
              <p className="text-sm line-through mb-0.5" style={{ color: 'rgba(245,240,232,0.2)' }}>
                ${product.mrp}
              </p>
            )}
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.2rem',
                  color: accent,
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                ${product.price}
              </span>
              <span style={{ fontSize: '0.68rem', color: textMuted, letterSpacing: '0.06em' }}>
                IVA incluido
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: '1.25rem' }}>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: textMuted, letterSpacing: '0.2em' }}
            >
              Sobre el producto
            </p>
            <ul className="space-y-2">
              {[
                product.description,
                'Material de alta calidad',
                'Disponible en diferentes tallas',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div
                    className="mt-1.5 flex-shrink-0"
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: accent,
                      opacity: 0.6,
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: textMuted, lineHeight: 1.7 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA buttons */}
          <div
            className="flex gap-3 mt-2"
            style={{ borderTop: `0.5px solid ${border}`, paddingTop: '1.5rem' }}
          >
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 py-3.5 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70 cursor-pointer"
              style={{
                background: 'transparent',
                border: `0.5px solid rgba(245,240,232,0.18)`,
                borderRadius: '8px',
                color: 'rgba(245,240,232,0.55)',
                fontFamily: "'Jost', sans-serif",
                letterSpacing: '0.14em',
              }}
            >
              Añadir al carrito
            </button>
            <button
              className="flex-1 py-3.5 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-85 cursor-pointer"
              style={{
                background: buttonBg || accent,
                color: buttonText || '#0d0d12',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Jost', sans-serif",
                letterSpacing: '0.14em',
              }}
            >
              Comprar ahora
            </button>
          </div>

          {/* Trust badges - Payment & Delivery */}
          {(tienda?.metodosPago?.length > 0 || tienda?.metodosEntrega?.length > 0) && (
            <div className="flex gap-3 flex-wrap" style={{ paddingTop: '0.5rem' }}>
              {tienda?.metodosPago?.slice(0, 3).map((m: any) => (
                <MetodoChip
                  key={m.metodoPago?.id || m.id || m}
                  nombre={m.metodoPago?.nombre || m.nombre || m}
                  iconSize={18}
                  borderColor="rgba(245,240,232,0.1)"
                  textColor="rgba(245,240,232,0.5)"
                />
              ))}
              {tienda?.metodosEntrega?.slice(0, 2).map((m: any) => (
                <MetodoChip
                  key={m.metodoEntrega?.id || m.id || m}
                  nombre={m.metodoEntrega?.nombre || m.nombre || m}
                  iconSize={18}
                  borderColor="rgba(245,240,232,0.1)"
                  textColor="rgba(245,240,232,0.5)"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModer;
