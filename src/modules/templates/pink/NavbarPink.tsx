import { useState } from 'react';

const Navbar = ({
  onCartClick,
  cartCount,
  onLogoClick,
  brandName = 'LUMÉ',
  editMode,
  onChange,
  accent,
  bgColor,
  navbarStyle = 'sticky',
  navbarFixed = true,
}: {
  onCartClick: () => void;
  cartCount: number;
  onLogoClick: () => void;
  brandName?: string;
  editMode?: boolean;
  onChange?: (val: string) => void;
  accent?: string;
  bgColor?: string;
  navbarStyle?: string;
  navbarFixed?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const navClasses = {
    sticky: `${navbarFixed ? 'sticky top-0' : 'relative'} z-50 border-b`,
    transparent: "absolute top-0 left-0 right-0 z-50 border-none bg-transparent",
    floating: "fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-7xl rounded-full shadow-lg z-50 border"
  }[navbarStyle as 'sticky' | 'transparent' | 'floating'] || `${navbarFixed ? 'sticky top-0' : 'relative'} z-50 border-b`;

  return (
    <nav 
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 transition-all duration-300 ${navClasses}`}
      style={{ 
        backgroundColor: navbarStyle === 'transparent' ? 'transparent' : (bgColor || '#ffffff'),
        borderColor: 'var(--nav-border, #fecdd3)'
      }}
    >
      {editMode ? (
        <input
          className="font-black text-2xl tracking-tight bg-transparent outline-none w-48 border-b-2 border-dashed transition-colors"
          style={{ color: accent || '#881337', borderColor: accent || '#fda4af' }}
          value={brandName}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Nombre de tienda"
        />
      ) : (
        <button
          onClick={onLogoClick}
          className="font-black text-2xl tracking-tight cursor-pointer"
          style={{ color: accent || '#881337' }}
        >
          {brandName}
        </button>
      )}

      <div className="hidden sm:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--nav-text, #475569)' }}>
        <a href="#" className="nav-link-hover transition-colors">
          Inicio
        </a>
        <a href="#" className="nav-link-hover transition-colors">
          Productos
        </a>
        <a href="#" className="nav-link-hover transition-colors">
          Nosotras
        </a>
        <a href="#" className="nav-link-hover transition-colors">
          Contacto
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onCartClick} className="relative cursor-pointer">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: accent || '#f43f5e' }}>
              {cartCount}
            </span>
          )}
        </button>
        <button className="hidden sm:block px-5 py-2 text-sm font-medium rounded-full opacity-90 hover:opacity-100 transition-opacity"
                style={{ 
                  backgroundColor: 'var(--button-bg, ' + (accent || '#e11d48') + ')',
                  color: 'var(--button-text, #ffffff)'
                }}>
          Ingresar
        </button>
        <button onClick={() => setOpen(!open)} className="sm:hidden text-slate-700">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div 
          className="absolute top-16 left-0 w-full border-b border-rose-100 py-4 flex flex-col gap-3 px-6 text-sm font-medium text-slate-600 sm:hidden shadow-lg transition-colors"
          style={{ backgroundColor: bgColor || '#ffffff' }}
        >
          <a href="#">Inicio</a>
          <a href="#">Productos</a>
          <a href="#">Nosotras</a>
          <a href="#">Contacto</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
