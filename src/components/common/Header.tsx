import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ICON from '@/assets/Logo.svg';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { email: string; fullName: string } | null;
  onLogout?: () => void;
  variant?: 'public' | 'private';
}

const NAV_LINKS = [
  { label: 'Funciones', href: '/#plataforma' },
  { label: 'Diseños', href: '/#diseno' },
  { label: 'Precios', href: '/#precios' },
];

const Header = ({
  isAuthenticated = false,
  user = null,
  onLogout,
  variant = 'public',
}: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`z-50 w-full transition-all duration-300 ${isHome
          ? scrolled
            ? 'fixed inset-x-0 top-0 translate-y-0 border-b border-[#20150d]/8 bg-[#f7f4ef]/88 opacity-100 backdrop-blur-md'
            : 'pointer-events-none fixed inset-x-0 top-0 -translate-y-full opacity-0'
          : scrolled
            ? 'sticky top-0 border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm'
            : 'sticky top-0 bg-transparent'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0 transition-opacity hover:opacity-80">
          <img
            src={ICON}
            alt="TiendiZi"
            className="w-12 h-16 sm:w-16 sm:h-[80px] object-contain"
          />
          <div>
            <p className="text-lg sm:text-2xl font-black tracking-[-0.04em] flex items-center">
              <span className="relative inline-flex items-center justify-center isolate">
                <svg
                  className="absolute inset-0 -z-10 mx-auto w-[150%] h-[160%] -translate-x-3 -translate-y-2"
                  viewBox="0 0 100 48"
                  fill="none"
                  stroke="#fca326"
                  strokeWidth="14"
                  strokeLinecap="round"
                >
                  <path
                    className="opacity-95"
                    d="M92,24 L10,24"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                  />
                  <path
                    className="opacity-90"
                    d="M8,38 L95,34"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="relative z-10 text-[#15110e] px-1 flex items-center">
                  <span className="text-purple-600">TiendiZi</span>
                </div>
              </span>
            </p>
          </div>
        </Link>

        {variant === 'public' && (
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#ff6b3d]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                {user.fullName || user.email}
              </span>
              <Link
                to="/panel"
                className="flex h-10 items-center justify-center rounded-xl bg-[#181311] px-6 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                Panel
              </Link>
              <button
                onClick={onLogout}
                className="flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-xl px-6 text-sm font-semibold text-slate-700 transition-colors hover:text-[#ff6b3d]"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#181311] px-6 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                Crear tiendas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
