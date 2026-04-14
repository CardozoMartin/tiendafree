import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { TiendaData } from '../../../templates/types';
import { useUpdateShop, useUpdateShopVisual } from '../../hooks/useShop';
import ImageHeroHandlers from '../ImageEditors/ImageHeroHandlers';
import AboutUsEditor from './AboutUsEditor';
import MarqueeEditor from './MarqueeEditor';
import EditingSiteHeader from './EditingSiteHeader';
import {
  AppearanceSection,
  getInitialThemeValues,
  getInitialTiendaData,
  IdentitySection,
  ProductCardSettingsSection,
  VisibilitySection,
} from './EditingSiteSections';
import type { ShopEditorData, ThemeFormValues } from './EditingSiteSections';

interface EditingSiteProps {
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

  const { register, handleSubmit, reset, setValue, control } = useForm<ThemeFormValues>({
    defaultValues: getInitialThemeValues(tienda),
  });

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
  };

  // Verificamos si alguna petición está cargando en backend para mostrar estados de "Guardando..."
  const estaGuardando = mutacionActualizarTienda.isPending || mutacionActualizarVisual.isPending;

  // ============================================================================
  // 6. RENDERIZADO (UI)
  // ============================================================================
  
  return (
    <div className="space-y-6 pb-20">
      {/* --- Encabezado --- */}
      <EditingSiteHeader
        title="Editar Sitio"
        subtitle={tienda?.titulo || 'Tu tienda online'}
        onCancel={handleCancelarEdicion}
        onSave={handleSubmit(handleGuardarCambios)}
        isSaving={estaGuardando}
      />

      <div className="space-y-10">
        {/* --- Identidad --- */}
        <IdentitySection data={datosTienda} onChange={handleChangeDatosTienda} />

        {/* --- Apariencia (Fuente y Color) --- */}
        <AppearanceSection register={register} temaData={datosTema} setValue={setValue} />

        {/* --- Visibilidad (Modo Oscuro, Navbar) --- */}
        <VisibilitySection temaData={datosTema} setValue={setValue} />

        {/* --- Tarjetas de Producto --- */}
        <ProductCardSettingsSection register={register} />

        {/* --- Secciones Premium --- */}
        <AboutUsEditor />
        <MarqueeEditor />

        {/* --- Carrusel Principal (Imágenes del Hero) --- */}
        <ImageHeroHandlers data={datosTienda} onChangeData={handleChangeDatosTienda} />

        {/* Espaciado del final */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EditingSite;
