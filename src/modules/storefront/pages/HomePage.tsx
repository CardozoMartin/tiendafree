import Footer from '@/components/common/Footer';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ICON from './../../../assets/Logo.svg';
import BenefitStack from '../components/Benefitstack';
import ClosingSection from '../components/ClosingSection';
import Hero from '../components/Hero';
import SectionProducts from '../components/SectionProducts';

function FloatingNav() {
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
          <img
            src={ICON}
            alt="TiendiZi"
            className="w-12 h-16 sm:w-20 sm:h-[100px] object-contain"
          />
          <div>
            <p className="text-lg sm:text-2xl font-black tracking-[-0.04em] flex items-center">
              <span className="relative inline-flex items-center justify-center isolate">
                <svg
                  className="absolute inset-0 -z-10 mx-auto w-[150%] h-[160%] lg:-translate-x-3 lg:-translate-y-2 -translate-x-[0.6rem] -translate-y-[0.4rem]"
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

        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#plataforma"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Funciones
          </a>
          <a
            href="#diseno"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Diseños
          </a>
          <a
            href="#precios"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Precios
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            to="/login"
            className="hidden text-sm font-bold text-[#17120f] sm:block hover:opacity-70 transition-opacity"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex h-9 sm:h-11 items-center gap-1 sm:gap-2 rounded-full bg-[#181311] px-3 sm:px-5 text-[11px] sm:text-sm font-bold uppercase tracking-[0.05em] sm:tracking-[0.12em] text-white hover:bg-[#2c241f] transition-colors whitespace-nowrap"
          >
            Crear tienda
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

export default function HomePage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #f7f4ef; font-family: 'Manrope', sans-serif; }
      `}</style>
      <div className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-[#17120f]">
        <FloatingNav />
        <main>
          <Hero />
          <SectionProducts />
          {/* <FeatureShowcase /> */}
          <BenefitStack></BenefitStack>
          <ClosingSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
