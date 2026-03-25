import { useState } from 'react';

const products = [
  {
    img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=500&auto=format&fit=crop',
    price: '$29.00',
    name: 'White Crew-Neck T-Shirt',
    tag: 'Nuevo',
  },
  {
    img: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop',
    price: '$39.00',
    name: 'White Crew-Neck T-Shirt',
    tag: 'Más vendido',
  },
  {
    img: 'https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=735&auto=format&fit=crop',
    price: '$29.00',
    name: 'White Crew-Neck T-Shirt',
    tag: null,
  },
  {
    img: 'https://images.unsplash.com/photo-1667243038099-b257ab263bfd?q=80&w=687&auto=format&fit=crop',
    price: '$49.00',
    name: 'White Crew-Neck T-Shirt',
    tag: 'Limitado',
  },
];

const NewArrivalsModer = ({
  accent = '#c9a96e',
  bgColor = '#0d0d12',
  textColor = '#f5f0e8',
}: {
  accent?: string;
  bgColor?: string;
  textColor?: string;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    setWishlist((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3" style={{ color: accent }}>
            <div style={{ width: '1.6rem', height: '1px', background: accent }} />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ letterSpacing: '0.24em' }}
            >
              Colección
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-light leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: textColor,
            }}
          >
            Nuevos <em style={{ color: accent, fontStyle: 'italic' }}>Ingresos</em>
          </h2>
        </div>
        <a
          href="#"
          className="text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-60"
          style={{
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '0.18em',
            textDecoration: 'none',
            paddingBottom: '2px',
            borderBottom: `0.5px solid rgba(245,240,232,0.2)`,
          }}
        >
          Ver todo →
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((item, i) => (
          <a
            key={i}
            href="#"
            className="group flex flex-col"
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Image container */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '14px',
                aspectRatio: '3/4',
                background: '#1a1a22',
              }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover object-top transition-transform duration-500"
                style={{
                  transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                  filter: 'brightness(0.92) saturate(0.88)',
                }}
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-300 flex items-end p-3"
                style={{
                  background: 'linear-gradient(to top, rgba(13,13,18,0.75) 0%, transparent 50%)',
                  opacity: hovered === i ? 1 : 0,
                }}
              >
                <button
                  className="w-full py-2.5 text-xs font-medium tracking-widest uppercase transition-all"
                  style={{
                    background: accent,
                    color: '#0d0d12',
                    border: 'none',
                    borderRadius: '8px',
                    letterSpacing: '0.14em',
                    cursor: 'pointer',
                  }}
                >
                  Agregar al carrito
                </button>
              </div>

              {/* Tag badge */}
              {item.tag && (
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
                    className="text-xs font-medium"
                    style={{
                      color: accent,
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={(e) => toggleWishlist(e, i)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(13,13,18,0.55)',
                  borderRadius: '50%',
                  border: '0.5px solid rgba(245,240,232,0.15)',
                  backdropFilter: 'blur(6px)',
                  cursor: 'pointer',
                  transform: hovered === i || wishlist.includes(i) ? 'scale(1)' : 'scale(0.85)',
                  opacity: hovered === i || wishlist.includes(i) ? 1 : 0,
                  transition: 'transform 0.2s, opacity 0.2s',
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill={wishlist.includes(i) ? accent : 'none'}
                  stroke={accent}
                  strokeWidth="1.8"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Product info */}
            <div className="mt-3 flex flex-col gap-0.5 px-1">
              <p
                className="text-sm font-light truncate"
                style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.78rem' }}
              >
                {item.name}
              </p>
              <div className="flex items-center justify-between">
                <p
                  className="font-light"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem',
                    color: accent,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.price}
                </p>
                <span
                  className="text-xs"
                  style={{
                    color: 'rgba(245,240,232,0.2)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  + envío
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom CTA mobile */}
      <div className="mt-10 flex justify-center md:hidden">
        <a
          href="#"
          className="px-8 py-3 text-xs font-medium tracking-widest uppercase rounded-full transition-opacity hover:opacity-80"
          style={{
            border: `0.5px solid rgba(245,240,232,0.2)`,
            color: 'rgba(245,240,232,0.6)',
            textDecoration: 'none',
            letterSpacing: '0.18em',
          }}
        >
          Ver toda la colección
        </a>
      </div>
    </section>
  );
};

export default NewArrivalsModer;
