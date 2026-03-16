import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogOut } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  MaterialIcon: React.FC<{ name: string; className?: string }>;
  isAuthenticated?: boolean;
  user?: { email: string; fullName: string } | null;
  onLogout?: () => void;
  variant?: 'public' | 'private';
}

const NAV_LINKS: NavLink[] = [
  { label: 'Explorar', href: '#explorar' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
];

const Header = ({
  MaterialIcon,
  isAuthenticated = false,
  user = null,
  onLogout,
  variant = 'public',
}: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg bg-[#6344ee] flex items-center justify-center text-white">
            <ArrowRight />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Vitrina</h2>
        </Link>

        {/* Nav - Solo en rutas públicas */}
        {variant === 'public' && (
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#6344ee]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* CTA / Auth Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Usuario autenticado */}
              <span className="hidden sm:inline text-sm text-slate-600">
                {user.fullName || user.email}
              </span>
              <Link
                to="/panel"
                className="flex h-10 items-center justify-center rounded-xl bg-[#6344ee] px-6 text-sm font-bold text-white shadow-lg shadow-[#6344ee]/20 transition-transform active:scale-95 hover:-translate-y-0.5"
              >
                Panel
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              {/* Usuario no autenticado */}
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-xl px-6 text-sm font-semibold text-slate-700 transition-colors hover:text-[#6344ee]"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-xl bg-[#6344ee] px-6 text-sm font-bold text-white shadow-lg shadow-[#6344ee]/20 transition-transform active:scale-95 hover:-translate-y-0.5 gap-2"
              >
                Crear tienda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;