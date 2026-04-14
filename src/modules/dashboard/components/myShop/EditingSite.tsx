import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { resolveTemplateIdFromShop } from '../../../templates/registry';
import type { TiendaData } from '../../../templates/types';
import { useUpdateShop, useUpdateShopVisual } from '../../hooks/useShop';
import ImageHeroHandlers from '../ImageEditors/ImageHeroHandlers';
import AboutUsEditor from './AboutUsEditor';
import MarqueeEditor from './MarqueeEditor';
import DashboardHelp from '../DashboardHelp';

interface EditingSiteProps {
<<<<<<< HEAD
  // Datos iniciales de la tienda pasados por las propiedades (props)
  tienda?: ShopEditorData;
}

const EditingSite = ({ tienda }: EditingSiteProps) => {
  // ============================================================================
  // 1. MUTACIONES (API)
  // ============================================================================

  // Hooks para guardar los datos básicos y la configuración visual en la base de datos
  const mutacionActualizarTienda = useUpdateShop();
  const mutacionActualizarVisual = useUpdateShopVisual();

  // ============================================================================
  // 2. CONFIGURACIÓN DEL FORMULARIO (React Hook Form)
  // ============================================================================
=======
  tienda?: any;
}

const EditingSite = ({ tienda }: EditingSiteProps) => {
  const plantillaId = resolveTemplateIdFromShop(tienda);

  // Mutations
  const updateShop = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();
>>>>>>> 828e27c6f0e6d65ce1c687bce9d595ccd1683be1

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

<<<<<<< HEAD
  // Observamos los cambios en tiempo real del formulario del tema
  const valoresTemaObservados = useWatch({ control }) as ThemeFormValues | undefined;

  // Usamos los valores actuales (si se cambió algo) o los iniciales si no hay cambios
  const datosTema = valoresTemaObservados ?? getInitialThemeValues(tienda);

  // ============================================================================
  // 3. ESTADOS LOCALES
  // ============================================================================

  // Estado local para manejar información general de la tienda (título, descripción, etc.)
  const [datosTienda, setDatosTienda] = useState<TiendaData>(getInitialTiendaData(tienda));

  // ============================================================================
  // 4. EFECTOS SECUNDARIOS
  // ============================================================================

  // Efecto: Resetear el formulario y los datos locales si la "tienda" (prop) cambia 
  useEffect(() => {
    reset(getInitialThemeValues(tienda));
    setDatosTienda(getInitialTiendaData(tienda));
  }, [tienda, reset]);

  // Efecto: Inyectar variables CSS dinámicamente para previsualizar los cambios en la app
  useEffect(() => {
    const root = document.documentElement;
    if (!datosTema) {
      return;
    }

    // Colores principales
    root.style.setProperty('--primary-color', datosTema.colorAcento);
    root.style.setProperty('--accent-color', datosTema.colorAcento);
    root.style.setProperty('--button-bg', datosTema.colorAcento);

    // Colores basados en el Modo Oscuro o Claro
    const esModoOscuro = datosTema.modoOscuro;
    root.style.setProperty('--site-bg', esModoOscuro ? '#0d0d12' : '#FFFFFF');
    root.style.setProperty('--text-color', esModoOscuro ? '#f5f0e8' : '#1F2937');
    root.style.setProperty('--navbar-bg', esModoOscuro ? 'transparent' : '#FFFFFF');
    root.style.setProperty('--navbar-text', esModoOscuro ? '#f5f0e8' : '#1F2937');
  }, [datosTema]);

  // ============================================================================
  // 5. MANEJADORES DE EVENTOS (Handlers)
  // ============================================================================

  // Handler: Actualiza secciones parciales de los datos de la tienda
  const handleChangeDatosTienda = (modificaciones: Partial<TiendaData>) => {
    setDatosTienda((estadoAnterior) => ({ ...estadoAnterior, ...modificaciones }));
  };

  // Handler: Guarda todos los cambios llamando a la API (se acciona al hacer Submit)
  const handleGuardarCambios = async (_valoresFormulario?: ThemeFormValues) => {
    // 1. Guardar la información básica
    const datosBasicos = {
      titulo: datosTienda.titulo,
      descripcion: datosTienda.descripcion,
      carrusel: datosTienda.carrusel,
    };
    await mutacionActualizarTienda.mutateAsync(datosBasicos);

    // 2. Guardar la configuración visual y unificar el Hero (título y subtítulo)
    await mutacionActualizarVisual.mutateAsync({
      ...datosTema,
      heroTitulo: datosTienda.titulo,
      heroSubtitulo: datosTienda.descripcion,
    });
  };

  // Handler: Cancela toda edición y vuelve a los valores guardados
  const handleCancelarEdicion = () => {
    reset(getInitialThemeValues(tienda));
    setDatosTienda(getInitialTiendaData(tienda));
=======
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
    // Sincronizar también los datos locales de identidad y carrusel
    setData({
      titulo: tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel: tienda?.carrusel ?? [],
    });
  }, [tienda, reset, plantillaId]);

  // Sincronizar temaData con variables CSS globales (Live Preview Suave)
  useEffect(() => {
    const root = document.documentElement;
    if (temaData) {
      // Usamos el color de acento para los elementos principales
      root.style.setProperty('--primary-color', temaData.colorAcento);
      root.style.setProperty('--accent-color', temaData.colorAcento);
      root.style.setProperty('--button-bg', temaData.colorAcento);

      // Colores base dependientes del modo (simulado o fijo para modern)
      const isDark = temaData.modoOscuro;
      root.style.setProperty('--site-bg', isDark ? '#0d0d12' : '#FFFFFF');
      root.style.setProperty('--text-color', isDark ? '#f5f0e8' : '#1F2937');
      root.style.setProperty('--navbar-bg', isDark ? 'transparent' : '#FFFFFF');
      root.style.setProperty('--navbar-text', isDark ? '#f5f0e8' : '#1F2937');
    }
  }, [temaData]);

  // Datos locales de edición (se sincronizan con la tienda)
  const [data, setData] = useState<TiendaData>({
    titulo: tienda?.titulo ?? '',
    descripcion: tienda?.descripcion ?? '',
    carrusel: tienda?.carrusel ?? [],
  });

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    console.log(`[EditingSite] Guardando toda la configuración`);

    // 1. Datos básicos
    const updateData: any = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      carrusel: data.carrusel,
    };
    await updateShop.mutateAsync(updateData);

    // 2. Apariencia y textos vinculados al tema
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
>>>>>>> 828e27c6f0e6d65ce1c687bce9d595ccd1683be1
  };

  // Verificamos si alguna petición está cargando en backend para mostrar estados de "Guardando..."
  const estaGuardando = mutacionActualizarTienda.isPending || mutacionActualizarVisual.isPending;

  // ============================================================================
  // 6. RENDERIZADO (UI)
  // ============================================================================
  
  return (
    <div className="space-y-6 pb-20">
<<<<<<< HEAD
      {/* --- Encabezado --- */}
      <EditingSiteHeader
        title="Editar Sitio"
        subtitle={tienda?.titulo || 'Tu tienda online'}
        onCancel={handleCancelarEdicion}
        onSave={handleSubmit(handleGuardarCambios)}
        isSaving={estaGuardando}
      />
=======
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
>>>>>>> 828e27c6f0e6d65ce1c687bce9d595ccd1683be1

      {/* ── Content ── */}
      <div className="space-y-10">
<<<<<<< HEAD
        {/* --- Identidad --- */}
        <IdentitySection data={datosTienda} onChange={handleChangeDatosTienda} />

        {/* --- Apariencia (Fuente y Color) --- */}
        <AppearanceSection register={register} temaData={datosTema} setValue={setValue} />

        {/* --- Visibilidad (Modo Oscuro, Navbar) --- */}
        <VisibilitySection temaData={datosTema} setValue={setValue} />

        {/* --- Tarjetas de Producto --- */}
        <ProductCardSettingsSection register={register} />

        {/* --- Secciones Premium --- */}
=======
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
>>>>>>> 828e27c6f0e6d65ce1c687bce9d595ccd1683be1
        <AboutUsEditor />

        {/* ── Marquee Editor ── */}
        <MarqueeEditor />

<<<<<<< HEAD
        {/* --- Carrusel Principal (Imágenes del Hero) --- */}
        <ImageHeroHandlers data={datosTienda} onChangeData={handleChangeDatosTienda} />

        {/* Espaciado del final */}
=======
        {/* ══════════════════════════
            SECCIÓN: IMÁGENES
        ══════════════════════════ */}
        <ImageHeroHandlers data={data} onChangeData={handleChange} />

        {/* Spacer */}
>>>>>>> 828e27c6f0e6d65ce1c687bce9d595ccd1683be1
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EditingSite;
