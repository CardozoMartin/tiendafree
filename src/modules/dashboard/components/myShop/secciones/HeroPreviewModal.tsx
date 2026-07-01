import { useEffect, useState } from 'react';
import MI from '../../MaterialIcon';

// Modal que muestra una vista previa (representativa) de cada tipo de hero,
// para que el dueño entienda cómo se verá antes de elegirlo. Usa imágenes de
// muestra genéricas — no depende de las fotos que el dueño haya subido.

type TipoHero = 'HERO_FIJO' | 'CARRUSEL' | 'GALERIA';

// Imágenes de ejemplo para la galería (verticales, quedan bien expandidas).
const DEMO_IMGS = [
  'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=600&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=600&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=600&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=600&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=600&w=600&auto=format&fit=crop',
];

// Slides de ejemplo para el carrusel (mismas imágenes que el snippet original).
const DEMO_SLIDES = [
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png',
];

const META: Record<TipoHero, { label: string; desc: string }> = {
  HERO_FIJO: { label: 'Hero clásico', desc: 'Un título grande con texto y un botón, acompañado de una imagen. Ideal para transmitir tu mensaje principal.' },
  CARRUSEL:  { label: 'Carrusel full', desc: 'Imágenes a pantalla completa que rotan solas. Perfecto para destacar varias fotos o promociones.' },
  GALERIA:   { label: 'Galería expandible', desc: 'Una fila de imágenes que se agrandan al pasar el mouse. Moderno y visual para mostrar tus productos o trabajos.' },
};

// ── Mini-representaciones de cada diseño ──────────────────────────────────────

function DemoHeroFijo() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-6 p-8">
        <div className="flex-1 space-y-3">
          <div className="h-6 w-4/5 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-8 w-32 rounded-full bg-indigo-500 mt-2" />
        </div>
        <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 border-4 border-slate-100">
          <img src={DEMO_IMGS[0]} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

// Carrusel REAL con el efecto slide (igual que shop-v3): auto-play + flechas + dots.
function DemoCarrusel() {
  const [current, setCurrent] = useState(0);
  const total = DEMO_SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 3000);
    return () => clearInterval(id);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden p-6">
      <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {/* Track deslizante */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {DEMO_SLIDES.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover flex-shrink-0" />
          ))}
        </div>
        {/* Flechas */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition"
        >
          <MI name="chevron_left" className="!text-base text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition"
        >
          <MI name="chevron_right" className="!text-base text-white" />
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {DEMO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? '#6366f1' : '#cbd5e1',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Galería expandible REAL (con el hover funcionando en el preview).
function DemoGaleria() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden p-6">
      <div className="flex items-center gap-1.5 h-56 w-full">
        {DEMO_IMGS.map((src, i) => (
          <div
            key={i}
            className="relative grow transition-all w-16 rounded-lg overflow-hidden h-56 duration-500 hover:w-full cursor-pointer"
          >
            <img src={src} alt="" className="h-full w-full object-cover object-center" />
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-3">Pasá el mouse por las imágenes 👆</p>
    </div>
  );
}

interface Props {
  tipo: TipoHero;
  onClose: () => void;
}

export default function HeroPreviewModal({ tipo, onClose }: Props) {
  const meta = META[tipo];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Vista previa</p>
            <h3 className="text-lg font-black text-slate-900">{meta.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <MI name="close" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-slate-500 mb-5">{meta.desc}</p>
          {tipo === 'HERO_FIJO' && <DemoHeroFijo />}
          {tipo === 'CARRUSEL' && <DemoCarrusel />}
          {tipo === 'GALERIA' && <DemoGaleria />}
          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Las imágenes son de ejemplo. En tu tienda se usarán las que subas.
          </p>
        </div>
      </div>
    </div>
  );
}
