import { useState } from 'react';

const HeaderModer = ({
  cartCount,
  onCartClick,
  brandName = 'Mi Logo',
  accent,
  bgColor,
  navbarStyle = 'sticky',
  navbarFixed = true,
}: {
  cartCount: number;
  onCartClick: () => void;
  brandName?: string;
  accent?: string;
  bgColor?: string;
  navbarStyle?: string;
  navbarFixed?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const navClasses =
    {
      sticky: `${navbarFixed ? 'sticky top-0' : 'relative'} z-50 border-b`,
      transparent: 'absolute top-0 left-0 right-0 z-50 border-none bg-transparent',
      floating:
        'fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-7xl rounded-full shadow-lg z-50 border',
    }[navbarStyle as 'sticky' | 'transparent' | 'floating'] ||
    `${navbarFixed ? 'sticky top-0' : 'relative'} z-50 border-b`;

  // Para el estilo transparent (encima del hero fullscreen)
  // los textos y links deben ser blancos
  const isTransparent = navbarStyle === 'transparent';
  const textColor = isTransparent
    ? 'rgba(245,240,232,0.9)'
    : `var(--navbar-text, ${accent || '#1a1a1a'})`;
  const linkColor = isTransparent ? 'rgba(245,240,232,0.65)' : 'var(--nav-text, #4b5563)';
  const borderColorNav = isTransparent ? 'rgba(245,240,232,0.12)' : '#E5E7EB';
  const inputPlaceholder = isTransparent ? 'rgba(245,240,232,0.4)' : '#9ca3af';

  return (
    <>
      {/* Inyectamos solo el estilo del placeholder que no se puede hacer inline */}
      <style>{`
        .hm-search::placeholder { color: ${inputPlaceholder}; }
        .hm-navlink {
          position: relative;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          transition: opacity 0.2s;
          text-decoration: none;
          color: inherit;
        }
        .hm-navlink::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: currentColor;
          transition: width 0.25s ease;
        }
        .hm-navlink:hover { opacity: 0.7; }
        .hm-navlink:hover::after { width: 100%; }
      `}</style>

      <nav
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 transition-all duration-300 ${navClasses}`}
        style={{
          backgroundColor: navbarStyle === 'transparent' ? 'transparent' : bgColor || '#ffffff',
          borderColor: borderColorNav,
          backdropFilter: navbarStyle === 'floating' ? 'blur(12px)' : undefined,
        }}
      >
        {/* ── BRAND ── */}
        <div className="flex items-baseline gap-1" style={{ color: textColor }}>
          <span className="text-xl font-bold tracking-tighter uppercase">{brandName}</span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent || textColor }}
          />
        </div>

        {/* ── DESKTOP NAV ── */}
        <div className="hidden sm:flex items-center gap-8" style={{ color: linkColor }}>
          {['Inicio', 'Nosotros', 'Contacto'].map((l) => (
            <a key={l} href="#" className="hm-navlink">
              {l}
            </a>
          ))}

          {/* Search */}
          <div
            className="hidden lg:flex items-center text-sm gap-2 px-3 rounded-full"
            style={{
              border: `0.5px solid ${isTransparent ? 'rgba(245,240,232,0.2)' : '#d1d5db'}`,
              background: isTransparent ? 'rgba(255,255,255,0.07)' : 'transparent',
            }}
          >
            <input
              className="hm-search py-1.5 w-full bg-transparent outline-none text-sm"
              style={{
                color: isTransparent ? 'rgba(245,240,232,0.85)' : '#374151',
                minWidth: '160px',
              }}
              type="text"
              placeholder="Buscar productos, marcas y más..."
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path
                d="M10.836 10.615 15 14.695"
                stroke={isTransparent ? 'rgba(245,240,232,0.4)' : '#7A7B7D'}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                clipRule="evenodd"
                d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                stroke={isTransparent ? 'rgba(245,240,232,0.4)' : '#7A7B7D'}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Cart */}
          <button className="relative cursor-pointer" onClick={onCartClick}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke={isTransparent ? 'rgba(245,240,232,0.8)' : accent || '#615fff'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-3 text-xs text-white w-[18px] h-[18px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: accent }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* CTA */}
          <button
            className="cursor-pointer px-8 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: isTransparent
                ? 'rgba(255,255,255,0.12)'
                : `var(--button-bg, ${accent || '#6344ee'})`,
              color: isTransparent ? 'rgba(245,240,232,0.9)' : 'var(--button-text, #ffffff)',
              border: isTransparent ? '0.5px solid rgba(245,240,232,0.25)' : 'none',
              backdropFilter: isTransparent ? 'blur(8px)' : undefined,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
            }}
          >
            Ingresar
          </button>
        </div>

        {/* ── HAMBURGER ── */}
        <button onClick={() => setOpen(!open)} className="sm:hidden">
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
            <rect
              width="21"
              height="1.5"
              rx=".75"
              fill={isTransparent ? 'rgba(245,240,232,0.8)' : '#426287'}
            />
            <rect
              x="8"
              y="6"
              width="13"
              height="1.5"
              rx=".75"
              fill={isTransparent ? 'rgba(245,240,232,0.8)' : '#426287'}
            />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill={isTransparent ? 'rgba(245,240,232,0.8)' : '#426287'}
            />
          </svg>
        </button>

        {/* ── MOBILE MENU ── */}
        {open && (
          <div
            className="absolute top-[60px] left-0 w-full shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden z-50 transition-colors"
            style={{ backgroundColor: bgColor || '#0d0d12' }}
          >
            {['Inicio', 'Nosotros', 'Contacto'].map((l) => (
              <a
                key={l}
                href="#"
                className="block py-1"
                style={{
                  color: isTransparent ? 'rgba(245,240,232,0.8)' : '#374151',
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                }}
              >
                {l}
              </a>
            ))}
            <button
              className="cursor-pointer px-6 py-2 mt-2 transition rounded-full text-sm"
              style={{ backgroundColor: accent || '#6344ee', color: '#fff' }}
            >
              Ingresar
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default HeaderModer;
