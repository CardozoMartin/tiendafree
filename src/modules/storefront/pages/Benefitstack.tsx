/**
 * BenefitStack.tsx
 *
 * Reemplaza la sección de benefitCards en Capabilities.
 * Requiere: npm install gsap
 *
 * Uso:
 *   import BenefitStack from '@/components/BenefitStack';
 *   // Dentro de <Capabilities /> o directo en HomePage:
 *   <BenefitStack />
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Datos ────────────────────────────────────────────────────────────────────

const slides = [
  {
    tag: 'Diseño Pro',
    title: 'Tu marca,',
    titleAccent: 'tus reglas.',
    accentColor: '#ff6b3d',
    description:
      'Personalizá colores, tipografías y banners. No es solo una tienda, es tu identidad digital reflejada en cada píxel.',
    bg: 'linear-gradient(135deg, #ff6b3d 0%, #e04a1a 100%)',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=60&w=1200',
    num: '01',
  },
  {
    tag: 'Conversión',
    title: 'Ventas por',
    titleAccent: 'WhatsApp.',
    accentColor: '#25d366',
    description:
      'Recibí pedidos listos para procesar. Sin fricciones, directo al grano y con la calidez del trato humano.',
    bg: 'linear-gradient(135deg, #181311 0%, #2b1e17 100%)',
    image:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=60&w=1200',
    num: '02',
  },
  {
    tag: 'Gestión',
    title: 'Control',
    titleAccent: 'total.',
    accentColor: '#7c6bff',
    description:
      'Gestioná stock, categorías y precios desde un panel intuitivo. Pensado para hacerlo todo desde tu celular.',
    bg: 'linear-gradient(135deg, #7c6bff 0%, #5244cc 100%)',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=60&w=1200',
    num: '03',
  },
  {
    tag: 'Libertad',
    title: '0% de',
    titleAccent: 'comisión.',
    accentColor: '#ffd166',
    description:
      'Lo que vendés es 100% para vos. Sin letras chicas ni cargos sorpresa al final del mes. Crecemos juntos.',
    bg: 'linear-gradient(135deg, #181311 0%, #2a1c14 100%)',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=1200',
    num: '04',
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function BenefitStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.benefit-slide');

      // El último slide no se pina (no hay siguiente que lo empuje)
      const pinned = panels.slice(0, -1);

      pinned.forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>('.bs-inner');
        if (!inner) return;

        const panelH = inner.scrollHeight;
        const winH = window.innerHeight;
        const diff = panelH - winH;
        const fakeScrollRatio = diff > 0 ? diff / (diff + winH) : 0;

        // Si el contenido es más alto que la ventana, le damos margen extra
        // para que el usuario pueda terminar de leerlo antes del scale out
        if (fakeScrollRatio) {
          panel.style.marginBottom = `${panelH * fakeScrollRatio}px`;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'bottom bottom',
            end: () =>
              fakeScrollRatio ? `+=${inner.offsetHeight}` : 'bottom top',
            pinSpacing: false,
            pin: true,
            scrub: true,
            // Actualiza el dot activo
            onUpdate: (self) => {
              if (self.progress > 0.05) activateDot(i + 1);
              else activateDot(i);
            },
          },
        });

        // Fake scroll si el panel es muy alto
        if (fakeScrollRatio) {
          tl.to(inner, {
            yPercent: -100,
            y: winH,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: 'none',
          });
        }

        // Scale + fade out (igual a GSAP demo)
        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.88, opacity: 0.5, duration: 0.9 }).to(
          panel,
          { opacity: 0, duration: 0.1 }
        );
      });

      // Dot del primer slide al inicio
      activateDot(0);
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  function activateDot(idx: number) {
    dotsRef.current.forEach((d, i) => {
      if (!d) return;
      d.classList.toggle('bs-dot--active', i === idx);
    });
  }

  return (
    <section id="plataforma" className="relative">
      {/* ── Encabezado ───────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-32 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[#23190f]/10 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#7b5b44]">
              ¿Por qué elegir Vitrina?
            </span>
            <h2 className="mt-6 text-4xl font-black leading-[1.1] tracking-[-0.05em] text-[#16120f] sm:text-6xl">
              Todo lo que necesitás{' '}
              <span className="text-[#ff6b3d]">para escalar tu negocio.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-[#64584f]">
            Cada función pensada en la simplicidad y el impacto visual. Menos
            configuración, más ventas.
          </p>
        </div>
      </div>

      {/* ── Dots de navegación ───────────────────────────────── */}
      <div
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
        aria-hidden="true"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            ref={(el) => { dotsRef.current[i] = el; }}
            className="bs-dot h-2 w-2 rounded-full bg-[#17120f]/20 transition-all duration-300"
            style={{ ['--accent' as string]: slides[i].accentColor }}
          />
        ))}
      </div>

      {/* ── Stack de slides ──────────────────────────────────── */}
      <div ref={wrapperRef} className="slides-wrapper">
        {slides.map((s, i) => (
          <div
            key={i}
            className="benefit-slide relative overflow-hidden"
            style={{ borderRadius: '1.75rem', marginBottom: '2px' }}
          >
            {/* Imagen de fondo con overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            <div
              className="absolute inset-0"
              style={{ background: s.bg, opacity: 0.93 }}
            />

            {/* Número decorativo */}
            <span
              className="pointer-events-none absolute bottom-8 right-8 select-none text-[clamp(5rem,12vw,10rem)] font-black leading-none text-white/[0.08]"
              aria-hidden="true"
            >
              {s.num}
            </span>

            {/* Contenido */}
            <div
              className="bs-inner relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
            >
              {/* Tag */}
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: s.accentColor }}
                />
                {s.tag}
              </span>

              {/* Título */}
              <h2 className="text-[clamp(3rem,9vw,7rem)] font-black leading-[0.92] tracking-[-0.06em] text-white">
                {s.title}
                <br />
                <span style={{ color: s.accentColor }}>{s.titleAccent}</span>
              </h2>

              {/* Descripción */}
              <p className="mx-auto mt-8 max-w-lg text-[clamp(1rem,2vw,1.25rem)] leading-8 text-white/75">
                {s.description}
              </p>

              {/* Pill CTA */}
              <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                Saber más
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Estilos del dot activo ───────────────────────────── */}
      <style>{`
        .bs-dot--active {
          background: var(--accent, #ff6b3d) !important;
          transform: scale(1.5);
        }
        .benefit-slide {
          transform-origin: top center;
        }
      `}</style>
    </section>
  );
}
