import { useState } from 'react';
import { useMyShop } from '../../hooks/useShop';
import MI from '../MaterialIcon';
import HeroSection from './secciones/HeroSection';
import NavbarSection from './secciones/NavbarSection';
import EditingSite from './EditingSite';

// "Editar Sitio": hub visual que reemplaza a la vieja vista de Plantillas.
// Muestra una grilla de tarjetas, una por cada parte del sitio (Hero, Navbar,
// Productos, Footer, Ajustes). Al clickear una, se entra a editar SOLO esa parte.
//
// Migración incremental: la sección Hero ya tiene su editor propio y enfocado
// (HeroSection). Las demás, por ahora, abren el editor completo existente
// (EditingSite) para no perder funcionalidad mientras las vamos separando.

type SeccionId = 'hero' | 'navbar' | 'productos' | 'footer' | 'ajustes';

interface Tarjeta {
  id: SeccionId;
  titulo: string;
  desc: string;
  icon: string;
  color: string;
  migrada: boolean; // true = tiene su propio editor enfocado
}

const TARJETAS: Tarjeta[] = [
  { id: 'hero',      titulo: 'Portada (Hero)', desc: 'Diseño y contenido de la primera sección', icon: 'wallpaper',        color: '#6366f1', migrada: true },
  { id: 'navbar',    titulo: 'Menú (Navbar)',  desc: 'Estilo de la barra de navegación',          icon: 'menu',             color: '#0ea5e9', migrada: true },
  { id: 'productos', titulo: 'Productos',      desc: 'Cómo se ven las tarjetas de producto',      icon: 'grid_view',        color: '#f59e0b', migrada: false },
  { id: 'footer',    titulo: 'Pie de página',  desc: 'Información y enlaces del footer',           icon: 'call_to_action',   color: '#10b981', migrada: false },
  { id: 'ajustes',   titulo: 'Ajustes',        desc: 'Colores, secciones visibles y estado',      icon: 'tune',             color: '#64748b', migrada: false },
];

export default function EditorSitio() {
  const { data: tienda } = useMyShop();
  const [seccion, setSeccion] = useState<SeccionId | null>(null);

  // ── Vista de una sección ──
  if (seccion === 'hero') {
    return <HeroSection tienda={tienda} onBack={() => setSeccion(null)} />;
  }
  if (seccion === 'navbar') {
    return <NavbarSection tienda={tienda} onBack={() => setSeccion(null)} />;
  }
  if (seccion) {
    // Fallback temporal: el resto abre el editor completo existente.
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSeccion(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"
        >
          <MI name="arrow_back" className="!text-base" /> Volver a las secciones
        </button>
        <EditingSite tienda={tienda} />
      </div>
    );
  }

  // ── Hub: grilla de secciones ──
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Editar Sitio</h2>
        <p className="text-sm text-slate-500 mt-0.5">Elegí qué parte de tu tienda querés editar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {TARJETAS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSeccion(t.id)}
            className="group text-left rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-200 transition-all"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: t.color }}
              >
                <MI name={t.icon} className="!text-2xl" />
              </div>
              {!t.migrada && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 rounded-full px-2 py-0.5">
                  Editor general
                </span>
              )}
            </div>
            <p className="text-base font-bold text-slate-900 mt-3">{t.titulo}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold mt-3 text-slate-500 group-hover:text-slate-800 transition-colors">
              Editar <MI name="arrow_forward" className="!text-sm" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
