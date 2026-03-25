import { useState } from 'react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  offerPrice: number;
  image1: string;
  image2: string;
  category: string;
  rating: number;
  description: string[];
}

// ─── DATOS DE EJEMPLO ─────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Labial Velvet Rose',
    price: 29,
    offerPrice: 22,
    image1: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop',
    category: 'Labios',
    rating: 5,
    description: ['Fórmula ultra pigmentada', 'Acabado aterciopelado', 'Duración 12 horas'],
  },
  {
    id: 2,
    name: 'Blush Pétalo',
    price: 35,
    offerPrice: 28,
    image1: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
    category: 'Mejillas',
    rating: 4,
    description: ['Tono natural y luminoso', 'Textura sedosa', 'Para todo tipo de piel'],
  },
  {
    id: 3,
    name: 'Paleta Dorada',
    price: 55,
    offerPrice: 44,
    image1: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop',
    category: 'Ojos',
    rating: 5,
    description: ['12 tonos complementarios', 'Alta pigmentación', 'Apto vegano'],
  },
  {
    id: 4,
    name: 'Sérum Glow',
    price: 48,
    offerPrice: 38,
    image1: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400&h=500&fit=crop',
    category: 'Skincare',
    rating: 4,
    description: ['Con vitamina C', 'Hidratación profunda', 'Ilumina el tono'],
  },
  {
    id: 5,
    name: 'Perfume Floral',
    price: 72,
    offerPrice: 59,
    image1: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop',
    category: 'Fragrancias',
    rating: 5,
    description: ['Notas de jazmín y rosa', 'Duración 8 horas', 'Edición limitada'],
  },
];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({
  onCartClick,
  cartCount,
  onLogoClick,
}: {
  onCartClick: () => void;
  cartCount: number;
  onLogoClick: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 border-b border-rose-100 bg-white sticky top-0 z-50">
      <button
        onClick={onLogoClick}
        className="font-black text-2xl tracking-tight text-rose-900 cursor-pointer"
      >
        LUMÉ
      </button>

      <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-rose-600 transition-colors">
          Inicio
        </a>
        <a href="#" className="hover:text-rose-600 transition-colors">
          Productos
        </a>
        <a href="#" className="hover:text-rose-600 transition-colors">
          Nosotras
        </a>
        <a href="#" className="hover:text-rose-600 transition-colors">
          Contacto
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onCartClick} className="relative cursor-pointer">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white bg-rose-500 w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
        <button className="hidden sm:block px-5 py-2 bg-rose-600 text-white text-sm font-medium rounded-full hover:bg-rose-700 transition-colors">
          Ingresar
        </button>
        <button onClick={() => setOpen(!open)} className="sm:hidden text-slate-700">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-rose-100 py-4 flex flex-col gap-3 px-6 text-sm font-medium text-slate-600 sm:hidden">
          <a href="#">Inicio</a>
          <a href="#">Productos</a>
          <a href="#">Nosotras</a>
          <a href="#">Contacto</a>
        </div>
      )}
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onShopClick }: { onShopClick: () => void }) => (
  <section className="relative overflow-hidden bg-rose-50 min-h-[85vh] flex items-center">
    <div className="max-w-6xl w-full mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-12 items-center py-20">
      <div>
        <span className="inline-block text-xs font-semibold tracking-widest text-rose-500 uppercase mb-4">
          Nueva colección 2025
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-rose-900 leading-tight">
          Tu belleza,
          <br />
          tu esencia.
        </h1>
        <p className="mt-6 text-slate-500 text-base max-w-md leading-relaxed">
          Cosméticos de alta calidad formulados con ingredientes naturales. Porque cada persona
          merece brillar a su manera.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={onShopClick}
            className="px-7 py-3.5 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition-colors text-sm"
          >
            Ver colección
          </button>
          <button className="px-7 py-3.5 border border-rose-200 text-rose-700 font-semibold rounded-full hover:bg-rose-100 transition-colors text-sm">
            Nuestra historia
          </button>
        </div>
        <div className="flex items-center gap-8 mt-12">
          {[
            ['12k+', 'Clientas'],
            ['100%', 'Natural'],
            ['4.9★', 'Valoración'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-rose-900">{val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative hidden md:flex justify-center">
        <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-2xl shadow-rose-200 rotate-2">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop"
            alt="hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-4 -left-4 w-48 h-64 rounded-2xl overflow-hidden shadow-xl shadow-rose-100 -rotate-3">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop"
            alt="hero2"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-4 -right-4 w-20 h-20 bg-rose-400 rounded-full opacity-20" />
        <div className="absolute bottom-20 right-0 w-10 h-10 bg-rose-300 rounded-full opacity-30" />
      </div>
    </div>
  </section>
);

// ─── GALERÍA / COLECCIÓN ──────────────────────────────────────────────────────
const Gallery = () => {
  const imgs = [
    'https://images.unsplash.com/photo-1562619371-b67725b6fde2?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1633983482450-bfb7b566fe6a?w=400&h=600&fit=crop',
    'https://plus.unsplash.com/premium_photo-1671209879721-3082e78307e3?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=600&fit=crop',
  ];

  return (
    <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase">
          Galería
        </span>
        <h2 className="text-3xl font-black text-rose-900 mt-2">Inspiración sin límites</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Una colección visual de nuestros looks favoritos, creados con nuestros productos.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`look-${i}`}
            className="w-full h-80 object-cover rounded-2xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
          />
        ))}
      </div>
    </section>
  );
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({
  product,
  onView,
  onAddCart,
}: {
  product: Product;
  onView: (p: Product) => void;
  onAddCart: (p: Product) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="max-w-full cursor-pointer group" onClick={() => onView(product)}>
      <div
        className="relative rounded-2xl overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={hovered ? product.image2 : product.image1}
          alt={product.name}
          className="w-full h-72 object-cover transition-all duration-500"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddCart(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white text-rose-700 text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-rose-600 hover:text-white"
        >
          + Agregar al carrito
        </button>
      </div>
      <div className="mt-2.5 px-1">
        <p className="text-xs text-rose-400 font-medium">{product.category}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-base font-bold text-rose-700">${product.offerPrice}</p>
          <p className="text-xs text-slate-400 line-through">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

// ─── GRILLA DE PRODUCTOS ──────────────────────────────────────────────────────
const ProductGrid = ({
  onView,
  onAddCart,
}: {
  onView: (p: Product) => void;
  onAddCart: (p: Product) => void;
}) => (
  <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase">
        Productos
      </span>
      <h2 className="text-3xl font-black text-rose-900 mt-2">Nuestra colección</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} product={p} onView={onView} onAddCart={onAddCart} />
      ))}
    </div>
  </section>
);

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────
const ProductDetail = ({
  product,
  onBack,
  onAddCart,
}: {
  product: Product;
  onBack: () => void;
  onAddCart: (p: Product) => void;
}) => {
  const [thumbnail, setThumbnail] = useState(product.image1);

  return (
    <section className="max-w-6xl w-full mx-auto px-6 md:px-16 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-rose-500 font-medium text-sm mb-8 hover:gap-3 transition-all"
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
          <span className="text-xs font-semibold tracking-widest text-rose-400 uppercase">
            {product.category}
          </span>
          <h1 className="text-3xl font-black text-rose-900 mt-1">{product.name}</h1>

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
            <button className="flex-1 py-3.5 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition-colors text-sm">
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CARRITO ──────────────────────────────────────────────────────────────────
interface CartItem extends Product {
  qty: number;
}

const Cart = ({
  items,
  onClose,
  onUpdateQty,
  onRemove,
}: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  const [showAddress, setShowAddress] = useState(false);
  const subtotal = items.reduce((acc, i) => acc + i.offerPrice * i.qty, 0);
  const tax = +(subtotal * 0.02).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-rose-100">
          <h2 className="text-lg font-black text-rose-900">
            Tu carrito{' '}
            <span className="text-sm text-rose-400 font-medium">{items.length} items</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-rose-200"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-slate-400 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-rose-50">
                <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image1} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-rose-400 font-medium">{item.category}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-base font-black text-rose-700 mt-0.5">${item.offerPrice}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-rose-100 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          item.qty > 1 ? onUpdateQty(item.id, item.qty - 1) : onRemove(item.id)
                        }
                        className="px-3 py-1 text-rose-500 hover:bg-rose-50 transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-semibold text-slate-700">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="px-3 py-1 text-rose-500 hover:bg-rose-50 transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-slate-300 hover:text-rose-400 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path
                          d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-rose-100 space-y-4 bg-rose-50/50">
            {/* Dirección */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Dirección de entrega
              </p>
              <div className="relative flex justify-between items-center">
                <p className="text-sm text-slate-400">Sin dirección cargada</p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-rose-500 text-xs font-semibold hover:underline"
                >
                  Cambiar
                </button>
                {showAddress && (
                  <div className="absolute top-8 left-0 right-0 bg-white border border-rose-100 rounded-xl shadow-lg text-sm z-10 overflow-hidden">
                    <p
                      onClick={() => setShowAddress(false)}
                      className="p-3 text-slate-500 hover:bg-rose-50 cursor-pointer"
                    >
                      Buenos Aires, Argentina
                    </p>
                    <p
                      onClick={() => setShowAddress(false)}
                      className="p-3 text-rose-500 text-center hover:bg-rose-50 cursor-pointer font-medium"
                    >
                      + Agregar dirección
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Método de pago
              </p>
              <select className="w-full border border-rose-100 bg-white px-3 py-2.5 rounded-xl text-sm text-slate-600 outline-none focus:border-rose-300">
                <option value="efectivo">Efectivo al recibir</option>
                <option value="online">Pago online</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
            </div>

            {/* Totales */}
            <div className="space-y-1.5 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-500 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (2%)</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between text-base font-black text-rose-900 pt-2 border-t border-rose-100">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-colors text-sm tracking-wide">
              Confirmar pedido →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── BANNER CTA ───────────────────────────────────────────────────────────────
const Banner = () => (
  <section className="bg-rose-900 py-20 px-6 md:px-16 text-center">
    <span className="text-xs font-semibold tracking-widest text-rose-300 uppercase">
      Oferta especial
    </span>
    <h2 className="text-4xl font-black text-white mt-3 max-w-lg mx-auto leading-tight">
      20% OFF en tu primera compra
    </h2>
    <p className="text-rose-300 text-sm mt-4 max-w-md mx-auto">
      Suscribite a nuestro newsletter y recibí tu descuento exclusivo directo en tu email.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md mx-auto">
      <input
        type="email"
        placeholder="tu@email.com"
        className="w-full px-5 py-3 rounded-full text-sm outline-none bg-white/10 text-white placeholder-rose-300 border border-rose-700 focus:border-rose-400"
      />
      <button className="whitespace-nowrap px-7 py-3 bg-white text-rose-800 font-bold rounded-full text-sm hover:bg-rose-50 transition-colors">
        Quiero el descuento
      </button>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="py-12 px-6 md:px-16 bg-white border-t border-rose-100 text-center text-sm text-slate-400">
    <p className="font-black text-xl text-rose-900 mb-2">LUMÉ</p>
    <p>© 2025 Lumé Cosmetics. Todos los derechos reservados.</p>
    <div className="flex items-center justify-center gap-6 mt-4">
      <a href="#" className="hover:text-rose-500 transition-colors">
        Términos
      </a>
      <span className="w-px h-3 bg-rose-100" />
      <a href="#" className="hover:text-rose-500 transition-colors">
        Privacidad
      </a>
      <span className="w-px h-3 bg-rose-100" />
      <a href="#" className="hover:text-rose-500 transition-colors">
        Contacto
      </a>
    </div>
  </footer>
);

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
type View = 'home' | 'detail';
export default function TemplatePinkDemo() {
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');`}</style>

      <Navbar
        onCartClick={() => setCartOpen(true)}
        cartCount={cartCount}
        onLogoClick={() => setView('home')}
      />

      {view === 'home' && (
        <>
          <Hero
            onShopClick={() =>
              document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
            }
          />
          <Gallery />
          <div id="productos">
            <ProductGrid
              onView={(p) => {
                setSelectedProduct(p);
                setView('detail');
              }}
              onAddCart={addToCart}
            />
          </div>
          <Banner />
        </>
      )}

      {view === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setView('home')}
          onAddCart={addToCart}
        />
      )}

      <Footer />

      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
        />
      )}
    </div>
  );
}
