import { BRANDS } from './types';

const LogoMarqueeModer = () => (
  <section className="py-10 px-6 md:px-16 lg:px-24 xl:px-32">
    <p className="text-center text-xs text-gray-400 mb-8 tracking-widest uppercase font-medium">
      Marcas con las que trabajamos
    </p>
    <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
      {/* Fade left */}
      <div className="absolute left-0 top-0 h-full w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

      <style>{`
        .marquee-track { animation: marqueeScroll linear infinite; }
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div
        className="marquee-track flex items-center will-change-transform min-w-[200%]"
        style={{ animationDuration: '22s' }}
      >
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 mx-8 shrink-0 group cursor-default"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-6 w-auto opacity-30 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-300"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm font-semibold text-gray-300 group-hover:text-gray-500 transition-colors duration-300 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>

      {/* Fade right */}
      <div className="absolute right-0 top-0 h-full w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>
  </section>
);

export default LogoMarqueeModer;
