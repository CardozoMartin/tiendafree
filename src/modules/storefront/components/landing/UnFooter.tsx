import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export const UnFooter = () => {
  const [shopName, setShopName] = useState('');

  return (
    <footer className="relative bg-tiendzi-accent h-[100svh]">
      <div 
        className="sticky bottom-0 h-[100svh] w-full flex flex-col justify-between p-8 md:p-12"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} // Prevent scrolling past
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
          <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-black tracking-tighter text-tiendzi-bg leading-[0.9]">
            Tu cliente <br/> te está buscando.
          </h2>
          
          <div className="mt-16 w-full max-w-2xl relative">
            <p className="text-tiendzi-bg/70 font-bold mb-4 text-left uppercase tracking-widest text-sm">
              Ingresa el nombre de tu marca
            </p>
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Ej. Mi Tiendita"
                className="w-full bg-transparent border-b-4 border-tiendzi-bg/20 text-4xl sm:text-6xl font-black text-tiendzi-bg pl-0 pr-16 py-4 focus:outline-none focus:border-tiendzi-bg placeholder:text-tiendzi-bg/20 transition-colors"
              />
              <div 
                className={`absolute right-0 flex items-center justify-center size-14 sm:size-16 rounded-full bg-tiendzi-bg text-white cursor-pointer transition-all ${
                  shopName.length > 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
                }`}
                onClick={() => {
                  if (shopName.length > 2) {
                    window.location.href = `/register?shopName=${encodeURIComponent(shopName)}`;
                  }
                }}
              >
                <ArrowRight className="size-6 sm:size-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t-2 border-tiendzi-bg/10 text-tiendzi-bg/60 font-medium text-sm">
          <p>© {new Date().getFullYear()} Tiendzi. Creado para los locales.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-tiendzi-bg transition-colors">Términos</a>
            <a href="#" className="hover:text-tiendzi-bg transition-colors">Privacidad</a>
            <a href="#" className="hover:text-tiendzi-bg transition-colors">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
