import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { TiendaData } from '../../../templates/types';
import { useUpdateShop, useUpdateShopVisual, useUploadLogo, useDeleteLogo, useCambiarSlug, useVerificarSlug } from '../../hooks/useShop';
import ImageHeroHandlers from '../ImageEditors/ImageHeroHandlers';
import AboutUsEditor from './AboutUsEditor';
import MarqueeEditor from './MarqueeEditor';
import DashboardHelp from '../DashboardHelp';

interface EditingSiteProps {
  tienda?: any;
}

const SLUG_REGEX = /^[a-z0-9]+(?:[-][a-z0-9]+)*$/;

const EditingSite = ({ tienda }: EditingSiteProps) => {
  // Mutations
  const updateShop = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();
  const uploadLogo = useUploadLogo();
  const deleteLogo = useDeleteLogo();
  const cambiarSlug = useCambiarSlug();

  // Logo state
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(tienda?.logoUrl ?? null);

  // Slug state
  const [slugInput, setSlugInput] = useState(tienda?.slug ?? '');
  const [slugEditing, setSlugEditing] = useState(false);
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
    await uploadLogo.mutateAsync(file);
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

  const tiendaActiva = tienda?.activa ?? false;
  const toggleActiva = async () => {
    await updateShop.mutateAsync({ activa: !tiendaActiva });
  };

  // react-hook-form para el diseño global
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      colorAcento: tienda?.temaConfig?.colorAcento || '#3B82F6',
      modoOscuro: tienda?.temaConfig?.modoOscuro ?? true,
      navbarStyle: tienda?.temaConfig?.navbarStyle || 'TRANSPARENT',
      heroCtaTexto: tienda?.temaConfig?.heroCtaTexto || 'Comprar ahora',
      heroTitulo: tienda?.temaConfig?.heroTitulo || tienda?.titulo || '',
      heroSubtitulo: tienda?.temaConfig?.heroSubtitulo || tienda?.descripcion || '',
      seccionesVisibles: tienda?.temaConfig?.seccionesVisibles || {
        hero: true,
        footer: true,
        navbar: true,
        galeria: true,
        productos: true,
        contacto: true,
      },
      cardMostrarPrecio: tienda?.temaConfig?.cardMostrarPrecio ?? true,
      cardMostrarBadge: tienda?.temaConfig?.cardMostrarBadge ?? true,
    },
  });

  // Observamos los cambios para el live preview
  const temaData: any = watch();

  // Actualizar formulario cuando los datos reales de la tienda cambien (ej: tras guardar)
  useEffect(() => {
    if (tienda?.temaConfig) {
      reset({
        colorAcento: tienda.temaConfig.colorAcento || '#3B82F6',
        modoOscuro: tienda.temaConfig.modoOscuro ?? true,
        navbarStyle: tienda.temaConfig.navbarStyle || 'TRANSPARENT',
        heroCtaTexto: tienda.temaConfig.heroCtaTexto || 'Comprar ahora',
        heroTitulo: tienda.temaConfig.heroTitulo || tienda.titulo || '',
        heroSubtitulo: tienda.temaConfig.heroSubtitulo || tienda.descripcion || '',
        seccionesVisibles: tienda.temaConfig.seccionesVisibles || {
          hero: true,
          footer: true,
          navbar: true,
          galeria: true,
          productos: true,
          contacto: true,
        },
        cardMostrarPrecio: tienda.temaConfig.cardMostrarPrecio ?? true,
        cardMostrarBadge: tienda.temaConfig.cardMostrarBadge ?? true,
      });
    }
    setData({
      titulo: tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel: tienda?.carrusel ?? [],
    });
  }, [tienda, reset]);

  useEffect(() => {
    const root = document.documentElement;
    if (temaData) {
      root.style.setProperty('--primary-color', temaData.colorAcento);
      root.style.setProperty('--accent-color', temaData.colorAcento);
      root.style.setProperty('--button-bg', temaData.colorAcento);
      const isDark = temaData.modoOscuro;
      root.style.setProperty('--site-bg', isDark ? '#0d0d12' : '#FFFFFF');
      root.style.setProperty('--text-color', isDark ? '#f5f0e8' : '#1F2937');
      root.style.setProperty('--navbar-bg', isDark ? 'transparent' : '#FFFFFF');
      root.style.setProperty('--navbar-text', isDark ? '#f5f0e8' : '#1F2937');
    }
  }, [temaData]);

  const [data, setData] = useState<TiendaData>({
    titulo: tienda?.titulo ?? '',
    descripcion: tienda?.descripcion ?? '',
    carrusel: tienda?.carrusel ?? [],
  });

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    const updateData: any = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      carrusel: data.carrusel,
    };
    await updateShop.mutateAsync(updateData);
    await updateShopVisual.mutateAsync({
      ...temaData,
      heroTitulo: data.titulo,
      heroSubtitulo: data.descripcion,
    });
  };

  const handleCancel = () => {
    reset();
    setData({
      titulo: tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel: tienda?.carrusel ?? [],
    });
  };

  // Verificamos si alguna petición está cargando en backend para mostrar estados de "Guardando..."
  const isSaving = updateShop.isPending || updateShopVisual.isPending;

  // ============================================================================
  // 6. RENDERIZADO (UI)
  // ============================================================================
  
  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
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
            ) : (
              'Guardar cambios'
            )}
          </button>
        </div>
      </div>

      {/* ── Estado de la tienda ── */}
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            tiendaActiva ? 'bg-emerald-500' : 'bg-slate-300'
          }`}>
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

        {/* Toggle visual */}
        <div className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-300 ${
          tiendaActiva ? 'bg-emerald-500' : 'bg-slate-300'
        }`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
            tiendaActiva ? 'left-8' : 'left-1'
          }`} />
        </div>
      </button>

      {/* ── Content ── */}
      <div className="space-y-10">
        {/* ══════════════════════════
            SECCIÓN: IDENTIDAD
        ══════════════════════════ */}
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Identidad
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              El nombre e información principal de tu tienda.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
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
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">Logo de la tienda</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG o SVG · Máx 5 MB</p>
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
            <div className="flex items-center gap-6 px-6 py-5">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nombre de la tienda
                </label>
                <input
                  type="text"
                  className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors"
                  placeholder="Ej. Mi Tienda"
                  value={data.titulo}
                  onChange={(e) => handleChange({ titulo: e.target.value })}
                />
              </div>
            </div>

            {/* Slug / URL */}
            <div className="px-6 py-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                URL de tu tienda
              </label>
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
                      disabled={
                        cambiarSlug.isPending ||
                        !slugInput ||
                        !SLUG_REGEX.test(slugInput) ||
                        (slugCheck !== undefined && !slugCheck.disponible && slugInput !== tienda?.slug)
                      }
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

            {/* Subtítulo / descripción */}
            <div className="px-6 py-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Subtítulo / descripción
              </label>
              <textarea
                rows={2}
                className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors resize-none"
                placeholder="Una frase que describa tu tienda…"
                value={data.descripcion}
                onChange={(e) => handleChange({ descripcion: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            SECCIÓN: APARIENCIA
        ══════════════════════════ */}
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Apariencia
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Define los colores, el estilo de navegación y el modo visual.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* Color de acento */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Color de acento</p>
                <p className="text-xs text-gray-400 mt-0.5">Botones y elementos destacados</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-black/10 cursor-pointer"
                  style={{ backgroundColor: temaData.colorAcento }}
                />
                <input
                  type="color"
                  className="sr-only"
                  id="accent-color"
                  value={temaData.colorAcento}
                  onChange={(e: any) => setValue('colorAcento', e.target.value)}
                />
                <label
                  htmlFor="accent-color"
                  className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
                >
                  {temaData.colorAcento?.toUpperCase()}
                </label>
              </div>
            </div>

            {/* Modo Oscuro */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Modo oscuro</p>
                <p className="text-xs text-gray-400 mt-0.5">Fondo oscuro en la plantilla</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('modoOscuro')} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
              </label>
            </div>

            {/* Estilo navbar */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Estilo del menú</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Cómo se comporta la barra de navegación
                </p>
              </div>
              <select
                {...register('navbarStyle')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 cursor-pointer"
              >
                <option value="STICKY">Fijo</option>
                <option value="TRANSPARENT">Transparente</option>
                <option value="FLOATING">Flotante</option>
              </select>
            </div>

            {/* Objetivo del CTA */}
            <div className="flex items-center gap-4 px-6 py-5">
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
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            SECCIÓN: SECCIONES VISIBLES
        ══════════════════════════ */}
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Visibilidad de secciones
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Activa o desactiva las secciones de tu sitio.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {(
              [
                { key: 'hero', label: 'Hero', desc: 'Banner de entrada con imagen y título' },
                { key: 'navbar', label: 'Navegación', desc: 'Menú superior y logo' },
                { key: 'productos', label: 'Productos', desc: 'Grilla de productos a la venta' },
                { key: 'galeria', label: 'Galería', desc: 'Muestra tus imágenes' },
                { key: 'contacto', label: 'Contacto', desc: 'Formulario o info de contacto' },
                { key: 'footer', label: 'Footer', desc: 'Pie de página' },
              ] as const
            ).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={temaData.seccionesVisibles?.[key] ?? true}
                    onChange={(e) =>
                      setValue('seccionesVisibles', {
                        ...temaData.seccionesVisibles,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════
            SECCIÓN: PRODUCTOS
        ══════════════════════════ */}
        <div>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Tarjetas de Producto
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configura qué info se muestra en cada producto.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Mostrar precio</p>
                <p className="text-xs text-gray-400">Visble sobre la imagen del producto</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('cardMostrarPrecio')}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
              </label>
            </div>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Mostrar etiquetas</p>
                <p className="text-xs text-gray-400">Badges de categoría o estado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('cardMostrarBadge')} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
              </label>
            </div>
          </div>
        </div>

        {/* ── About Us Editor ── */}
        <AboutUsEditor />

        {/* ── Marquee Editor ── */}
        <MarqueeEditor />

        {/* ══════════════════════════
            SECCIÓN: IMÁGENES
        ══════════════════════════ */}
        <ImageHeroHandlers data={data} onChangeData={handleChange} />

        {/* Spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EditingSite;
