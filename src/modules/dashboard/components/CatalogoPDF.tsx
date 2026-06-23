import { forwardRef } from 'react';
import type { IProduct } from '../types/product.type';
import { TemplateMinimal } from './pdf-templates/TemplateMinimal';

// Agrupa por categoría real del producto, no por tag
const agruparPorCategoria = (productos: IProduct[]) => {
  const grupos: Record<string, IProduct[]> = {};
  for (const p of productos) {
    const cat = p.categoria?.nombre ?? 'General';
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(p);
  }
  return grupos;
};

interface Props {
  productos: IProduct[];
  tienda: {
    nombre: string;
    tagline?: string;
    logo?: string;
    instagram?: string;
    whatsapp?: string;
    ciudad?: string;
  };
}

const CatalogoPDF = forwardRef<HTMLDivElement, Props>(({ productos, tienda }, ref) => {
  const grupos = agruparPorCategoria(productos);

  return (
    <div ref={ref}>
      <TemplateMinimal productos={productos} tienda={tienda} grupos={grupos} />
    </div>
  );
});

CatalogoPDF.displayName = 'CatalogoPDF';
export default CatalogoPDF;
