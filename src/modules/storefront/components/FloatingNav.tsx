import Logo from "@/components/common/Logo";
import NavLinkAnimado from "@/components/inputs/NavLinkAnimado";
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
const NAV_LINKS = [
  { label: 'Funciones', href: '/#plataforma' },
  { label: 'Diseños', href: '/#diseno' },
  { label: 'Precios', href: '/#precios' },
];
const FloatingNav = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 200);
  });

  return (
    <motion.header
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: isScrolled ? '0%' : '-100%', opacity: isScrolled ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[100] px-4 py-4 pointer-events-none"
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/40 bg-white/80 px-4 py-3 shadow-[0_16px_40px_rgba(58,37,20,0.12)] backdrop-blur-xl sm:px-6 pointer-events-auto"
      >
        <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLinkAnimado key={link.href} to={link.href} label={link.label} />
          ))}
        </div>

        <div className="flex items-center gap-3">
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
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

export default FloatingNav;
