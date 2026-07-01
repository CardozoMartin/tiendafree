import { useEffect, useState } from 'react';
import { useUpdateShopVisual } from '../../../hooks/useShop';
import NavbarPreviewModal from './NavbarPreviewModal';
import NavbarDisenoPreviewModal from './NavbarDisenoPreviewModal';
import MI from '../../MaterialIcon';

// Editor autocontenido de la sección NAVBAR (barra de navegación).
// El dueño elige el estilo de la barra; shop-v3 lo aplica según navbarStyle.

interface Props {
  tienda?: any;
  onBack: () => void;
}

type NavStyle = 'STICKY' | 'TRANSPARENT' | 'FLOATING';
type NavVariante = 'CLASICO' | 'PILL';

const ESTILOS: { value: NavStyle; label: string; desc: string; icon: string }[] = [
  { value: 'STICKY',      label: 'Fija',         desc: 'Barra blanca fija arriba con borde inferior',   icon: '📌' },
  { value: 'TRANSPARENT', label: 'Transparente', desc: 'Transparente sobre la portada; sólida al bajar', icon: '🫧' },
  { value: 'FLOATING',    label: 'Flotante',     desc: 'Barra despegada de los bordes, redondeada',      icon: '🎈' },
];

const DISENOS: { value: NavVariante; label: string; desc: string; icon: string }[] = [
  { value: 'CLASICO', label: 'Clásico', desc: 'Logo, links planos, buscador, carrito y login', icon: '🧭' },
  { value: 'PILL',    label: 'Pill',    desc: 'Links en píldora central y botón con degradado', icon: '💊' },
];

export default function NavbarSection({ tienda, onBack }: Props) {
  const updateShopVisual = useUpdateShopVisual();
  const [estilo, setEstilo] = useState<NavStyle>(tienda?.temaConfig?.navbarStyle || 'STICKY');
  const [diseno, setDiseno] = useState<NavVariante>(tienda?.temaConfig?.navbarVariante || 'CLASICO');
  const [previewEstilo, setPreviewEstilo] = useState<NavStyle | null>(null);
  const [previewDiseno, setPreviewDiseno] = useState<NavVariante | null>(null);

  useEffect(() => {
    setEstilo(tienda?.temaConfig?.navbarStyle || 'STICKY');
    setDiseno(tienda?.temaConfig?.navbarVariante || 'CLASICO');
  }, [tienda]);

  const handleSave = async () => {
    await updateShopVisual.mutateAsync({ navbarStyle: estilo, navbarVariante: diseno });
  };

  return (
    <div className="space-y-6">
      {/* Header con volver + guardar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <button
          onClick={handleSave}
          disabled={updateShopVisual.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition shadow-sm"
        >
          {updateShopVisual.isPending ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
          ) : 'Guardar cambios'}
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Menú (Navbar)</h1>
        <p className="text-sm text-slate-500 mt-0.5">La barra de navegación superior de tu tienda.</p>
      </div>

      {/* Selector de DISEÑO */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Diseño de la barra</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DISENOS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setDiseno(opt.value)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                diseno === opt.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewDiseno(opt.value); }}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                <MI name="visibility" className="!text-sm" />
                Ver preview
              </button>
              {diseno === opt.value && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <MI name="check" className="!text-sm text-white" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selector de COMPORTAMIENTO */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Comportamiento</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ESTILOS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setEstilo(opt.value)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                estilo === opt.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewEstilo(opt.value); }}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                <MI name="visibility" className="!text-sm" />
                Ver preview
              </button>
              {estilo === opt.value && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <MI name="check" className="!text-sm text-white" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {previewEstilo && <NavbarPreviewModal estilo={previewEstilo} onClose={() => setPreviewEstilo(null)} />}
      {previewDiseno && <NavbarDisenoPreviewModal diseno={previewDiseno} onClose={() => setPreviewDiseno(null)} />}
    </div>
  );
}
