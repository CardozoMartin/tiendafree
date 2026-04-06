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
  tienda?: ShopEditorData;
}

const EditingSite = ({ tienda }: EditingSiteProps) => {
  const updateShop = useUpdateShop();
  const updateShopVisual = useUpdateShopVisual();

  const { register, handleSubmit, reset, setValue, control } = useForm<ThemeFormValues>({
    defaultValues: getInitialThemeValues(tienda),
  });

  const themeWatch = useWatch({ control }) as ThemeFormValues | undefined;
  const temaData = themeWatch ?? getInitialThemeValues(tienda);

  const [data, setData] = useState<TiendaData>(getInitialTiendaData(tienda));

  useEffect(() => {
    reset(getInitialThemeValues(tienda));
    setData(getInitialTiendaData(tienda));
  }, [tienda, reset]);

  useEffect(() => {
    const root = document.documentElement;
    if (!temaData) {
      return;
    }

    root.style.setProperty('--primary-color', temaData.colorAcento);
    root.style.setProperty('--accent-color', temaData.colorAcento);
    root.style.setProperty('--button-bg', temaData.colorAcento);

    const isDark = temaData.modoOscuro;
    root.style.setProperty('--site-bg', isDark ? '#0d0d12' : '#FFFFFF');
    root.style.setProperty('--text-color', isDark ? '#f5f0e8' : '#1F2937');
    root.style.setProperty('--navbar-bg', isDark ? 'transparent' : '#FFFFFF');
    root.style.setProperty('--navbar-text', isDark ? '#f5f0e8' : '#1F2937');
  }, [temaData]);

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async (_values?: ThemeFormValues) => {
    const updateData = {
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
    reset(getInitialThemeValues(tienda));
    setData(getInitialTiendaData(tienda));
  };

  const isSaving = updateShop.isPending || updateShopVisual.isPending;

  return (
    <div className="space-y-6 pb-20">
      <EditingSiteHeader
        title="Editar Sitio"
        subtitle={tienda?.titulo || 'Tu tienda online'}
        onCancel={handleCancel}
        onSave={handleSubmit(handleSave)}
        isSaving={isSaving}
      />

      <div className="space-y-10">
        <IdentitySection data={data} onChange={handleChange} />

        <AppearanceSection register={register} temaData={temaData} setValue={setValue} />

        <VisibilitySection temaData={temaData} setValue={setValue} />

        <ProductCardSettingsSection register={register} />

        <AboutUsEditor />
        <MarqueeEditor />

        <ImageHeroHandlers data={data} onChangeData={handleChange} />

        <div className="h-6" />
      </div>
    </div>
  );
};

export default EditingSite;
