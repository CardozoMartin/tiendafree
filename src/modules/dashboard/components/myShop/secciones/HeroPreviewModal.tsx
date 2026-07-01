import { useState, useEffect, useRef } from 'react';

type TipoHero = 'HERO_FIJO' | 'CARRUSEL' | 'GALERIA';

interface Props {
  tipoActual: TipoHero;
  onClose: () => void;
  onSelect: (tipo: TipoHero) => void;
}

const DEMO_SLIDES = [
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png',
  'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide5.png',
];
const DEMO_IMGS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  'https://images.unsplash.com/photo-1495121605193-b116b5b9c5ee?w=800&q=80',
];

function DemoHeroFijo() {
  return (
    <div className="w-full h-44 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-between px-6 overflow-hidden">
      <div className="space-y-2">
        <div className="h-3 w-28 bg-gray-300 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
        <div className="h-2 w-16 bg-gray-200 rounded" />
        <div className="mt-3 h-6 w-20 bg-gray-800 rounded-full" />
      </div>
      <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0" />
    </div>
  );
}

function DemoCarrusel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => setIdx((i) => (i + 1) % DEMO_SLIDES.length), 3000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return (
    <div className="w-full h-44 rounded-xl overflow-hidden relative">
      <img
        src={DEMO_SLIDES[idx]}
        alt="slide"
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1">
        <div className="h-3 w-24 bg-white/60 rounded" />
        <div className="h-2 w-16 bg-white/40 rounded" />
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {DEMO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
      {/* Flechas */}
      <button
        onClick={() => setIdx((i) => (i - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/70 rounded-full flex items-center justify-center text-xs"
      >‹</button>
      <button
        onClick={() => setIdx((i) => (i + 1) % DEMO_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/70 rounded-full flex items-center justify-center text-xs"
      >›</button>
    </div>
  );
}

function DemoGaleria() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="w-full h-44 rounded-xl overflow-hidden flex gap-0.5">
      {DEMO_IMGS.slice(0, 5).map((src, i) => (
        <div
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="relative overflow-hidden transition-all duration-500 cursor-pointer flex-shrink-0"
          style={{ flex: hovered === i ? '3' : '1' }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${hovered === i ? 'opacity-0' : 'opacity-40'}`} />
        </div>
      ))}
    </div>
  );
}

const OPCIONES: { tipo: TipoHero; label: string; desc: string; icon: string; Demo: React.FC }[] = [
  { tipo: 'HERO_FIJO', label: 'Hero clásico',  desc: 'Texto a la izquierda, imagen circular a la derecha.', icon: '🖼️', Demo: DemoHeroFijo },
  { tipo: 'CARRUSEL',  label: 'Carrusel',       desc: 'Slides a pantalla completa con textos encima.',      icon: '🎞️', Demo: DemoCarrusel },
  { tipo: 'GALERIA',   label: 'Galería',         desc: 'Paneles que se expanden al pasar el cursor.',         icon: '🖇️', Demo: DemoGaleria },
];

export default function HeroPreviewModal({ tipoActual, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Diseños del hero</h2>
            <p className="text-xs text-gray-400 mt-0.5">Elegí cómo se verá la sección de entrada de tu tienda</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {OPCIONES.map(({ tipo, label, desc, icon, Demo }) => (
            <div
              key={tipo}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                tipoActual === tipo ? 'border-gray-900' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <Demo />
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    {tipoActual === tipo && (
                      <span className="text-[10px] font-semibold bg-gray-900 text-white px-1.5 py-0.5 rounded-full">Actual</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => onSelect(tipo)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    tipoActual === tipo
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tipoActual === tipo ? 'Seleccionado' : 'Elegir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
