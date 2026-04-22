
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavLinkAnimado from '../inputs/NavLinkAnimado';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { email: string; fullName: string } | null;
  onLogout?: () => void;
}

const NAV_LINKS = [
  { label: 'Funciones', href: '/#plataforma' },
  { label: 'Diseños', href: '/#diseno' },
  { label: 'Precios', href: '/#precios' },
];


const Header = ({ isAuthenticated = false, user = null, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f7f4ef]/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLinkAnimado key={link.href} to={link.href} label={link.label} />
          ))}
        </nav>

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
                className="hidden h-10 items-center justify-center rounded-xl bg-[#181311] px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:scale-95 sm:flex"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#181311] px-6 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                Crear tienda
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
