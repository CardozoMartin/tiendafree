import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NavbarFloating = () => {
  const { scrollY } = useScroll();
  
  // Transformaciones basadas en el scroll (de px 0 a 100)
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(15, 16, 20, 0)', 'rgba(15, 16, 20, 0.75)']
  );
  
  const navBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ['border-transparent', 'border-white/10']
  );

  const buttonOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const buttonPointerEvents = useTransform(scrollY, [0, 50], ['none', 'auto']);

  return (
    <motion.nav
      style={{
        backgroundColor: navBackground,
        backdropFilter: navBackdropBlur,
        borderColor: navBorder as any,
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full border-2 w-[90%] max-w-4xl transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        <div className="size-6 bg-tiendzi-accent rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-black shrink-0">T</span>
        </div>
        <span className="text-white font-bold tracking-tight text-lg">Tiendzi</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <a href="#features" className="hover:text-white transition-colors">¿Cómo funciona?</a>
        <a href="#showcase" className="hover:text-white transition-colors">Ejemplos</a>
        <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
      </div>

      <motion.div style={{ opacity: buttonOpacity, pointerEvents: buttonPointerEvents as any }}>
        <Link 
          to="/register" 
          className="bg-tiendzi-accent text-white px-5 py-2 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(255,75,38,0.4)] hover:shadow-[0_0_25px_rgba(255,75,38,0.6)] transition-all"
        >
          Crear Tienda
        </Link>
      </motion.div>
    </motion.nav>
  );
};
