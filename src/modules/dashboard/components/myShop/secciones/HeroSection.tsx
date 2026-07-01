import { useEffect, useState } from 'react';
import { useUpdateShop, useUpdateShopVisual } from '../../../hooks/useShop';
import HeroEditor from '../../ImageEditors/HeroEditor';
import ImageHeroHandlers from '../../ImageEditors/ImageHeroHandlers';
import HeroPreviewModal from './HeroPreviewModal';
import MI from '../../MaterialIcon';

// Editor autocontenido de la sección HERO / Portada.
// Reúne todo lo del hero en un solo lugar: elegir el tipo, sus textos, y el
// contenido según el tipo (imagen circular del hero clásico, o slides que
// comparten carrusel y galería). Es una de las "partes del sitio" del EditorSitio.

interface Props {
  tienda?: any;
  onBack: () => void;
}

const TIPOS = [
  { value: 'HERO_FIJO', label: 'Hero clásico',       desc: 'Texto + imagen circular a la derecha',        icon: '🖼️' },
  { value: 'CARRUSEL',  label: 'Carrusel full',      desc: 'Slides a pantalla completa con texto encima', icon: '🎞️' },
  { value: 'GALERIA',   label: 'Galería expandible', desc: 'Fila de imágenes que crecen al pasar el mouse', icon: '🖇️' },
] as const;

export default function HeroSection({ tienda, onBack }: Props) {
  const updateShop = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();

  const [tipo, setTipo] = useState<string>(tienda?.temaConfig?.tipoSeccionHero || 'HERO_FIJO');
  // Tipo cuyo preview se está mostrando en el modal (null = cerrado).
  const [previewTipo, setPreviewTipo] = useState<'HERO_FIJO' | 'CARRUSEL' | 'GALERIA' | null>(null);
  const [titulo, setTitulo] = useState(tienda?.titulo ?? '');
  const [subtitulo, setSubtitulo] = useState(tienda?.descripcion ?? '');
  const [ctaTexto, setCtaTexto] = useState(tienda?.temaConfig?.heroCtaTexto || 'Comprar ahora');

  useEffect(() => {
    setTipo(tienda?.temaConfig?.tipoSeccionHero || 'HERO_FIJO');
    setTitulo(tienda?.titulo ?? '');
    setSubtitulo(tienda?.descripcion ?? '');
    setCtaTexto(tienda?.temaConfig?.heroCtaTexto || 'Comprar ahora');
  }, [tienda]);

  const isSaving = updateShop.isPending || updateShopVisual.isPending;

  const handleSave = async () => {
    await updateShop.mutateAsync({ titulo, descripcion: subtitulo });
    await updateShopVisual.mutateAsync({
      tipoSeccionHero: tipo,
      heroCtaTexto: ctaTexto,
      heroTitulo: titulo,
      heroSubtitulo: subtitulo,
    });
  };

  const usaSlides = tipo === 'CARRUSEL' || tipo === 'GALERIA';

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
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition shadow-sm"
        >
          {isSaving ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
          ) : 'Guardar cambios'}
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Portada (Hero)</h1>
        <p className="text-sm text-slate-500 mt-0.5">La primera sección que ven tus clientes al entrar.</p>
      </div>

      {/* Selector de tipo */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Diseño de la portada</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIPOS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setTipo(opt.value)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                tipo === opt.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              {/* Botón Preview: abre el modal sin cambiar la selección */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewTipo(opt.value); }}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                <MI name="visibility" className="!text-sm" />
                Ver preview
              </button>
              {tipo === opt.value && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <MI name="check" className="!text-sm text-white" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Textos de la portada */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Textos</p>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Bienvenido a Mi Tienda"
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Subtítulo</label>
          <textarea
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            rows={2}
            placeholder="Una frase que describa tu tienda…"
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Texto del botón</label>
          <input
            value={ctaTexto}
            onChange={(e) => setCtaTexto(e.target.value)}
            placeholder="Comprar ahora"
            className="w-full sm:w-52 text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Contenido según el tipo */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
          {tipo === 'HERO_FIJO' ? 'Imagen de la portada' : tipo === 'GALERIA' ? 'Imágenes de la galería' : 'Slides del carrusel'}
        </p>
        <p className="text-xs text-gray-400 mb-3">
          {tipo === 'HERO_FIJO'
            ? 'La imagen circular que acompaña el texto.'
            : tipo === 'GALERIA'
            ? 'Se muestran en una fila que se expande al pasar el mouse. Se comparten con el carrusel.'
            : 'Slides a pantalla completa. Subí fotos, editá textos y reordenalos.'}
        </p>
        {tipo === 'HERO_FIJO'
          ? <HeroEditor temaConfig={tienda?.temaConfig} />
          : <ImageHeroHandlers temaConfig={tienda?.temaConfig} />}
      </div>

      {/* Modal de preview del tipo seleccionado */}
      {previewTipo && <HeroPreviewModal tipo={previewTipo} onClose={() => setPreviewTipo(null)} />}
    </div>
  );
}
