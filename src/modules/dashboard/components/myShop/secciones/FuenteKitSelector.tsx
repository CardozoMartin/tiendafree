import { useEffect } from 'react';

export type FuenteKitId = 'MODERNO' | 'EDITORIAL' | 'IMPACTO' | 'MINIMAL';

interface Kit {
  id: FuenteKitId;
  label: string;
  desc: string;
  display: string;
  body: string;
  googleHref: string;
}

// Debe coincidir con shop-v3/src/config/fuenteKits.ts
export const KITS: Kit[] = [
  {
    id: 'MODERNO',
    label: 'Moderno',
    desc: 'Limpio y versátil.',
    display: "'Plus Jakarta Sans', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
    googleHref: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap',
  },
  {
    id: 'EDITORIAL',
    label: 'Editorial',
    desc: 'Serif elegante + texto cálido.',
    display: "'Playfair Display', serif",
    body: "'Nunito', sans-serif",
    googleHref: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Nunito:wght@400;600&display=swap',
  },
  {
    id: 'IMPACTO',
    label: 'Impacto',
    desc: 'Titulares grandes, estilo urbano.',
    display: "'Bebas Neue', sans-serif",
    body: "'DM Sans', sans-serif",
    googleHref: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600&display=swap',
  },
  {
    id: 'MINIMAL',
    label: 'Minimal',
    desc: 'Serif de exhibición + texto sobrio.',
    display: "'DM Serif Display', serif",
    body: "'Inter', sans-serif",
    googleHref: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600&display=swap',
  },
];

interface Props {
  value: FuenteKitId;
  onChange: (id: FuenteKitId) => void;
}

// Selector de kit tipográfico con preview real de cada pareja de fuentes.
export default function FuenteKitSelector({ value, onChange }: Props) {
  // Carga las fuentes de todos los kits (solo para el preview del panel).
  useEffect(() => {
    KITS.forEach((k) => {
      const id = `fuentekit-preview-${k.id}`;
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = k.googleHref;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {KITS.map((k) => {
        const activo = value === k.id;
        return (
          <button
            key={k.id}
            type="button"
            onClick={() => onChange(k.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              activo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-800">{k.label}</span>
              {activo && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                  activo
                </span>
              )}
            </div>
            {/* Preview real */}
            <p className="text-2xl leading-tight text-gray-900" style={{ fontFamily: k.display }}>
              Mi Tienda
            </p>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: k.body }}>
              Remera oversize de algodón — $12.900
            </p>
            <p className="text-[11px] text-gray-400 mt-2">{k.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
