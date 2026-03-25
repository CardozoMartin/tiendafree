import { ArrowRight } from 'lucide-react';

interface CarruselItem {
  id?: number;
  url: string;
  src?: string;
  titulo?: string | null;
  subtitulo?: string;
  linkUrl?: string | null;
  orden?: number;
  activa?: boolean;
}

export interface HeroModernProps {
  titulo: string;
  descripcion?: string;
  carrusel?: CarruselItem[];
  heroLayout?: string;
  heroCtaTexto?: string;
  accent?: string;
}

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop', // Principal
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop'
];

export const HeroModern = ({
  titulo,
  descripcion,
  carrusel = [],
  heroCtaTexto = 'Explorar Colección',
  accent = '#c9a96e',
}: HeroModernProps) => {
  const images = carrusel.length > 0 ? carrusel.map(c => c.url) : FALLBACK_IMGS;
  
  // Grid Distribution
  const mainImage = images[0] || FALLBACK_IMGS[0];
  const sideImages = images.slice(1, 5); // Tomamos hasta 4 laterales

  return (
    <section 
      className="relative w-full py-12 md:py-20 px-6 md:px-16 lg:px-24"
      style={{ background: '#0d0d12', overflow: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6 md:gap-8 z-10">
          <div className="flex items-center gap-3">
            <div style={{ width: '2rem', height: '1px', background: accent }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: accent }}>
              Nueva Temporada
            </span>
          </div>

          <div className="space-y-4">
            <h1 
              className="text-white leading-[1.1] font-light"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(3rem, 5vw, 4.5rem)' 
              }}
            >
              {titulo}
            </h1>

            <p 
              className="leading-relaxed font-light max-w-md"
              style={{ 
                fontFamily: "'Jost', sans-serif",
                fontSize: '1rem',
                color: 'rgba(245,240,232,0.6)' 
              }}
            >
              {descripcion || 'Descubre una selección curada de piezas exclusivas diseñadas para elevar tu estilo cotidiano con sofisticación y elegancia.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              className="px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
              style={{ background: accent, color: '#0d0d12' }}
            >
              {heroCtaTexto}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Side: Bento Grid */}
        <div className="w-full lg:w-3/5">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[450px] md:h-[550px]">
            {/* Main Featured Image */}
            <div 
              className="col-span-2 row-span-2 relative group overflow-hidden rounded-[2.5rem]"
              style={{ border: '0.5px solid rgba(245,240,232,0.08)' }}
            >
              <img 
                src={mainImage} 
                alt="Featured" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Side Image 1 */}
            <div className="relative group overflow-hidden rounded-[2rem]" style={{ border: '0.5px solid rgba(245,240,232,0.08)' }}>
              <img 
                src={sideImages[0] || FALLBACK_IMGS[1]} 
                alt="Gallery 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity" />
            </div>

            {/* Side Image 2 */}
            <div className="relative group overflow-hidden rounded-[2rem]" style={{ border: '0.5px solid rgba(245,240,232,0.08)' }}>
              <img 
                src={sideImages[1] || FALLBACK_IMGS[2]} 
                alt="Gallery 2" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity" />
            </div>

            {/* Side Image 3 (Wide in mobile, corner in desktop) */}
            <div className="col-span-2 relative group overflow-hidden rounded-[2rem]" style={{ border: '0.5px solid rgba(245,240,232,0.08)' }}>
              <img 
                src={sideImages[2] || FALLBACK_IMGS[3]} 
                alt="Gallery 3" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
              <div className="absolute bottom-4 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] uppercase tracking-widest text-white/70">Colección Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
    </section>
  );
};

export default HeroModern;
