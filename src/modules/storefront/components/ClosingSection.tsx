/**
 * ClosingSection.tsx
 *
 * Sección de cierre unificada que reemplaza Story + Design + Proof.
 * Estética 100% alineada con el Hero: fondo crema #f7f4ef, palette cálida,
 * glow morado/naranja, tipografía black con tracking negativo.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import imagen1 from '../../../assets/HomeInfo/Imagen 1.png';
import imagen2 from '../../../assets/HomeInfo/Imagen 2.png';
import imagen3 from '../../../assets/HomeInfo/Imagen 3.png';
import imagen4 from '../../../assets/HomeInfo/Imagen 4.png';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FloatingCard {
  id: string;
  image: string;
  label: string;
  accent: string;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const stats: Stat[] = [
  { value: '24 hs', label: 'para lanzar una tienda que ya se siente profesional' },
  { value: '0%', label: 'de comisión sobre tus ventas. Siempre.' },
  { value: '100%', label: 'pensada primero para celular' },
];

const floatingCards: FloatingCard[] = [
  { id: 'editorial', image: imagen1, label: 'Expresiva', accent: '#eb5fa0' },
  { id: 'joya', image: imagen2, label: 'Delicada', accent: '#7c6bff' },
  { id: 'gorra', image: imagen3, label: 'Urbana', accent: '#181311' },
  { id: 'moderna', image: imagen4, label: 'Editorial', accent: '#ff6b3d' },
];

/**
 * Rotaciones base por índice de posición en la grilla 2x2.
 * Se mantienen consistentes entre renders para evitar saltos de animación.
 */
const BASE_ROTATIONS = ['-2.5deg', '2deg', '-1.5deg', '2.5deg'] as const;

// ─── Componente principal ──────────────────────────────────────────────────────

export default function ClosingSection() {
  const [activeCard, setActiveCard] = useState<number>(0);

  // Rotación automática de la tarjeta resaltada cada 3.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % floatingCards.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="precios" className="relative bg-[#f7f4ef] overflow-hidden">
      {/* ── Glow de fondo — mismo del Hero ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 75% 65%, rgba(203,183,255,0.16) 0%, transparent 70%), radial-gradient(ellipse 35% 25% at 20% 20%, rgba(255,107,61,0.07) 0%, transparent 60%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────
          BLOQUE 1 · Showcase de plantillas flotantes + titular
      ───────────────────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        {/* Grilla: plantillas a la izq, texto a la der */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* ── Plantillas flotantes — grilla 2x2 responsive ── */}
          <div className="relative w-full p-4 order-2 lg:order-1">
            {/*
             * La grilla 2x2 reemplaza el posicionamiento absoluto por tarjeta.
             * La altura la determina el contenido (aspect-ratio 3/4 en cada imagen),
             * sin necesidad de fijar h-[420px] o h-[520px].
             */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              {floatingCards.map((card, i) => {
                const isActive = activeCard === i;

                return (
                  <motion.div
                    key={card.id}
                    className="rounded-[1.4rem] overflow-hidden cursor-pointer"
                    // marginTop negativo en la segunda fila: efecto de solapado sutil
                    style={{ marginTop: i >= 2 ? '-8px' : undefined }}
                    animate={{
                      rotate: isActive ? `calc(${BASE_ROTATIONS[i]} - 0.5deg)` : BASE_ROTATIONS[i],
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -10 : 0,
                      zIndex: isActive ? 10 : 1,
                      boxShadow: isActive
                        ? `0 32px 72px rgba(23,18,15,0.22), 0 0 0 2.5px ${card.accent}`
                        : '0 20px 50px rgba(23,18,15,0.13), 0 2px 8px rgba(23,18,15,0.06)',
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setActiveCard(i)}
                  >
                    {/*
                     * aspect-ratio 3/4 garantiza que la imagen siempre mantenga
                     * proporción de póster, independientemente del ancho disponible.
                     * Reemplaza el maxHeight: 240px que era rígido.
                     */}
                    <div className="w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                      <img
                        src={card.image}
                        alt={`Plantilla ${card.label}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Label inferior */}
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: card.accent }}
                      />
                      <span className="text-[11px] sm:text-[12px] font-bold text-[#17120f] tracking-wide">
                        {card.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Badge central flotante con AnimatePresence */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#17120f]"
                  style={{
                    background: 'rgba(247,244,239,0.94)',
                    border: '1px solid rgba(35,25,15,0.08)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 28px rgba(23,18,15,0.1)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✦ {floatingCards[activeCard].label} — diseño listo para vender
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Texto ── */}
          <div className="order-1 lg:order-2 flex flex-col items-start">
            {/* Badge — mismo estilo que Hero */}
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] mb-8"
              style={{
                background: 'rgba(203,183,255,0.22)',
                border: '1px solid rgba(124,107,255,0.18)',
                color: '#5a4acc',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Sistema visual
            </span>

            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em] text-[#15110e]">
              Diseños que se adaptan
              <br />
              <span className="text-[#ff6b3d]">a tu negocio.</span>
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-[#64584f]">
              Desde una tienda de gorras hasta joyas artesanales. TiendaFree tiene plantillas
              pensadas para que tu marca se vea profesional desde el primer día.
            </p>

            {/* Lista de beneficios */}
            <ul className="mt-8 space-y-3">
              {[
                'Personalizá colores, fuentes y logo',
                'Adaptable a cualquier rubro o producto',
                'Optimizado para celular desde el día 1',
                'Sin saber ni una línea de código',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[#17120f] text-[15px] font-medium"
                >
                  <BadgeCheck className="h-5 w-5 text-[#ff6b3d] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          BLOQUE 2 · Stats + CTA final (fondo oscuro #181311)
      ───────────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#181311] overflow-hidden">
        {/* Glow morado/naranja */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 75% 55%, rgba(124,107,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 15% 20%, rgba(255,107,61,0.08) 0%, transparent 60%)',
          }}
        />
      </div>
    </section>
  );
}
