import { useState } from 'react';
import { FileText } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import type { IProduct } from '../../types/product.type';
import { useMisProductos } from '../../hooks/useProduct';
import { useMyShop } from '../../hooks/useShop';
import CatalogoPDF from '../CatalogoPDF';

const PDF_THEMES: Array<{ value: 'minimal' | 'modern' | 'lookbook'; label: string }> = [
  { value: 'minimal', label: 'Minimalista' },
  { value: 'modern', label: 'Moderno' },
  { value: 'lookbook', label: 'Lookbook' },
];

type TiendaInfo = {
  nombre: string;
  tagline?: string;
  logo?: string;
};

const ProductPdfCatalog = () => {
  const [pdfTheme, setPdfTheme] = useState<'minimal' | 'modern' | 'lookbook'>('minimal');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data: todosProductosPaginados } = useMisProductos({ limite: 1000, disponible: true });
  const { data: myShop } = useMyShop();

  const allProductsForPdf: IProduct[] = (todosProductosPaginados?.datos ?? []).filter(
    (producto) => producto.stock > 0
  );

  const tiendaInfo: TiendaInfo = myShop
    ? {
        nombre: myShop.nombre || 'Tienda',
        tagline: (myShop.configuracion as any)?.tagline || myShop.dominio,
        logo: (myShop.configuracion as any)?.logoUrl || undefined,
      }
    : { nombre: 'Tienda' };

  const { toPDF, targetRef } = usePDF({
    filename: 'catalogo.pdf',
    canvas: { useCORS: true },
  });

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      try {
        await toPDF();
      } catch (error) {
        console.error('Error generando PDF', error);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 150);
  };

  return (
    <>
      <div className="relative group">
        <select
          value={pdfTheme}
          onChange={(e) => setPdfTheme(e.target.value as 'minimal' | 'modern' | 'lookbook')}
          className="appearance-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all shadow-sm px-3 py-2.5 pr-8 focus:outline-none focus:border-gray-400 cursor-pointer"
          title="Elegir diseño del PDF"
        >
          {PDF_THEMES.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <button
        onClick={handleDownloadPdf}
        disabled={isGeneratingPdf}
        className={`flex items-center gap-1.5 px-3 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-bold rounded-xl transition-all shadow-sm ${
          isGeneratingPdf ? 'opacity-75 cursor-wait' : ''
        }`}
        title="Descargar catálogo de productos en PDF"
      >
        {isGeneratingPdf ? (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
      </button>

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CatalogoPDF ref={targetRef} productos={allProductsForPdf} tienda={tiendaInfo} tema={pdfTheme} />
      </div>
    </>
  );
};

export default ProductPdfCatalog;
