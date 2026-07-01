import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateShop, useUpdateShopVisual } from '../../../hooks/useShop';
import ImageHeroHandlers from '../../ImageEditors/ImageHeroHandlers';
import HeroEditor from '../../ImageEditors/HeroEditor';
import HeroPreviewModal from './HeroPreviewModal';

type TipoHero = 'HERO_FIJO' | 'CARRUSEL' | 'GALERIA';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

const IconHeroFijo = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9" />
  </svg>
);
const IconCarrusel = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);
const IconGaleria = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
  </svg>
);

const TIPOS: { value: TipoHero; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'HERO_FIJO', label: 'Hero clásico', desc: 'Texto + imagen a la derecha',                  icon: <IconHeroFijo /> },
  { value: 'CARRUSEL',  label: 'Carrusel',      desc: 'Slides a pantalla completa con texto',         icon: <IconCarrusel /> },
  { value: 'GALERIA',   label: 'Galería',        desc: 'Imágenes que se expanden al pasar el cursor', icon: <IconGaleria /> },
];

export default function HeroSection({ tienda, onVolver }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  const { register, watch, setValue, handleSubmit } = useForm<{
    tipoSeccionHero: TipoHero;
    heroTitulo: string;
    heroSubtitulo: string;
    heroCtaTexto: string;
  }>({
    defaultValues: {
      tipoSeccionHero: tienda?.temaConfig?.tipoSeccionHero ?? 'HERO_FIJO',
      heroTitulo:      tienda?.temaConfig?.heroTitulo      ?? tienda?.titulo      ?? '',
      heroSubtitulo:   tienda?.temaConfig?.heroSubtitulo   ?? tienda?.descripcion ?? '',
      heroCtaTexto:    tienda?.temaConfig?.heroCtaTexto    ?? 'Comprar ahora',
    },
  });

  const tipo = watch('tipoSeccionHero');
  const updateShop = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();
  const isSaving = updateShop.isPending || updateShopVisual.isPending;

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
          <h1 className="text-lg font-black text-slate-900">Hero</h1>
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
        {/* Selector de tipo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-800">Diseño del hero</p>
              <p className="text-xs text-gray-400 mt-0.5">Elegí cómo se ve la sección de entrada de tu tienda</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Ver previews
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TIPOS.map((opt) => {
              const activo = tipo === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('tipoSeccionHero', opt.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    activo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    activo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {opt.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textos generales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] divide-y divide-gray-50">
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
            <input
              {...register('heroTitulo')}
              type="text"
              placeholder="El título principal de tu tienda"
              className="w-full text-sm text-gray-900 outline-none bg-transparent border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors placeholder:text-gray-300"
            />
          </div>
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo</label>
            <input
              {...register('heroSubtitulo')}
              type="text"
              placeholder="Una frase que describe tu tienda"
              className="w-full text-sm text-gray-900 outline-none bg-transparent border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors placeholder:text-gray-300"
            />
          </div>
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Texto del botón CTA</label>
            <input
              {...register('heroCtaTexto')}
              type="text"
              placeholder="Comprar ahora"
              className="w-full text-sm text-gray-900 outline-none bg-transparent border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Editor de contenido según tipo */}
        <div>
          {tipo === 'HERO_FIJO' ? (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Imagen del hero</p>
              <HeroEditor temaConfig={tienda?.temaConfig} />
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                {tipo === 'GALERIA' ? 'Imágenes de la galería' : 'Slides del carrusel'}
              </p>
              <ImageHeroHandlers temaConfig={tienda?.temaConfig} />
            </>
          )}
        </div>
      </div>

      {showPreview && (
        <HeroPreviewModal
          tipoActual={tipo}
          onClose={() => setShowPreview(false)}
          onSelect={(t) => { setValue('tipoSeccionHero', t); setShowPreview(false); }}
        />
      )}
    </div>
  );
}
