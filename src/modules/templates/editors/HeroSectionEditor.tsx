import type { TemplateSectionEditorProps } from '../editorRegistry';
import HeroGallery from '../templateModer/HeroGallery';

const HeroSectionEditor = ({
  data,
  editMode,
  onChange,
  onSave,
  onCancel,
}: TemplateSectionEditorProps) => {
  return (
    <HeroGallery
      titulo={data.titulo}
      descripcion={data.descripcion}
      carrusel={data.carrusel}
      editMode={editMode}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default HeroSectionEditor;
