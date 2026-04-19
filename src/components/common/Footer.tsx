/**
 * Footer.tsx
 *
 * Footer completo con columnas de links, redes sociales, y legal.
 * Estética alineada con el resto del sitio: fondo crema #f7f4ef,
 * palette cálida, tipografía black con tracking negativo.
 */

import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ICON from '../../assets/Logo.svg';

// ─── Datos ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Plataforma',   href: '#plataforma'  },
  { label: 'Experiencia',  href: '#experiencia' },
  { label: 'Diseño',       href: '#diseno'      },
  { label: 'Precios',      href: '#precios'     },
] as const;

const LEGAL_LINKS = [
  { label: 'Términos de uso',      href: '/terminos'  },
  { label: 'Política de privacidad', href: '/privacidad' },
] as const;

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/tiendafree',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/message/tiendafree',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

const Footer = () => {
  return (
    <footer className="relative border-t border-[#20150d]/8 bg-[#f7f4ef] overflow-hidden">
    {/* Glow sutil — consistente con el resto del sitio */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 40% 60% at 10% 80%, rgba(255,107,61,0.05) 0%, transparent 60%)',
      }}
    />

    <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
      {/* ── Fila principal ── */}
      <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        {/* Columna 1 · Marca + descripción */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 w-fit">
              <img
                src={ICON}
                alt="TiendiZi"
                className="w-10 h-14 sm:w-12 sm:h-16 object-contain"
              />
              <p className="text-lg sm:text-2xl font-black tracking-[-0.04em] flex items-center">
                <span className="relative inline-flex items-center justify-center isolate">
                  {/* 2 Diagonal Brush Strokes — igual que en el Navbar */}
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
                  <span className="relative z-10 text-[#15110e] px-1 flex items-center">
                    <span className="text-purple-600">TiendiZi</span>
                  </span>
                </span>
              </p>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-[#675b54]">
              Diseño, claridad y una experiencia mejor para vender online. Sin comisiones. Sin
              vueltas.
            </p>
          </div>

          {/* Redes sociales */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#20150d]/10 text-[#675b54] transition-colors hover:border-[#20150d]/20 hover:text-[#17120f]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Columna 2 · Navegación */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#17120f]/40">
            Producto
          </p>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#675b54] transition-colors hover:text-[#17120f]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Columna 3 · CTA destacado */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#17120f]/40">
            Empezá hoy
          </p>
          <p className="text-sm leading-6 text-[#675b54]">
            Creá tu tienda gratis en menos de 5 minutos.
          </p>
          <Link
            to="/register"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#17120f] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#ff6b3d]"
          >
            Crear tienda gratis
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Divisor ── */}
      <div className="h-px w-full bg-[#20150d]/8" />

      {/* ── Fila legal ── */}
      <div className="flex flex-col gap-3 py-6 text-xs text-[#675b54]/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TiendiZi. Todos los derechos reservados.</p>
        <div className="flex flex-wrap gap-4">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="transition-colors hover:text-[#17120f]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
