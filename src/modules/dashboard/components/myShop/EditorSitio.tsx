import { useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useUpdateShop } from '../../hooks/useShop';
import HeroSection from './secciones/HeroSection';
import NavbarSection from './secciones/NavbarSection';
import ProductosSection from './secciones/ProductosSection';
import FooterSection from './secciones/FooterSection';
import AjustesSection from './secciones/AjustesSection';
import CategoriasSection from './secciones/CategoriasSection';
import PopupSection from './secciones/PopupSection';
import BannerPromoSection from '../BannerPromoSection';

interface Props {
  tienda?: any;
}

type SeccionId = 'hero' | 'navbar' | 'categorias' | 'banner' | 'popup' | 'productos' | 'footer' | 'ajustes';

interface Tarjeta {
  id: SeccionId;
  label: string;
  desc: string;
  icon: React.ReactNode;
  migrada: boolean;
}

const IconHero = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9" />
  </svg>
);
const IconNavbar = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const IconProductos = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const IconFooter = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const IconCategorias = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
const IconBanner = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
  </svg>
);
const IconPopup = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);
const IconAjustes = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TARJETAS: Tarjeta[] = [
  { id: 'hero',      label: 'Hero',        desc: 'Sección de entrada: tipo, imágenes y texto principal.',   icon: <IconHero />,      migrada: true },
  { id: 'navbar',    label: 'Navegación',  desc: 'Diseño y comportamiento de la barra de menú.',            icon: <IconNavbar />,    migrada: true },
  { id: 'categorias', label: 'Categorías', desc: 'Tarjetas con imagen y link a secciones de tu catálogo.',  icon: <IconCategorias />, migrada: true },
  { id: 'banner',    label: 'Banner promo', desc: 'Anuncio entre destacados y productos (ofertas, avisos).', icon: <IconBanner />,    migrada: true },
  { id: 'popup',     label: 'Popups',      desc: 'Mensajes que aparecen al entrar: ofertas, newsletter.',   icon: <IconPopup />,     migrada: true },
  { id: 'productos', label: 'Productos',   desc: 'Grilla y tarjetas de productos.',                         icon: <IconProductos />, migrada: true },
  { id: 'footer',    label: 'Footer',      desc: 'Pie de página: redes, links y datos de contacto.',        icon: <IconFooter />,    migrada: true },
  { id: 'ajustes',   label: 'Ajustes',     desc: 'Logo, nombre, color, secciones visibles y estado.',       icon: <IconAjustes />,   migrada: true },
];

export default function EditorSitio({ tienda }: Props) {
  const [seccion, setSeccion] = useState<SeccionId | null>(null);
  const updateShop = useUpdateShop();

  const tiendaActiva = tienda?.activa ?? false;
  const toggleActiva = async () => {
    const activar = !tiendaActiva;
    const result = await Swal.fire({
      title: activar ? '¿Activar tu tienda?' : '¿Desactivar tu tienda?',
      text: activar
        ? 'Tu tienda quedará visible y tus clientes podrán encontrarla y comprar.'
        : 'Tu tienda dejará de ser visible para los clientes.',
      icon: activar ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: activar ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: activar ? '#10b981' : '#ef4444',
      cancelButtonColor: '#64748b',
    });
    if (!result.isConfirmed) return;
    await updateShop.mutateAsync({ activa: activar });
    toast.success(activar ? 'Tienda activada' : 'Tienda desactivada');
  };

  if (seccion === 'hero') {
    return (
      <HeroSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'navbar') {
    return (
      <NavbarSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'categorias') {
    return (
      <CategoriasSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'banner') {
    return (
      <BannerPromoSection
        accent={tienda?.temaConfig?.colorAcento ?? '#111827'}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'popup') {
    return <PopupSection onVolver={() => setSeccion(null)} />;
  }

  if (seccion === 'productos') {
    return (
      <ProductosSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'footer') {
    return (
      <FooterSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  if (seccion === 'ajustes') {
    return (
      <AjustesSection
        tienda={tienda}
        onVolver={() => setSeccion(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Editar Sitio</h1>
        <p className="text-sm text-slate-500 mt-0.5">Elegí una sección para personalizar tu tienda.</p>
      </div>

      {/* Estado de la tienda: lo primero que se ve, arriba de las secciones */}
      <button
        type="button"
        onClick={toggleActiva}
        disabled={updateShop.isPending}
        className={`w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 mb-6 transition-all border-2 ${
          tiendaActiva
            ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <div className="flex items-center gap-4 text-left">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tiendaActiva ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {tiendaActiva
                ? <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>
                : <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></>
              }
            </svg>
          </div>
          <div>
            <p className={`text-base font-black ${tiendaActiva ? 'text-emerald-800' : 'text-slate-600'}`}>
              {tiendaActiva ? 'Tienda activa y visible' : 'Tienda desactivada'}
            </p>
            <p className={`text-xs mt-0.5 ${tiendaActiva ? 'text-emerald-600' : 'text-slate-400'}`}>
              {tiendaActiva
                ? 'Tus clientes pueden encontrar y comprar en tu tienda'
                : 'Tu tienda no es visible para los clientes · Hacé clic para activarla'}
            </p>
          </div>
        </div>
        <div className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-300 ${tiendaActiva ? 'bg-emerald-500' : 'bg-slate-300'}`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${tiendaActiva ? 'left-8' : 'left-1'}`} />
        </div>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TARJETAS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSeccion(t.id)}
            className="group relative text-left bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 hover:border-gray-300 hover:shadow-md transition-all duration-150"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-150 flex-shrink-0">
                {t.icon}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{t.label}</p>
                  {t.migrada && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                      listo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{t.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
