import { useState } from 'react';
import EditingSite from './EditingSite';
import HeroSection from './secciones/HeroSection';
import NavbarSection from './secciones/NavbarSection';
import ProductosSection from './secciones/ProductosSection';
import FooterSection from './secciones/FooterSection';

interface Props {
  tienda?: any;
}

type SeccionId = 'hero' | 'navbar' | 'productos' | 'footer' | 'ajustes';

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
const IconAjustes = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TARJETAS: Tarjeta[] = [
  { id: 'hero',      label: 'Hero',        desc: 'Sección de entrada: tipo, imágenes y texto principal.',   icon: <IconHero />,      migrada: true },
  { id: 'navbar',    label: 'Navegación',  desc: 'Diseño y comportamiento de la barra de menú.',            icon: <IconNavbar />,    migrada: true },
  { id: 'productos', label: 'Productos',   desc: 'Grilla y tarjetas de productos.',                         icon: <IconProductos />, migrada: true },
  { id: 'footer',    label: 'Footer',      desc: 'Pie de página: redes, links y datos de contacto.',        icon: <IconFooter />,    migrada: true },
  { id: 'ajustes',   label: 'Ajustes',     desc: 'Color, modo oscuro, slug, logo y secciones visibles.',    icon: <IconAjustes />,   migrada: false },
];

export default function EditorSitio({ tienda }: Props) {
  const [seccion, setSeccion] = useState<SeccionId | null>(null);

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

  if (seccion !== null) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSeccion(null)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver a secciones
          </button>
        </div>
        <EditingSite tienda={tienda} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Editar Sitio</h1>
        <p className="text-sm text-slate-500 mt-0.5">Elegí una sección para personalizar tu tienda.</p>
      </div>

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
