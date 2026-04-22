import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ICON from './../../../assets/Logo.svg';
import { DemoWindow } from './DemoWindows';
import Logo from '@/components/common/Logo';
import NavLinkAnimado from '@/components/inputs/NavLinkAnimado';

// ─── Datos ────────────────────────────────────────────────────────────────────

const words = ['Rapida', 'Gratis', 'Tuya', 'Unica'];

const NAV_LINKS = [
  { label: 'Funciones', href: '/#plataforma' },
  { label: 'Diseños', href: '/#diseno' },
  { label: 'Precios', href: '/#precios' },
];

// ─── Hero principal ───────────────────────────────────────────────────────────

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const wordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoBrushRefs = useRef<SVGPathElement[]>([]);

  const [wordIndex, setWordIndex] = useState(0);

  // ── Animación de entrada ──────────────────────────────────────────────────
  useEffect(() => {
    const els = [
      navRef.current,
      badgeRef.current,
      titleRef.current,
      subRef.current,
      btnsRef.current,
      trustRef.current,
    ].filter(Boolean);

    gsap.set(els, { opacity: 0, y: 24 });
    gsap.set(demoRef.current, { opacity: 0, y: 48, scale: 0.97 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to(
        logoBrushRefs.current,
        { strokeDashoffset: 0, duration: 0.25, stagger: 0.15, ease: 'power2.out' },
        '-=0.2'
      )
      .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.3')
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35')
      .to(btnsRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to(trustRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
      .to(
        demoRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, []);

  // ── Texto rotativo con flip 3D ────────────────────────────────────────────
  useEffect(() => {
    wordIntervalRef.current = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        rotateX: -90,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setWordIndex((p) => (p + 1) % words.length);
          gsap.fromTo(
            wordRef.current,
            { rotateX: 90, opacity: 0 },
            { rotateX: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    }, 2500);

    return () => {
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      style={{ background: '#f7f4ef', minHeight: '100vh' }}
      className="relative overflow-hidden"
    >
      {/* Detalles decorativos de fondo — usando el morado como acento, no como fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(203,183,255,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 20%, rgba(255,107,61,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10"
      >
        <Link to="/">
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

      {/* ── Copy central ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-10 text-center sm:px-8 lg:px-10 relative">
        {/* Título */}
        <h1
          ref={titleRef}
          className="mt-7 text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.92] tracking-[-0.06em] text-[#15110e]"
        >
          {/* Mobile: dos líneas. sm+: misma línea */}
          <span className="flex flex-col items-center sm:inline-flex sm:flex-row sm:whitespace-nowrap sm:items-center sm:justify-center gap-y-1 sm:gap-y-0">
            Tu tienda online
            <span className="sm:ml-3" style={{ perspective: '600px', display: 'inline-block' }}>
              <span
                ref={wordRef}
                style={{
                  color: '#ff6b3d',
                  display: 'inline-block',
                  transformStyle: 'preserve-3d',
                  minWidth: '3ch',
                }}
              >
                {words[wordIndex]}
              </span>
            </span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          ref={subRef}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#64584f] sm:text-xl"
        >
          Creá tu tienda en minutos, recibí pedidos por WhatsApp y vendé{' '}
          <span className="relative inline-block whitespace-nowrap text-[#15110e] font-semibold">
            sin pagar comisiones
            {/* Wavy underline */}
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2 text-[#df06d1]"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <path d="M2,13 Q16,2 32,12 T64,12 T98,12" />
            </svg>
          </span>
          . Diseño profesional desde el primer día.
        </p>

        {/* Botones */}
        <div
          ref={btnsRef}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row relative z-20"
        >
          <Link
            to="/register"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#181311] px-9 text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-[#2c241f] transition-colors shadow-[0_8px_24px_rgba(23,18,15,0.18)] relative"
          >
            Crear mi tienda gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#diseno"
            className="inline-flex h-14 items-center justify-center rounded-full border border-[#20150d]/12 bg-white px-9 text-sm font-semibold text-[#1c1613] hover:bg-[#f0ebe4] transition-colors"
          >
            Ver diseños
          </a>

          {/* Arrow & Hand-drawn Note */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[75%] md:translate-x-[90%] md:right-auto md:left-1/2 ml-36 pointer-events-none hidden lg:flex flex-col items-start"
            style={{ transform: 'rotate(4deg)' }}
          >
            <svg
              className="w-14 h-14 text-[#ff6b3d] -rotate-12 absolute -left-12 top-2"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15,90 Q40,40 85,25" />
              <path d="M65,25 L85,25 L75,45" />
            </svg>
            <div className="font-handdrawn text-2xl text-[#64584f] whitespace-nowrap pl-6 pt-10 rotate-6">
              0% Comisiones, <span className="text-[#181311] font-bold">100% tuyo!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seccion de la demo*/}
      <div
        ref={demoRef}
        className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Background Glow / Difuminado */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-[1200px] aspect-[2/1] pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(124, 107, 255, 0.18) 0%, rgba(255, 107, 61, 0.08) 40%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Label */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-[#23180f]/8" />

          <div className="h-px flex-1 bg-[#23180f]/8" />
        </div>

        <DemoWindow />

        {/* Nota debajo */}
        <p className="mt-4 text-center text-[11px] text-[#b0a49c]">
          Así se ve tu tienda. Podés personalizar colores, logo y productos.
        </p>
      </div>
    </section>
  );
}
