import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Menu, Pill, ShoppingBag, Shirt, type LucideIcon } from 'lucide-react';
import { useUpdateShopVisual } from '../../../hooks/useShop';
import NavbarPreviewModal from './NavbarPreviewModal';
import NavbarDisenoPreviewModal from './NavbarDisenoPreviewModal';

type NavbarVariante  = 'CLASICO' | 'PILL' | 'BOUTIQUE' | 'BRASILIA';
type NavbarStyle     = 'STICKY' | 'TRANSPARENT' | 'FLOATING';
type NavbarColorTema = 'CLARO' | 'OSCURO';
type BotonForma      = 'REDONDEADO' | 'CUADRADO';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

const DISENOS: { value: NavbarVariante; label: string; desc: string; icon: LucideIcon }[] = [
  { value: 'CLASICO', label: 'Clásico', desc: 'Logo · links planos · buscador · carrito · login', icon: Menu },
  { value: 'PILL',    label: 'Pill',    desc: 'Links en píldora central, botón gradiente',         icon: Pill },
  { value: 'BOUTIQUE', label: 'Boutique', desc: 'Nombre centrado en serif · categorías abajo · estilo indumentaria', icon: ShoppingBag },
  { value: 'BRASILIA', label: 'Brasília', desc: 'Utility bars · logo serif · buscador inline · categorías abajo', icon: Shirt },
];

const COMPORTAMIENTOS: { value: NavbarStyle; label: string; desc: string }[] = [
  { value: 'STICKY',      label: 'Fija',         desc: 'Siempre visible en la parte superior' },
  { value: 'TRANSPARENT', label: 'Transparente', desc: 'Transparente al inicio, se vuelve sólida al bajar' },
  { value: 'FLOATING',    label: 'Flotante',      desc: 'Despegada con bordes redondeados y blur' },
];

export default function NavbarSection({ tienda, onVolver }: Props) {
  const [showDisenoPreview, setShowDisenoPreview] = useState(false);
  const [showComportPreview, setShowComportPreview] = useState(false);

  const { register, watch, setValue, handleSubmit } = useForm<{
    navbarVariante:  NavbarVariante;
    navbarStyle:     NavbarStyle;
    navbarColorTema: NavbarColorTema;
    botonForma:      BotonForma;
  }>({
    defaultValues: {
      navbarVariante:  tienda?.temaConfig?.navbarVariante  ?? 'CLASICO',
      navbarStyle:     tienda?.temaConfig?.navbarStyle     ?? 'STICKY',
      navbarColorTema: tienda?.temaConfig?.navbarColorTema ?? 'OSCURO',
      botonForma:      tienda?.temaConfig?.botonForma      ?? 'REDONDEADO',
    },
  });

  const variante   = watch('navbarVariante');
  const style      = watch('navbarStyle');
  const colorTema  = watch('navbarColorTema');
  const botonForma = watch('botonForma');

  const updateShopVisual = useUpdateShopVisual();
  const isSaving = updateShopVisual.isPending;

  const handleSave = async (data: any) => {
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
          <h1 className="text-lg font-black text-slate-900">Navegación</h1>
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

        {/* Diseño */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Diseño de la barra</p>
              <p className="text-xs text-gray-400 mt-0.5">Cómo se ve el layout del menú</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDisenoPreview(true)}
              className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Ver previews
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DISENOS.map((d) => {
              const Icon = d.icon;
              const activo = variante === d.value;
              return (
              <button
                key={d.value}
                type="button"
                onClick={() => setValue('navbarVariante', d.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  activo
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  activo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <p className="text-sm font-semibold text-gray-800 mt-2">{d.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
              </button>
              );
            })}
          </div>
        </div>

        {/* Color de la barra */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="mb-3">
            <p className="text-sm font-bold text-gray-800">Color de la barra</p>
            <p className="text-xs text-gray-400 mt-0.5">Fondo claro con letras oscuras, o fondo oscuro con letras claras</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'CLARO'  as const, label: 'Blanco', desc: 'Fondo blanco · letras negras', bg: '#ffffff', fg: '#000000', borde: '#e5e7eb' },
              { value: 'OSCURO' as const, label: 'Negro',  desc: 'Fondo negro · letras blancas', bg: '#000000', fg: '#ffffff', borde: '#000000' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('navbarColorTema', opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  colorTema === opt.value ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Mini preview del navbar */}
                <div
                  className="w-full h-8 rounded-md flex items-center px-2 gap-1 mb-2"
                  style={{ background: opt.bg, border: `1px solid ${opt.borde}` }}
                >
                  <span className="text-[10px] font-extrabold uppercase" style={{ color: opt.fg }}>Aa</span>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: opt.fg, opacity: 0.5 }} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: opt.fg, opacity: 0.5 }} />
                </div>
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Forma de los botones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="mb-3">
            <p className="text-sm font-bold text-gray-800">Forma de los botones</p>
            <p className="text-xs text-gray-400 mt-0.5">Aplica a los botones de acción de toda la tienda (login, agregar al carrito, comprar…)</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'REDONDEADO' as const, label: 'Redondeados', desc: 'Bordes tipo píldora', radius: '9999px' },
              { value: 'CUADRADO'   as const, label: 'Cuadrados',   desc: 'Esquinas rectas con leve radio', radius: '6px' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('botonForma', opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  botonForma === opt.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Mini preview del botón */}
                <div className="flex items-center justify-center h-9 mb-2">
                  <span
                    className="px-4 py-1.5 text-[11px] font-bold text-white"
                    style={{ background: '#111827', borderRadius: opt.radius }}
                  >
                    Comprar
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Comportamiento */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Comportamiento</p>
              <p className="text-xs text-gray-400 mt-0.5">Cómo se comporta la barra al hacer scroll</p>
            </div>
            <button
              type="button"
              onClick={() => setShowComportPreview(true)}
              className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Ver previews
            </button>
          </div>
          <div className="space-y-2">
            {COMPORTAMIENTOS.map((c) => (
              <label
                key={c.value}
                className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  style === c.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={c.value}
                  {...register('navbarStyle')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  style === c.value ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {style === c.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {style === 'TRANSPARENT' && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              El modo transparente funciona mejor cuando el hero está visible al cargar la página.
            </p>
          )}
        </div>

      </div>

      {showDisenoPreview && (
        <NavbarDisenoPreviewModal
          varianteActual={variante}
          onClose={() => setShowDisenoPreview(false)}
          onSelect={(v) => { setValue('navbarVariante', v); setShowDisenoPreview(false); }}
        />
      )}

      {showComportPreview && (
        <NavbarPreviewModal
          styleActual={style}
          onClose={() => setShowComportPreview(false)}
          onSelect={(s) => { setValue('navbarStyle', s); setShowComportPreview(false); }}
        />
      )}
    </div>
  );
}
