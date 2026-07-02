import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useUpdateShop,
  useUpdateShopVisual,
  useUploadLogo,
  useDeleteLogo,
  useCambiarSlug,
  useVerificarSlug,
} from '../../../hooks/useShop';
import { comprimirImagen } from '../../../utils/comprimirImagen';
import AboutUsEditor from '../AboutUsEditor';
import MarqueeEditor from '../MarqueeEditor';
import FuenteKitSelector, { type FuenteKitId } from './FuenteKitSelector';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

const SLUG_REGEX = /^[a-z0-9]+(?:[-][a-z0-9]+)*$/;

// ── Helpers de UI (mismo lenguaje visual que las otras secciones) ─────────────

const SectionTitle = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="mb-3">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</h3>
    {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
    {children}
  </div>
);

const Row = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-4 px-6 py-4 ${className}`}>{children}</div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function AjustesSection({ tienda, onVolver }: Props) {
  // Mutations
  const updateShop       = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();
  const uploadLogo       = useUploadLogo();
  const deleteLogo       = useDeleteLogo();
  const cambiarSlug      = useCambiarSlug();

  // Logo
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(tienda?.logoUrl ?? null);

  // Slug
  const [slugInput, setSlugInput]         = useState(tienda?.slug ?? '');
  const [slugEditing, setSlugEditing]     = useState(false);
  const [slugDebounced, setSlugDebounced] = useState('');
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: slugCheck } = useVerificarSlug(
    slugDebounced,
    slugEditing && slugDebounced.length >= 3 && slugDebounced !== tienda?.slug
  );

  // Nombre + descripción
  const [titulo, setTitulo]           = useState(tienda?.titulo ?? '');
  const [descripcion, setDescripcion] = useState(tienda?.descripcion ?? '');

  // Tema (color acento, modo oscuro, secciones visibles)
  const { watch, setValue, reset } = useForm({
    defaultValues: {
      colorAcento: tienda?.temaConfig?.colorAcento || '#3B82F6',
      modoOscuro:  tienda?.temaConfig?.modoOscuro ?? true,
      fuenteKit:   tienda?.temaConfig?.fuenteKit || 'MODERNO',
      seccionesVisibles: tienda?.temaConfig?.seccionesVisibles || {
        hero: true, footer: true, navbar: true, galeria: true, productos: true, contacto: true,
      },
    },
  });
  const temaData: any = watch();

  useEffect(() => {
    setLogoPreview(tienda?.logoUrl ?? null);
    setSlugInput(tienda?.slug ?? '');
    setTitulo(tienda?.titulo ?? '');
    setDescripcion(tienda?.descripcion ?? '');
    if (tienda?.temaConfig) {
      reset({
        colorAcento: tienda.temaConfig.colorAcento || '#3B82F6',
        modoOscuro:  tienda.temaConfig.modoOscuro ?? true,
        fuenteKit:   tienda.temaConfig.fuenteKit || 'MODERNO',
        seccionesVisibles: tienda.temaConfig.seccionesVisibles || {
          hero: true, footer: true, navbar: true, galeria: true, productos: true, contacto: true,
        },
      });
    }
  }, [tienda, reset]);

  const handleSlugChange = (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
    setSlugInput(clean);
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(() => setSlugDebounced(clean), 600);
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const comprimido = await comprimirImagen(file, { maxAncho: 600, maxAlto: 600 });
    await uploadLogo.mutateAsync(comprimido);
  };

  const handleLogoDelete = async () => {
    setLogoPreview(null);
    await deleteLogo.mutateAsync();
  };

  const handleSlugSave = async () => {
    if (!slugInput || slugInput === tienda?.slug) { setSlugEditing(false); return; }
    await cambiarSlug.mutateAsync(slugInput);
    setSlugEditing(false);
  };

  const handleSave = async () => {
    await updateShop.mutateAsync({ titulo, descripcion });
    await updateShopVisual.mutateAsync({
      colorAcento: temaData.colorAcento,
      modoOscuro: temaData.modoOscuro,
      fuenteKit: temaData.fuenteKit,
      seccionesVisibles: temaData.seccionesVisibles,
    });
  };

  const isSaving = updateShop.isPending || updateShopVisual.isPending;

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
          <h1 className="text-lg font-black text-slate-900">Ajustes</h1>
        </div>
        <button
          onClick={handleSave}
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

      <div className="space-y-8 pb-20">
        {/* ── Identidad ── */}
        <div>
          <SectionTitle title="Identidad" desc="Logo, nombre, URL y descripción de tu tienda." />
          <Card>
            {/* Logo */}
            <div className="flex items-center gap-5 px-6 py-5">
              <div
                className="relative w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden cursor-pointer group flex-shrink-0 hover:border-gray-400 transition-colors"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                  </>
                ) : uploadLogo.isPending ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9m0 0l-2.25-2.25M12 12l2.25-2.25" />
                  </svg>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">Logo de la tienda</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG o SVG · Máx 5 MB</p>
                <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-gray-400 leading-snug">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-px text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span>
                    Este logo también se usa como <strong className="text-gray-500">ícono de la pestaña (favicon)</strong>.
                    Para que se vea nítido, subí una imagen <strong className="text-gray-500">cuadrada</strong> (ej. 512×512 px),
                    en PNG con fondo transparente y con el diseño centrado.
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLogo.isPending}
                    className="text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {logoPreview ? 'Cambiar' : 'Subir logo'}
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleLogoDelete}
                      disabled={deleteLogo.isPending}
                      className="text-xs font-semibold text-red-500 border border-red-100 rounded-lg px-3 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="px-6 py-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la tienda</label>
              <input
                type="text"
                className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors"
                placeholder="Ej. Mi Tienda"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="px-6 py-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">URL de tu tienda</label>
              {slugEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 whitespace-nowrap">apptiendizi.netlify.app/</span>
                    <input
                      type="text"
                      value={slugInput}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="flex-1 text-sm text-gray-900 outline-none border-b border-gray-300 focus:border-gray-800 pb-0.5 transition-colors bg-transparent"
                      placeholder="mi-tienda"
                      autoFocus
                    />
                  </div>
                  {slugDebounced.length >= 3 && slugDebounced !== tienda?.slug && (
                    <p className={`text-xs font-medium ${slugCheck?.disponible ? 'text-emerald-600' : 'text-red-500'}`}>
                      {slugCheck === undefined ? '…verificando' : slugCheck.disponible ? '✓ Disponible' : '✗ Ya está en uso'}
                    </p>
                  )}
                  {slugInput && !SLUG_REGEX.test(slugInput) && (
                    <p className="text-xs text-amber-500">Solo letras minúsculas, números y guiones</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSlugSave}
                      disabled={cambiarSlug.isPending || !slugInput || !SLUG_REGEX.test(slugInput) || (slugCheck !== undefined && !slugCheck.disponible && slugInput !== tienda?.slug)}
                      className="text-xs font-bold bg-gray-900 text-white rounded-lg px-4 py-1.5 hover:bg-gray-700 transition-colors disabled:opacity-40"
                    >
                      {cambiarSlug.isPending ? 'Guardando…' : 'Confirmar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSlugInput(tienda?.slug ?? ''); setSlugEditing(false); }}
                      className="text-xs font-medium text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-700 font-mono flex-1 truncate">
                    apptiendizi.netlify.app/<span className="font-bold text-gray-900">{tienda?.slug}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSlugEditing(true)}
                    className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition-colors flex-shrink-0"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="px-6 py-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo / descripción</label>
              <textarea
                rows={2}
                className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors resize-none"
                placeholder="Una frase que describa tu tienda…"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* ── Apariencia general ── */}
        <div>
          <SectionTitle title="Apariencia" desc="Color y fondo general del sitio." />
          <Card>
            {/* Color acento */}
            <Row>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Color de acento</p>
                <p className="text-xs text-gray-400 mt-0.5">Botones y elementos destacados</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-black/10 cursor-pointer"
                  style={{ backgroundColor: temaData.colorAcento }}
                />
                <input type="color" className="sr-only" id="accent-color" value={temaData.colorAcento} onChange={(e: any) => setValue('colorAcento', e.target.value)} />
                <label htmlFor="accent-color" className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">
                  {temaData.colorAcento?.toUpperCase()}
                </label>
              </div>
            </Row>

            {/* Modo oscuro */}
            <Row>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Modo oscuro</p>
                <p className="text-xs text-gray-400 mt-0.5">Fondo oscuro en tu sitio</p>
              </div>
              <Toggle
                checked={temaData.modoOscuro}
                onChange={(v) => setValue('modoOscuro', v)}
              />
            </Row>
          </Card>
        </div>

        {/* ── Tipografía ── */}
        <div>
          <SectionTitle title="Tipografía" desc="Elegí un estilo de letra para tu tienda. Cada kit combina una fuente para títulos y otra para el texto." />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
            <FuenteKitSelector
              value={(temaData.fuenteKit ?? 'MODERNO') as FuenteKitId}
              onChange={(id) => setValue('fuenteKit', id)}
            />
          </div>
        </div>

        {/* ── Visibilidad de secciones ── */}
        <div>
          <SectionTitle title="Visibilidad de secciones" desc="Activá o desactivá secciones de tu sitio." />
          <Card>
            {([
              { key: 'hero',      label: 'Hero',        desc: 'Banner de entrada con imagen y título' },
              { key: 'navbar',    label: 'Navegación',  desc: 'Menú superior y logo' },
              { key: 'productos', label: 'Productos',   desc: 'Grilla de productos a la venta' },
              { key: 'galeria',   label: 'Galería',     desc: 'Muestra tus imágenes' },
              { key: 'contacto',  label: 'Contacto',    desc: 'Formulario o info de contacto' },
              { key: 'footer',    label: 'Footer',      desc: 'Pie de página' },
            ] as const).map(({ key, label, desc }) => (
              <Row key={key}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle
                  checked={temaData.seccionesVisibles?.[key] ?? true}
                  onChange={(v) => setValue('seccionesVisibles', { ...temaData.seccionesVisibles, [key]: v })}
                />
              </Row>
            ))}
          </Card>
        </div>

        {/* ── Contenido general ── */}
        <div className="space-y-6">
          <div>
            <SectionTitle title="Sobre nosotros" desc="Información de tu negocio para la sección About." />
            <AboutUsEditor />
          </div>

          <div>
            <SectionTitle title="Texto en movimiento" desc="Frases, marcas o promos que se desplazan en pantalla." />
            <MarqueeEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
