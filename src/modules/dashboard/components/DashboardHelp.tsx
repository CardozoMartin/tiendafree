import { useState } from 'react';
import MI from './MaterialIcon';

interface DashboardHelpProps {
  activeSection: string;
  accent: string;
}

const HELP_DATA: Record<string, { title: string; desktop: string; mobile: string }> = {
  'home': { 
    title: 'Pantalla de Inicio', 
    desktop: 'https://vimeo.com/placeholder_desktop_home', 
    mobile: 'https://vimeo.com/placeholder_mobile_home' 
  },
  'products': { 
    title: 'Gestión de Productos', 
    desktop: 'https://vimeo.com/placeholder_desktop_products', 
    mobile: 'https://vimeo.com/placeholder_mobile_products' 
  },
  'orders': { 
    title: 'Gestión de Pedidos', 
    desktop: 'https://vimeo.com/placeholder_desktop_orders', 
    mobile: 'https://vimeo.com/placeholder_mobile_orders' 
  },
  'store-templates': { 
    title: 'Plantillas de Diseño', 
    desktop: 'https://vimeo.com/placeholder_desktop_templates', 
    mobile: 'https://vimeo.com/placeholder_mobile_templates' 
  },
  'store-methods': { 
    title: 'Pagos y Envíos', 
    desktop: 'https://vimeo.com/placeholder_desktop_methods', 
    mobile: 'https://vimeo.com/placeholder_mobile_methods' 
  },
  'store-edit': { 
    title: 'Editor de Página', 
    desktop: 'https://vimeo.com/placeholder_desktop_edit', 
    mobile: 'https://vimeo.com/placeholder_mobile_edit' 
  },
  'reviews': { 
    title: 'Reseñas de Clientes', 
    desktop: 'https://vimeo.com/placeholder_desktop_reviews', 
    mobile: 'https://vimeo.com/placeholder_mobile_reviews' 
  },
  'cm-ai': { 
    title: 'CM Virtual (IA)', 
    desktop: 'https://vimeo.com/placeholder_desktop_cmai', 
    mobile: 'https://vimeo.com/placeholder_mobile_cmai' 
  },
  'banner-creator': { 
    title: 'Creador de Banners', 
    desktop: 'https://vimeo.com/placeholder_desktop_banners', 
    mobile: 'https://vimeo.com/placeholder_mobile_banners' 
  },
};

const DashboardHelp = ({ activeSection, accent }: DashboardHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = HELP_DATA[activeSection] || { 
    title: 'Ayuda General', 
    desktop: 'https://vimeo.com/placeholder_desktop_general', 
    mobile: 'https://vimeo.com/placeholder_mobile_general' 
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all font-bold text-xs border border-slate-100 shadow-sm"
      >
        <MI name="help" className="!text-lg" />
        <span className="hidden sm:inline">Ayuda</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div 
                  className="size-10 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: accent }}
                >
                  <MI name="ondemand_video" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Video Tutorial</h3>
                  <p className="text-xs text-slate-400 font-medium">{data.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full border-none text-slate-400 cursor-pointer"
              >
                <MI name="close" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-500 leading-relaxed text-center">
                Elegí la versión según el dispositivo que quieras ver cómo se usa:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Desktop Video Button */}
                <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-center transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-white/20 transition-colors">
                    <MI name="desktop_windows" className="!text-4xl" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <MI name="play_arrow" className="!text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Versión Escritorio</h4>
                      <p className="text-[0.65rem] text-white/60 font-medium mt-0.5">Pantallas grandes</p>
                    </div>
                    <a 
                      href={data.desktop} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black no-underline"
                    >
                      Ver Video
                    </a>
                  </div>
                </div>

                {/* Mobile Video Button */}
                <div 
                  className="group relative overflow-hidden rounded-3xl p-6 text-center transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <div className="absolute top-0 right-0 p-4 text-slate-200 group-hover:text-slate-300 transition-colors">
                    <MI name="smartphone" className="!text-4xl" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div 
                      className="size-12 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <MI name="play_arrow" className="!text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Versión Móvil</h4>
                      <p className="text-[0.65rem] text-slate-400 font-medium mt-0.5">Pantallas de celular</p>
                    </div>
                    <a 
                      href={data.mobile} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl text-white text-xs font-black no-underline"
                      style={{ backgroundColor: accent }}
                    >
                      Ver Video
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[0.65rem] text-slate-400 text-center uppercase tracking-widest font-black">
                  ¿Necesitas más ayuda? Comunicate con soporte
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-zoom-in { animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  );
};

export default DashboardHelp;
