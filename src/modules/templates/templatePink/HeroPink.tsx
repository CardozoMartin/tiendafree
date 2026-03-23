import { useState } from 'react';
import type { CarruselItem } from './types';

const Hero = ({
  onShopClick,
  title,
  subtitle,
  editMode,
  data,
  onChange,
  accent,
  heroLayout = 'split',
  heroCtaTexto = 'Ver colección',
  carrusel,
}: {
  onShopClick: () => void;
  title: string;
  subtitle: string;
  editMode?: boolean;
  data?: any;
  onChange?: (patch: any) => void;
  accent?: string;
  heroLayout?: string;
  heroCtaTexto?: string;
  carrusel?: CarruselItem[];
}) => {
  const [isFocused, setIsFocused] = useState<string | null>(null);
  // Definir imágenes a mostrar (prioriza edición > carrusel real > vacío)
  const images =
    editMode && data?.carrusel
      ? data.carrusel
      : carrusel && Array.isArray(carrusel)
        ? carrusel
        : [];

  const handleUpdateImage = (index: number) => {
    const url = window.prompt('Pega la URL de la nueva imagen:');
    if (url && onChange && data) {
      const arr = [...(data.carrusel || [])];
      arr[index] = { url };
      onChange({ carrusel: arr });
    }
  };

  const isCentered = heroLayout === 'centered';
  const isFull = heroLayout === 'full';

  return (
    <section
      className={`relative overflow-hidden ${isFull ? 'min-h-screen' : 'min-h-[85vh]'} flex items-center transition-colors duration-500`}
      style={{ backgroundColor: 'var(--hero-bg)' }}
    >
      <div
        className={`max-w-6xl w-full mx-auto px-6 md:px-16 grid ${isCentered ? 'grid-cols-1 text-center' : 'md:grid-cols-2'} gap-12 items-center py-20`}
      >
        <div className={isCentered ? 'max-w-2xl mx-auto' : ''}>
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}
          >
            Nueva colección 2026
          </span>
          {editMode ? (
            <input
              className="w-full bg-transparent outline-none border-b-2 border-dashed transition-all duration-300 text-5xl md:text-6xl font-black leading-tight"
              value={data?.titulo ?? title}
              onChange={(e) => onChange?.({ titulo: e.target.value })}
              onFocus={() => setIsFocused('titulo')}
              onBlur={() => setIsFocused(null)}
              placeholder="Escribe el título"
              style={{ 
                color: accent, 
                borderColor: isFocused === 'titulo' ? accent : `${accent}44` 
              }}
            />
          ) : (
            <h1 className="text-5xl md:text-6xl font-black leading-tight" style={{ color: accent }}>
              {title}
            </h1>
          )}
          {editMode ? (
            <textarea
              className="mt-6 w-full bg-transparent outline-none border-b-2 border-dashed text-slate-500 text-base max-w-md leading-relaxed resize-none transition-all duration-300"
              rows={3}
              style={{ 
                borderColor: isFocused === 'descripcion' ? accent : `${accent}44` 
              }}
              value={data?.descripcion ?? subtitle}
              onFocus={() => setIsFocused('descripcion')}
              onBlur={() => setIsFocused(null)}
              onChange={(e) => onChange?.({ descripcion: e.target.value })}
              placeholder="Escribe una pequeña descripción"
            />
          ) : (
            <p className="mt-6 text-slate-500 text-base max-w-md leading-relaxed">{subtitle}</p>
          )}
          <div className={`flex items-center gap-4 mt-8 ${isCentered ? 'justify-center' : ''}`}>
            <button
              onClick={onShopClick}
              className="px-7 py-3.5 font-semibold rounded-full hover:opacity-90 transition-all duration-300 text-sm"
              style={{ 
                backgroundColor: 'var(--button-bg, ' + accent + ')',
                color: 'var(--button-text, #ffffff)'
              }}
            >
              {heroCtaTexto}
            </button>
            <button
              className="px-7 py-3.5 font-semibold rounded-full hover:opacity-80 transition-all duration-300 text-sm"
              style={{
                border: `1px solid var(--primary-color, ${accent})`,
                color: 'var(--primary-color, ' + accent + ')',
              }}
            >
              Nuestra historia
            </button>
          </div>
        </div>
        <div className="relative flex mt-12 md:mt-0 justify-center group/images">
          {images && images[0] && images[0].url ? (
            <div className="w-64 h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-rose-200 rotate-2 relative group/img1">
              <img src={images[0].url} alt="hero" className="w-full h-full object-cover" />
              {editMode && (
                <div className="absolute inset-0 bg-black/40 opacity-90 md:opacity-0 group-hover/img1:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleUpdateImage(0)}
                    className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{
                      backgroundColor: 'var(--button-bg, ' + (accent || '#e11d48') + ')',
                      color: 'var(--button-text, #ffffff)'
                    }}
                  >
                    Cambiar imagen
                  </button>
                </div>
              )}
            </div>
          ) : (
            editMode && (
              <div
                className="w-64 h-80 md:w-72 md:h-96 rounded-3xl border-2 border-dashed rotate-2 flex items-center justify-center relative hover:brightness-95 transition-all cursor-pointer"
                onClick={() => handleUpdateImage(0)}
                style={{ backgroundColor: `${accent}11`, borderColor: `${accent}44` }}
              >
                <span className="font-semibold text-sm" style={{ color: accent }}>+ Imagen principal</span>
              </div>
            )
          )}
          {images && images[1] && images[1].url ? (
            <div className="absolute -bottom-4 -left-2 md:-left-4 w-40 h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden shadow-xl shadow-rose-100 -rotate-3 relative group/img2">
              <img src={images[1].url} alt="hero2" className="w-full h-full object-cover" />
              {editMode && (
                <div className="absolute inset-0 bg-black/40 opacity-90 md:opacity-0 group-hover/img2:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleUpdateImage(1)}
                    className="bg-white text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform text-center mx-2 cursor-pointer"
                  >
                    Cambiar secundaria
                  </button>
                </div>
              )}
            </div>
          ) : (
            editMode && (
              <div
                className="absolute -bottom-4 -left-2 md:-left-4 w-40 h-56 md:w-48 md:h-64 rounded-2xl bg-rose-100 border-2 border-dashed border-rose-300 -rotate-3 flex items-center justify-center hover:bg-rose-200 transition-colors cursor-pointer"
                onClick={() => handleUpdateImage(1)}
              >
                <span className="text-rose-500 font-semibold text-xs">+ Secundaria</span>
              </div>
            )
          )}
          <div className="absolute top-4 -right-4 w-16 h-16 md:w-20 md:h-20 rounded-full opacity-20" style={{ backgroundColor: accent }} />
          <div className="absolute bottom-20 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full opacity-30" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </section>
  );
};
export default Hero;
