import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { TiendaData } from '../../../templates/types';
import { useUpdateShop, useUpdateShopVisual, useUploadLogo, useDeleteLogo, useCambiarSlug, useVerificarSlug } from '../../hooks/useShop';
import ImageHeroHandlers from '../ImageEditors/ImageHeroHandlers';
import HeroEditor from '../ImageEditors/HeroEditor';
import { comprimirImagen } from '../../utils/comprimirImagen';
import AboutUsEditor from './AboutUsEditor';
import MarqueeEditor from './MarqueeEditor';
import DashboardHelp from '../DashboardHelp';
import PopupManager from '../popups/PopupManager';

interface EditingSiteProps {
  tienda?: any;
}

const SLUG_REGEX = /^[a-z0-9]+(?:[-][a-z0-9]+)*$/;

type Tab = 'identidad' | 'apariencia' | 'contenido' | 'configuracion';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'identidad',     label: 'Identidad',      icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { id: 'apariencia',    label: 'Apariencia',     icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88' },
  { id: 'contenido',     label: 'Contenido',      icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9m0 0l-2.25-2.25M12 12l2.25-2.25' },
  { id: 'configuracion', label: 'Configuración',  icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

// ── Toggle reutilizable ───────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
  </label>
);

// ── Separador de sección dentro de un tab ────────────────────────────────────
const SectionTitle = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="mb-4">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</h3>
    {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
  </div>
);

// ── Card contenedor ──────────────────────────────────────────────────────────
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
    {children}
  </div>
);

// ── Row dentro de una Card ───────────────────────────────────────────────────
const Row = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-4 px-6 py-4 ${className}`}>{children}</div>
);

// ─────────────────────────────────────────────────────────────────────────────

const EditingSite = ({ tienda }: EditingSiteProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('identidad');

  // Mutations
  const updateShop      = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();
  const uploadLogo      = useUploadLogo();
  const deleteLogo      = useDeleteLogo();
  const cambiarSlug     = useCambiarSlug();

  // Logo
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(tienda?.logoUrl ?? null);

  // Slug
  const [slugInput, setSlugInput]       = useState(tienda?.slug ?? '');
  const [slugEditing, setSlugEditing]   = useState(false);
  const [slugDebounced, setSlugDebounced] = useState('');
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: slugCheck } = useVerificarSlug(
    slugDebounced,
    slugEditing && slugDebounced.length >= 3 && slugDebounced !== tienda?.slug
  );

  useEffect(() => {
    setLogoPreview(tienda?.logoUrl ?? null);
    setSlugInput(tienda?.slug ?? '');
  }, [tienda]);

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

  // Tienda activa/pausada
  const tiendaActiva = tienda?.activa ?? false;
  const toggleActiva = async () => { await updateShop.mutateAsync({ activa: !tiendaActiva }); };

  // Form tema
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      colorAcento:       tienda?.temaConfig?.colorAcento || '#3B82F6',
      modoOscuro:        tienda?.temaConfig?.modoOscuro ?? true,
      navbarStyle:       tienda?.temaConfig?.navbarStyle || 'TRANSPARENT',
      heroCtaTexto:      tienda?.temaConfig?.heroCtaTexto || 'Comprar ahora',
      heroTitulo:        tienda?.temaConfig?.heroTitulo || tienda?.titulo || '',
      heroSubtitulo:     tienda?.temaConfig?.heroSubtitulo || tienda?.descripcion || '',
      seccionesVisibles: tienda?.temaConfig?.seccionesVisibles || {
        hero: true, footer: true, navbar: true, galeria: true, productos: true, contacto: true,
      },
      cardMostrarPrecio:  tienda?.temaConfig?.cardMostrarPrecio ?? true,
      cardMostrarBadge:   tienda?.temaConfig?.cardMostrarBadge ?? true,
      tipoSeccionHero:    tienda?.temaConfig?.tipoSeccionHero || 'HERO_FIJO',
    },
  });

  const temaData: any = watch();

  useEffect(() => {
    if (tienda?.temaConfig) {
      reset({
        colorAcento:       tienda.temaConfig.colorAcento || '#3B82F6',
        modoOscuro:        tienda.temaConfig.modoOscuro ?? true,
        navbarStyle:       tienda.temaConfig.navbarStyle || 'TRANSPARENT',
        heroCtaTexto:      tienda.temaConfig.heroCtaTexto || 'Comprar ahora',
        heroTitulo:        tienda.temaConfig.heroTitulo || tienda.titulo || '',
        heroSubtitulo:     tienda.temaConfig.heroSubtitulo || tienda.descripcion || '',
        seccionesVisibles: tienda.temaConfig.seccionesVisibles || {
          hero: true, footer: true, navbar: true, galeria: true, productos: true, contacto: true,
        },
        cardMostrarPrecio:  tienda.temaConfig.cardMostrarPrecio ?? true,
        cardMostrarBadge:   tienda.temaConfig.cardMostrarBadge ?? true,
        tipoSeccionHero:    tienda.temaConfig.tipoSeccionHero || 'HERO_FIJO',
      });
    }
    setData({
      titulo:      tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel:    tienda?.carrusel ?? [],
    });
  }, [tienda, reset]);

  // Live preview CSS vars
  useEffect(() => {
    const root = document.documentElement;
    if (!temaData) return;
    root.style.setProperty('--primary-color', temaData.colorAcento);
    root.style.setProperty('--accent-color',  temaData.colorAcento);
    root.style.setProperty('--button-bg',      temaData.colorAcento);
    const isDark = temaData.modoOscuro;
    root.style.setProperty('--site-bg',      isDark ? '#0d0d12' : '#FFFFFF');
    root.style.setProperty('--text-color',   isDark ? '#f5f0e8' : '#1F2937');
    root.style.setProperty('--navbar-bg',    isDark ? 'transparent' : '#FFFFFF');
    root.style.setProperty('--navbar-text',  isDark ? '#f5f0e8' : '#1F2937');
  }, [temaData]);

  const [data, setData] = useState<TiendaData>({
    titulo:      tienda?.titulo ?? '',
    descripcion: tienda?.descripcion ?? '',
    carrusel:    tienda?.carrusel ?? [],
  });

  const handleChange = (patch: Partial<TiendaData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    await updateShop.mutateAsync({ titulo: data.titulo, descripcion: data.descripcion });
    await updateShopVisual.mutateAsync({
      ...temaData,
      heroTitulo:    data.titulo,
      heroSubtitulo: data.descripcion,
    });
  };

  const handleCancel = () => {
    reset();
    setData({
      titulo:      tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel:    tienda?.carrusel ?? [],
    });
  };

  const isSaving = updateShop.isPending || updateShopVisual.isPending;

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB CONTENTS
  // ─────────────────────────────────────────────────────────────────────────────

  const TabIdentidad = (
    <div className="space-y-6">
      <SectionTitle title="Logo e información" desc="El nombre e información principal de tu tienda." />
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
            value={data.titulo}
            onChange={(e) => handleChange({ titulo: e.target.value })}
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
            value={data.descripcion}
            onChange={(e) => handleChange({ descripcion: e.target.value })}
          />
        </div>
      </Card>
    </div>
  );

  const TabApariencia = (
    <div className="space-y-6">
      <SectionTitle title="Visual" desc="Colores, fuentes y comportamiento del menú." />
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
            <p className="text-xs text-gray-400 mt-0.5">Fondo oscuro en la plantilla</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('modoOscuro')} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
          </label>
        </Row>

        {/* Navbar style */}
        <Row>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Estilo del menú</p>
            <p className="text-xs text-gray-400 mt-0.5">Cómo se comporta la barra de navegación</p>
          </div>
          <select
            {...register('navbarStyle')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 cursor-pointer"
          >
            <option value="STICKY">Fijo</option>
            <option value="TRANSPARENT">Transparente</option>
            <option value="FLOATING">Flotante</option>
          </select>
        </Row>

        {/* CTA texto */}
        <Row>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Texto del botón principal</p>
            <p className="text-xs text-gray-400 mt-0.5">El call-to-action del hero</p>
          </div>
          <input
            {...register('heroCtaTexto')}
            type="text"
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 w-36 text-gray-700"
            placeholder="Explorar"
          />
        </Row>
      </Card>

      <SectionTitle title="Sección de entrada" desc="Cómo se ve la primera sección al abrir la tienda." />
      <Card>
        <div className="pb-1">
          <p className="text-sm font-medium text-gray-800 mb-1">Tipo de hero</p>
          <p className="text-xs text-gray-400 mb-3">Elegí cómo se muestra la sección principal de tu tienda</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'HERO_FIJO',  label: 'Hero clásico',       desc: 'Texto + imagen circular a la derecha', icon: '🖼️' },
              { value: 'CARRUSEL',   label: 'Carrusel full',      desc: 'Slides a pantalla completa con texto encima', icon: '🎞️' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('tipoSeccionHero', opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  temaData.tipoSeccionHero === opt.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <SectionTitle title="Tarjetas de producto" desc="Qué información se muestra en cada producto." />
      <Card>
        <Row>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Mostrar precio</p>
            <p className="text-xs text-gray-400">Visible sobre la imagen del producto</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('cardMostrarPrecio')} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
          </label>
        </Row>
        <Row>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Mostrar etiquetas</p>
            <p className="text-xs text-gray-400">Badges de categoría o estado</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('cardMostrarBadge')} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
          </label>
        </Row>
      </Card>
    </div>
  );

  const tipoHero = temaData.tipoSeccionHero ?? tienda?.temaConfig?.tipoSeccionHero ?? 'HERO_FIJO';

  const TabContenido = (
    <div className="space-y-6">
      {tipoHero === 'HERO_FIJO' ? (
        <>
          <SectionTitle title="Hero clásico" desc="Texto, subtítulo, botón e imagen circular de la portada." />
          <HeroEditor temaConfig={tienda?.temaConfig} />
        </>
      ) : (
        <>
          <SectionTitle title="Carrusel de imágenes" desc="Slides a pantalla completa. Subí fotos, editá textos y reordenalos." />
          <ImageHeroHandlers temaConfig={tienda?.temaConfig} />
        </>
      )}

      <SectionTitle title="Sobre nosotros" desc="Información de tu negocio para la sección About." />
      <AboutUsEditor />

      <SectionTitle title="Texto en movimiento" desc="Frases, marcas o promos que se desplazan en pantalla." />
      <MarqueeEditor />

      <SectionTitle title="Popups de la tienda" desc="Mensajes que aparecen al entrar: ofertas, newsletter, avisos." />
      <PopupManager />
    </div>
  );

  const TabConfiguracion = (
    <div className="space-y-6">
      <SectionTitle title="Estado de la tienda" desc="Controlá si tu tienda es visible para los clientes." />

      {/* Toggle tienda activa */}
      <button
        type="button"
        onClick={toggleActiva}
        disabled={updateShop.isPending}
        className={`w-full flex items-center justify-between gap-4 rounded-2xl px-6 py-5 transition-all border-2 ${
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
  );

  const TAB_CONTENT: Record<Tab, React.ReactNode> = {
    identidad:     TabIdentidad,
    apariencia:    TabApariencia,
    contenido:     TabContenido,
    configuracion: TabConfiguracion,
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">

      {/* ── Header fijo ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Editar Sitio</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tienda?.titulo || 'Tu tienda online'}</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardHelp activeSection="store-edit" accent={temaData.colorAcento} />
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-all"
          >
            Descartar
          </button>
          <button
            onClick={handleSubmit(handleSave as any)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando…
              </>
            ) : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Contenido del tab activo ── */}
      <div className="pb-20">
        {TAB_CONTENT[activeTab]}
      </div>
    </div>
  );
};

export default EditingSite;
