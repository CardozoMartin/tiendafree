import { forwardRef } from 'react';
import type { IProduct } from '../types/product.type';
import { TemplateMinimal } from './pdf-templates/TemplateMinimal';
import { TemplateModern } from './pdf-templates/TemplateModern';
import { TemplateLookbook } from './pdf-templates/TemplateLookbook';

// Agrupa productos por su primer tag, o "Sin categoría" si no tiene
const agruparPorTag = (productos: IProduct[]) => {
  const grupos: Record<string, IProduct[]> = {};
  for (const p of productos) {
    const categoria = p.tags?.[0]?.nombre ?? 'Sin categoría';
    if (!grupos[categoria]) grupos[categoria] = [];
    grupos[categoria].push(p);
  }
  return grupos;
};

// ⚠️ ¿CÓMO AGREGAR UN NUEVO TEMA PARA EL PDF? ⚠️
// 1. Crea un archivo en la carpeta `pdf-templates` (ej: TemplateElegante.tsx).
// 2. Exporta el componente asegurándote de usar las mismas `TemplateProps` definidas en TemplateMinimal.
// 3. Impórtalo arriba ☝️ y agrégalo abajo en el `switch (tema)` devolviendo tu diseño.
// NOTA IMPORTANTE: Para la librería PDF, los estilos DEBEN ser siempre "in-line" (ej: `style={{ width: '100%' }}`), TailwindCSS no será procesado correctamente ya que el elemento se inyecta oculto fuera del DOM principal.

interface Props {
  productos: IProduct[];
  tienda: { nombre: string; tagline?: string; logo?: string };
  tema?: 'minimal' | 'modern' | 'lookbook';
}

const CatalogoPDF = forwardRef<HTMLDivElement, Props>(({ productos, tienda, tema = 'minimal' }, ref) => {
  const grupos = agruparPorTag(productos);

  const sharedProps = {
    productos,
    tienda,
    grupos,
  };

  return (
    <div ref={ref}>
      {(() => {
        switch (tema) {
          case 'modern':
            return <TemplateModern {...sharedProps} />;
          case 'lookbook':
            return <TemplateLookbook {...sharedProps} />;
          case 'minimal':
          default:
            return <TemplateMinimal {...sharedProps} />;
        }
      })()}
    </div>
  );
});

CatalogoPDF.displayName = 'CatalogoPDF';
export default CatalogoPDF;
