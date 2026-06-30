/**
 * BenefitStack.tsx
 * Slide stack con animación GSAP.
 * Mobile: imagen arriba + texto con fondo abajo.
 * Desktop: imagen full-screen con texto superpuesto a la izquierda.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

import img1Mobile from '@/assets/CardsHome/image1-mobile.png';
import img1 from '@/assets/CardsHome/imagen 1.png';
import img2 from '@/assets/CardsHome/Imagen 2.png';
import img3 from '@/assets/CardsHome/Imagen 3.png';
import img4 from '@/assets/CardsHome/Imagen 4.png';
import img2Mobile from '@/assets/CardsHome/imagen2-mobile.png';
import img3Mobile from '@/assets/CardsHome/imagen3-mobile.png';
import img4Mobile from '@/assets/CardsHome/imagen4-mobile.png';

gsap.registerPlugin(ScrollTrigger);

// ─── Datos ────────────────────────────────────────────────────────────────────
// position: where text sits on the desktop image
// align: text alignment within the block
const slides = [
  {
    id: 'slide-1',
    image: img1,
    mobileImage: img1Mobile,
    accentColor: '#ff6b3d',
    bg: '#181311',
    badge: 'Plataforma todo en uno',
    title: 'Maneja toda tu tienda',
    titleAccent: 'desde un solo sitio.',
    desc: 'Productos, pedidos, catálogos y diseño. Todo bajo control desde tu celular.',
    // Desktop: centrado verticalmente, izquierda
    desktopClass: 'items-center',
    textPad: 'px-16 xl:px-24',
    textAlign: 'text-left',
    gradientDir: 'to right',
    mobileObjectPosition: 'center 0%',
    desktopObjectPosition: 'center 30%',
  },
  {
    id: 'slide-2',
    image: img2,
    mobileImage: img2Mobile,
    accentColor: '#28c840',
    bg: '#0f1a12',
    badge: 'Logística flexible',
    title: 'Gestioná los envíos',
    titleAccent: 'como más se adapten a tu negocio.',
    desc: 'Configurá tus propios costos y métodos de envío según tu zona y cliente.',
    // Desktop: inferior izquierda, texto más chico
    desktopClass: 'items-end pb-16',
    textPad: 'px-10 xl:px-16',
    textAlign: 'text-left',
    gradientDir: 'to right',
    textSmall: true,
  },
  {
    id: 'slide-3',
    image: img3,
    mobileImage: img3Mobile,
    accentColor: '#7c6bff',
    bg: '#100e1a',
    badge: 'Mobile first',
    title: 'Tu tienda desde el minuto 0',
    titleAccent: 'adaptada para mobile.',
    desc: 'Diseñada para que tus clientes compren desde el celular sin ninguna fricción.',
    // Desktop: inferior izquierda, cerca del borde
    desktopClass: 'items-end pb-16',
    textPad: 'px-10 xl:px-16',
    textAlign: 'text-left',
    gradientDir: 'to right',
  },
  {
    id: 'slide-4',
    image: img4,
    mobileImage: img4Mobile,
    accentColor: '#ff6b3d',
    bg: '#18130e',
    badge: '0% comisiones',
    title: 'Vendé sin pagar',
    titleAccent: 'ninguna comisión.',
    desc: 'Sin cargos ocultos ni letras chicas. TiendaFree no cobra comisiones, nunca.',
    // Desktop: centrado verticalmente, izquierda
    desktopClass: 'items-center',
    textPad: 'px-16 xl:px-24',
    textAlign: 'text-left',
    gradientDir: 'to right',
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function BenefitStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.benefit-slide');
      const pinned = panels.slice(0, -1);

      pinned.forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>('.bs-inner');
        if (!inner) return;

        const panelH = inner.scrollHeight;
        const winH = window.innerHeight;
        const diff = panelH - winH;
        const fakeScrollRatio = diff > 0 ? diff / (diff + winH) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom = `${panelH * fakeScrollRatio}px`;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top', // El panel inicia alineado al borde superior de la pantalla
            end: () => (fakeScrollRatio ? `+=${inner.offsetHeight}` : '+=100%'),
            pinSpacing: false,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              if (self.progress > 0.05) activateDot(i + 1);
              else activateDot(i);
            },
          },
        });

        if (fakeScrollRatio) {
          tl.to(inner, {
            yPercent: -100,
            y: winH,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: 'none',
          });
        }

        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.88, opacity: 0.5, duration: 0.9 }).to(
          panel,
          { opacity: 0, duration: 0.1 }
        );
      });

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
      {/* ── Encabezado ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-32 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{
                background: 'rgba(203,183,255,0.20)',
                border: '1px solid rgba(124,107,255,0.18)',
                color: '#5a4acc',
              }}
            >
              ¿Por qué elegir TiendiZi?
            </span>
            <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-[#15110e] sm:text-5xl">
              Todo lo que necesitás <span className="text-[#ff6b3d]">para escalar tu negocio.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-8 text-[#64584f]">
            Cada función pensada en la simplicidad y el impacto visual. Menos configuración, más
            ventas.
          </p>
        </div>
      </div>

      {/* ── Dots de navegación ─────────────────────────────────────── */}
      <div
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
        aria-hidden="true"
      >
        {slides.map((s, i) => (
          <button
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className="bs-dot h-2 w-2 rounded-full bg-[#17120f]/20 transition-all duration-300"
            style={{ ['--accent' as string]: s.accentColor }}
          />
        ))}
      </div>

      {/* ── Stack de slides ────────────────────────────────────────── */}
      <div ref={wrapperRef} className="slides-wrapper">
        {slides.map((s) => (
          <div
            key={s.id}
            className="benefit-slide relative overflow-hidden"
            style={{ borderRadius: '1.75rem', marginBottom: '2px' }}
          >
            {/* ─── MOBILE: imagen arriba + texto superpuesto dentro de la imagen ─── */}
            <div
              className="bs-inner flex min-h-[110vh] w-full flex-col lg:hidden"
              style={{ background: s.bg }}
            >
              <div className="relative w-full h-[94vh] overflow-hidden">
                <img
                  src={s.mobileImage ?? s.image}
                  alt={s.badge}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: s.mobileObjectPosition ?? 'top' }}
                />
              </div>

              <div className="w-full bg-[#090b10] px-7 py-8">
                <div className="mx-auto flex max-w-5xl flex-col gap-4">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'rgba(255,255,255,0.95)',
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: s.accentColor }}
                    />
                    {s.badge}
                  </span>

                  <h2 className="text-[2rem] font-black leading-[0.95] tracking-[-0.05em] text-white">
                    {s.title}
                    <br />
                    <span style={{ color: s.accentColor }}>{s.titleAccent}</span>
                  </h2>

                  <p className="text-[16px] leading-7 text-white/80">{s.desc}</p>
                </div>
              </div>
            </div>

            {/* ─── DESKTOP: imagen full-screen + texto superpuesto ─── */}
            <div className="bs-inner min-h-screen w-full relative hidden lg:block">
              <img
                src={s.image}
                alt={s.badge}
                className="h-screen w-full object-cover"
                style={{ objectPosition: s.desktopObjectPosition ?? 'center' }}
              />

              {/* Gradiente dinámico para legibilidad */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${s.gradientDir}, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.15) 50%, transparent 80%)`,
                }}
              />

              {/* Texto con posición dinámica por slide */}
              <div className={`absolute inset-0 flex pointer-events-none ${s.desktopClass}`}>
                <div className={`max-w-xl ${s.textPad} ${s.textAlign}`}>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] mb-6"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      color: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: s.accentColor }}
                    />
                    {s.badge}
                  </span>

                  <h2
                    className="font-black leading-[0.92] tracking-[-0.05em] text-white"
                    style={{
                      fontSize: s.textSmall
                        ? 'clamp(1.8rem,2.8vw,3rem)'
                        : 'clamp(2.8rem,4.5vw,5rem)',
                      textShadow: '0 2px 32px rgba(0,0,0,0.3)',
                    }}
                  >
                    {s.title}
                    <br />
                    <span style={{ color: s.accentColor }}>{s.titleAccent}</span>
                  </h2>

                  <p
                    className="mt-6 text-lg leading-8 text-white/75 max-w-sm"
                    style={{ textShadow: '0 1px 12px rgba(0,0,0,0.3)' }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Estilos del dot activo ─────────────────────────────────── */}
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
