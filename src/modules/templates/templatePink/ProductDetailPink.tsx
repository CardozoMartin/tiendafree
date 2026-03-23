import { useState } from 'react';
import type { Product } from './types';

const ProductDetail = ({
  product,
  onBack,
  onAddCart,
  accent,
  buttonBg,
  buttonText,
}: {
  product: Product;
  onBack: () => void;
  onAddCart: (p: Product) => void;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
}) => {
  const [thumbnail, setThumbnail] = useState(product.image1);

  return (
    <section className="max-w-6xl w-full mx-auto px-6 md:px-16 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-medium text-sm mb-8 hover:gap-3 transition-all"
        style={{ color: accent || '#f43f5e' }}
      >
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path
            d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Volver a productos
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Imágenes */}
        <div className="flex gap-3 flex-1">
          <div className="flex flex-col gap-2">
            {[product.image1, product.image2].map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className={`w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${thumbnail === img ? 'border-rose-400' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden max-h-[520px]">
            <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-96">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent || '#fb7185' }}>
            {product.category}
          </span>
          <h1 className="text-3xl font-black mt-1" style={{ color: accent || '#881337' }}>{product.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 18 17" fill="none">
                  <path
                    d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                    fill={i < product.rating ? '#f43f5e' : '#fecdd3'}
                  />
                </svg>
              ))}
            <span className="text-sm text-slate-400 ml-1">({product.rating}.0)</span>
          </div>

          <div className="mt-6">
            <p className="text-slate-400 text-sm line-through">${product.price}</p>
            <p className="text-3xl font-black text-rose-700">${product.offerPrice}</p>
            <p className="text-xs text-slate-400 mt-0.5">IVA incluido</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold text-slate-700 mb-2">Características</p>
            <ul className="space-y-1">
              {product.description.map((d, i) => (
                <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 mt-10">
            <button
              onClick={() => onAddCart(product)}
              className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors text-sm"
            >
              Agregar al carrito
            </button>
            <button 
              className="flex-1 py-3.5 font-semibold rounded-full opacity-90 hover:opacity-100 transition-opacity text-sm shadow-md"
              style={{ backgroundColor: buttonBg || accent || '#e11d48', color: buttonText || '#ffffff' }}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
