import { useForm } from 'react-hook-form';
import { useUpdateShopVisual } from '../../../hooks/useShop';

type FooterVariante = 'CENTRADO' | 'COLUMNAS';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

const VARIANTES: { value: FooterVariante; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'CENTRADO',
    label: 'Centrado',
    desc: 'Logo, links y redes apilados y centrados.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3m0 0h-4m4 0h4M7.5 12h9M9 15.75h6" />
      </svg>
    ),
  },
  {
    value: 'COLUMNAS',
    label: 'Columnas',
    desc: 'Marca a la izquierda, navegación y redes en columnas.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h4.5v13.5h-4.5zM9.75 5.25h4.5M9.75 9h4.5M15.75 5.25h4.5M15.75 9h4.5" />
      </svg>
    ),
  },
];

// ── Mini-previews fieles del footer ──────────────────────────────────────────

const REDES = [
  { color: '#25d366' },
  { color: '#e1306c' },
  { color: '#1877f2' },
];

const MiniFooterCentrado = ({ acento }: { acento: string }) => (
  <div className="rounded-lg overflow-hidden border border-gray-100" style={{ background: 'linear-gradient(to bottom, #f1eaff, #ffffff)' }}>
    <div className="px-4 py-6 flex flex-col items-center gap-2.5">
      <span className="text-base font-semibold text-slate-800">Mi Tienda</span>
      <p className="text-[10px] text-slate-400 text-center max-w-[220px] leading-snug">
        Una breve descripción de la tienda que aparece debajo del nombre.
      </p>
      <div className="flex gap-4 mt-1">
        {['Inicio', 'Productos', 'Nosotros'].map((l) => (
          <span key={l} className="text-[10px] text-slate-600">{l}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        {REDES.map((r, i) => (
          <span key={i} className="w-5 h-5 rounded-full" style={{ background: r.color }} />
        ))}
      </div>
    </div>
    <div className="border-t border-slate-200 px-4 py-2 flex items-center justify-between">
      <span className="text-[9px] text-slate-400">Mi Tienda © {new Date().getFullYear()}</span>
      <span className="text-[9px]" style={{ color: acento }}>Hecho con amor ✦</span>
    </div>
  </div>
);

const MiniFooterColumnas = ({ acento }: { acento: string }) => (
  <div className="rounded-lg overflow-hidden border border-gray-100" style={{ background: 'linear-gradient(to bottom, #f1eaff, #ffffff)' }}>
    <div className="px-4 py-6 grid grid-cols-3 gap-3">
      {/* Marca */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-slate-800">Mi Tienda</span>
        <p className="text-[9px] text-slate-400 leading-snug">Breve descripción de la tienda.</p>
      </div>
      {/* Navegación */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">Navegación</span>
        {['Inicio', 'Productos', 'Nosotros'].map((l) => (
          <span key={l} className="text-[10px] text-slate-500">{l}</span>
        ))}
      </div>
      {/* Redes */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">Seguinos</span>
        <div className="flex gap-1.5">
          {REDES.map((r, i) => (
            <span key={i} className="w-5 h-5 rounded-full" style={{ background: r.color }} />
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-slate-200 px-4 py-2 flex items-center justify-between">
      <span className="text-[9px] text-slate-400">Mi Tienda © {new Date().getFullYear()}</span>
      <span className="text-[9px]" style={{ color: acento }}>Hecho con amor ✦</span>
    </div>
  </div>
);

export default function FooterSection({ tienda, onVolver }: Props) {
  const { watch, setValue, handleSubmit } = useForm<{ footerVariante: FooterVariante }>({
    defaultValues: {
      footerVariante: tienda?.temaConfig?.footerVariante ?? 'CENTRADO',
    },
  });

  const variante = watch('footerVariante');
  const acento = tienda?.temaConfig?.colorAcento ?? '#111827';

  const updateShopVisual = useUpdateShopVisual();
  const isSaving = updateShopVisual.isPending;

  const handleSave = async (data: { footerVariante: FooterVariante }) => {
    await updateShopVisual.mutateAsync(data);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Secciones
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-slate-900">Footer</h1>
        </div>
        <button
          onClick={handleSubmit(handleSave)}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando…
            </>
          ) : 'Guardar'}
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {/* Selector de variante */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Diseño del footer</p>
          <p className="text-xs text-gray-400 mb-4">Elegí cómo se organiza el pie de página de tu tienda.</p>
          <div className="grid grid-cols-2 gap-2">
            {VARIANTES.map((v) => {
              const activo = variante === v.value;
              return (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setValue('footerVariante', v.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    activo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    activo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {v.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{v.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{v.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview fiel de la variante elegida */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Vista previa</p>
          <p className="text-xs text-gray-400 mb-5">Así se verá el footer en tu tienda.</p>
          {variante === 'COLUMNAS'
            ? <MiniFooterColumnas acento={acento} />
            : <MiniFooterCentrado acento={acento} />}
        </div>

        <p className="text-xs text-gray-400 text-center">
          Los links, redes y datos del footer se toman automáticamente de la información de tu tienda.
        </p>
      </div>
    </div>
  );
}
