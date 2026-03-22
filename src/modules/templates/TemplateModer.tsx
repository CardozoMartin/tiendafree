import { useState } from 'react';
import HeroGallery from './templateModer/HeroGallery';

// ─── EDITOR TYPES & WRAPPER ──────────────────────────────────────────────────

export interface SectionEditorConfig {
  sectionId: string;
  label: string;
  onEdit: () => void;
}

export interface EditorConfig {
  enabled: boolean;
  activeSectionId?: string | null;
  data?: any;
  onChange?: (patch: any) => void;
  sections: SectionEditorConfig[];
}

const EditableSection = ({
  children,
  sectionId,
  label,
  editorConfig,
}: {
  children: React.ReactNode;
  sectionId: string;
  label: string;
  editorConfig?: EditorConfig;
}) => {
  if (!editorConfig?.enabled) return <>{children}</>;

  const sectionConfig = editorConfig.sections.find((s) => s.sectionId === sectionId);
  if (!sectionConfig) return <>{children}</>;

  const isEditingThis = editorConfig.activeSectionId === sectionId;
  const isEditingOther = editorConfig.activeSectionId && !isEditingThis;

  return (
    <div className={`relative group/editable ${isEditingThis ? 'ring-2 ring-indigo-400 rounded-sm ring-offset-4 ring-offset-indigo-50' : ''}`}>
      {children}
      
      {!isEditingThis && !isEditingOther && (
        <>
          <div className="absolute inset-0 ring-1 ring-indigo-200 md:ring-transparent md:ring-2 group-hover/editable:ring-indigo-400 group-hover/editable:ring-offset-0 rounded-sm transition-all duration-200 pointer-events-none z-10" />
          <button
            onClick={sectionConfig.onEdit}
            className="
              absolute top-4 right-4 z-30
              opacity-90 md:opacity-0 group-hover/editable:opacity-100
              transition-all duration-200 scale-100 md:scale-95 group-hover/editable:scale-100
              flex items-center gap-1.5 px-3 py-1.5
              bg-white border border-indigo-200 rounded-lg shadow-md
              text-xs font-semibold text-indigo-600
              hover:bg-indigo-600 hover:text-white hover:border-indigo-600
            "
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar {label}
          </button>
        </>
      )}
    </div>
  );
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['Todo', 'Camisas', 'Zapatos', 'Accesorios', 'Pantalones', 'Vestidos'];
const BRANDS = [
  {
    name: 'Intel',
    logo: 'https://cdn.simpleicons.org/intel/0068B5',
  },
  {
    name: 'AMD',
    logo: 'https://cdn.simpleicons.org/amd/ED1C24',
  },
  {
    name: 'NVIDIA',
    logo: 'https://cdn.simpleicons.org/nvidia/76B900',
  },
  {
    name: 'Logitech',
    logo: 'https://cdn.simpleicons.org/logitech/00B8FC',
  },
  {
    name: 'Corsair',
    logo: 'https://cdn.simpleicons.org/corsair/FFFFFF',
  },
  {
    name: 'Asus',
    logo: 'https://cdn.simpleicons.org/asus/00539B',
  },
  {
    name: 'MSI',
    logo: 'https://cdn.simpleicons.org/msi/FF0000',
  },
  {
    name: 'Razer',
    logo: 'https://cdn.simpleicons.org/razer/00FF00',
  },
  {
    name: 'Samsung',
    logo: 'https://cdn.simpleicons.org/samsung/1428A0',
  },
  {
    name: 'Kingston',
    logo: 'https://cdn.simpleicons.org/kingston/E2001A',
  },
  {
    name: 'Western Digital',
    logo: 'https://cdn.simpleicons.org/westerndigital/0079BE',
  },
  {
    name: 'Seagate',
    logo: 'https://cdn.simpleicons.org/seagate/6EAB3D',
  },
];

const LogoMarquee = () => (
  <section className="py-10 px-6 md:px-16 lg:px-24 xl:px-32">
    <p className="text-center text-xs text-gray-400 mb-8 tracking-widest uppercase font-medium">
      Marcas con las que trabajamos
    </p>
    <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
      {/* Fade left */}
      <div className="absolute left-0 top-0 h-full w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

      <style>{`
        .marquee-track { animation: marqueeScroll linear infinite; }
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div
        className="marquee-track flex items-center will-change-transform min-w-[200%]"
        style={{ animationDuration: '22s' }}
      >
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 mx-8 shrink-0 group cursor-default"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-6 w-auto opacity-30 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-300"
              draggable={false}
              onError={(e) => {
                // fallback: ocultar imagen si falla
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm font-semibold text-gray-300 group-hover:text-gray-500 transition-colors duration-300 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>

      {/* Fade right */}
      <div className="absolute right-0 top-0 h-full w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>
  </section>
);

const PRODUCTS = [
  {
    id: 1,
    name: 'Camisa Lino Blanca',
    category: 'Camisas',
    price: 59,
    mrp: 80,
    rating: 4,
    reviews: 12,
    badge: 'Nuevo',
    description:
      'Camisa de lino premium, fresca y cómoda. Perfecta para el día a día con un toque de elegancia natural.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
    ],
  },
  {
    id: 2,
    name: 'Sneakers Urban',
    category: 'Zapatos',
    price: 120,
    mrp: 150,
    rating: 5,
    reviews: 8,
    badge: 'Top',
    description: 'Calzado urbano con suela de goma de alta durabilidad y plantilla acolchada.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
    ],
  },
  {
    id: 3,
    name: 'Vestido Crema Verano',
    category: 'Vestidos',
    price: 89,
    mrp: null,
    rating: 5,
    reviews: 21,
    badge: null,
    description:
      'Vestido fluido de corte midi, ideal para días cálidos. Tela liviana con caída perfecta.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
    ],
  },
  {
    id: 4,
    name: 'Pantalón Cargo Verde',
    category: 'Pantalones',
    price: 75,
    mrp: 95,
    rating: 4,
    reviews: 5,
    badge: 'Oferta',
    description:
      'Pantalón cargo moderno con bolsillos laterales. Corte recto, tela de algodón resistente.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
    ],
  },
  {
    id: 5,
    name: 'Camiseta Básica Negra',
    category: 'Camisas',
    price: 29,
    mrp: null,
    rating: 4,
    reviews: 34,
    badge: null,
    description: 'La camiseta esencial en tu guardarropa. Algodón 100% peinado, suave y duradero.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
    ],
  },
  {
    id: 6,
    name: 'Cinturón Trenzado',
    category: 'Accesorios',
    price: 35,
    mrp: 48,
    rating: 4,
    reviews: 9,
    badge: null,
    description: 'Cinturón de cuero trenzado, hebilla plateada. Versátil y duradero.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
    ],
  },
  {
    id: 7,
    name: 'Blusa Floral Manga Corta',
    category: 'Vestidos',
    price: 45,
    mrp: null,
    rating: 5,
    reviews: 17,
    badge: 'Nuevo',
    description: 'Blusa de estampado floral sutil, perfecta para combinar con pantalón o falda.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
    ],
  },
  {
    id: 8,
    name: 'Loafers Cuero Marrón',
    category: 'Zapatos',
    price: 145,
    mrp: 180,
    rating: 5,
    reviews: 6,
    badge: 'Premium',
    description:
      'Mocasines de cuero genuino con suela de cuero. Acabado artesanal, máximo confort.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
    ],
  },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  description: string;
  images: string[];
}

interface CartItem extends Product {
  qty: number;
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="13" viewBox="0 0 18 17" fill="none">
    <path
      d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
      fill={filled ? '#615fff' : 'none'}
      fillOpacity={filled ? 1 : 0.35}
      stroke={filled ? 'none' : '#615fff'}
      strokeOpacity={filled ? 1 : 0.5}
    />
  </svg>
);

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <StarIcon key={i} filled={i < rating} />
    ))}
  </div>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

const Header = ({
  cartCount,
  onCartClick,
  brandName = 'Mi Logo',
  editMode,
  onChange,
}: {
  cartCount: number;
  onCartClick: () => void;
  brandName?: string;
  editMode?: boolean;
  onChange?: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative z-40">
      {editMode ? (
         <input
           className="font-semibold text-xl tracking-tight text-indigo-600 bg-transparent outline-none w-48 border-b-2 border-dashed border-indigo-300 focus:border-indigo-500 transition-colors"
           value={brandName}
           onChange={(e) => onChange?.(e.target.value)}
           placeholder="Nombre de tienda"
         />
      ) : (
        <a href="#">
          <span className="text-xl font-semibold text-indigo-600 tracking-tight">{brandName}</span>
        </a>
      )}

      <div className="hidden sm:flex items-center gap-8">
        {['Inicio', 'Nosotros', 'Contacto'].map((l) => (
          <a key={l} href="#" className="text-sm hover:text-indigo-500 transition">
            {l}
          </a>
        ))}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
            type="text"
            placeholder="Buscar productos, marcas y más..."
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <button className="relative cursor-pointer" onClick={onCartClick}>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
          Ingresar
        </button>
      </div>

      <button onClick={() => setOpen(!open)} className="sm:hidden">
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden z-50">
          <a href="#" className="block">
            Inicio
          </a>
          <a href="#" className="block">
            Nosotros
          </a>
          <a href="#" className="block">
            Contacto
          </a>
          <button className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
            Ingesar
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── HERO GALLERY ─────────────────────────────────────────────────────────────



// ─── LOGO MARQUEE ─────────────────────────────────────────────────────────────



// ─── NEW ARRIVALS ─────────────────────────────────────────────────────────────

const NewArrivals = () => (
  <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
    <h1 className="text-3xl font-medium text-slate-800 text-center mb-2">New Arrivals</h1>
    <p className="text-slate-600 mb-10 text-center">
      Explore the latest additions to our collection.
    </p>
    <section className="flex flex-wrap items-center justify-center gap-6">
      {[
        {
          img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=500&auto=format&fit=crop',
          price: '$29.00',
        },
        {
          img: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop',
          price: '$39.00',
        },
        {
          img: 'https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=735&auto=format&fit=crop',
          price: '$29.00',
        },
        {
          img: 'https://images.unsplash.com/photo-1667243038099-b257ab263bfd?q=80&w=687&auto=format&fit=crop',
          price: '$49.00',
        },
      ].map((item, i) => (
        <a key={i} href="#" className="group w-56">
          <img
            className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top"
            src={item.img}
            alt="product"
          />
          <p className="text-sm mt-2">White Crew-Neck T-Shirt</p>
          <p className="text-xl">{item.price}</p>
        </a>
      ))}
    </section>
  </section>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({
  product,
  onSelect,
  onAddToCart,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) => (
  <div className="group cursor-pointer" onClick={() => onSelect(product)}>
    <div className="relative overflow-hidden rounded-md bg-gray-100 aspect-[3/4] mb-3">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      {product.badge && (
        <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded">
          {product.badge}
        </span>
      )}
    </div>
    <StarRating rating={product.rating} />
    <p className="text-sm mt-1 text-gray-800">{product.name}</p>
    <div className="flex items-baseline gap-2 mt-0.5">
      {product.mrp && <span className="text-xs text-gray-400 line-through">${product.mrp}</span>}
      <span className="text-base font-medium">${product.price}</span>
    </div>
    <button
      className="w-full mt-2 py-2 text-xs border border-gray-800 hover:bg-gray-800 hover:text-white transition cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onAddToCart(product);
      }}
    >
      Add to Cart
    </button>
  </div>
);

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────────

const ProductsSection = ({
  onSelectProduct,
  onAddToCart,
}: {
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState('Todo');
  const filtered =
    activeCategory === 'Todo' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <h2 className="text-2xl font-medium text-center mb-6">All Products</h2>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-sm border rounded-full transition cursor-pointer ${activeCategory === cat ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────

const ProductDetail = ({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}) => {
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <div className="max-w-6xl w-full px-6 py-10 mx-auto">
      <p className="text-sm text-gray-500 mb-6">
        <span>Home</span> / <span>Products</span> / <span>{product.category}</span> /{' '}
        <span className="text-indigo-500">{product.name}</span>
        <button onClick={onClose} className="ml-4 text-xs text-indigo-500 underline cursor-pointer">
          ← Back
        </button>
      </p>
      <div className="flex flex-col md:flex-row gap-16">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`border max-w-24 rounded overflow-hidden cursor-pointer transition ${selectedImg === i ? 'border-indigo-500' : 'border-gray-500/30'}`}
              >
                <img src={img} alt={`thumb-${i}`} />
              </div>
            ))}
          </div>
          <div className="border border-gray-500/30 max-w-xs rounded overflow-hidden">
            <img src={product.images[selectedImg]} alt={product.name} />
          </div>
        </div>
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product.rating} />
            <p className="text-base ml-1">({product.reviews})</p>
          </div>
          <div className="mt-6">
            {product.mrp && <p className="text-gray-500/70 line-through">MRP: ${product.mrp}</p>}
            <p className="text-2xl font-medium">MRP: ${product.price}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>
          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70 mt-1 space-y-1">
            <li>{product.description}</li>
            <li>High-quality material</li>
            <li>Available in different sizes</li>
          </ul>
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition cursor-pointer"
            >
              Add to Cart
            </button>
            <button className="w-full py-3.5 font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition cursor-pointer">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CART DRAWER ─────────────────────────────────────────────────────────────

const CartDrawer = ({
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

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = +(subtotal * 0.02).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm text-indigo-500 font-normal">
                  {items.length} items
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 14 14" fill="none" className="opacity-20">
                <path
                  d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                  stroke="#615fff"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-sm text-indigo-500 underline cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-5">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {item.badge && (
                      <span className="inline-block text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 px-1.5 py-0.5 rounded mb-1">
                        {item.badge}
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-gray-300 divide-x divide-gray-300">
                        <button
                          onClick={() =>
                            item.qty > 1 ? onUpdateQty(item.id, item.qty - 1) : onRemove(item.id)
                          }
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 cursor-pointer text-sm transition"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700 font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 cursor-pointer text-sm transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-gray-800">
                        ${item.price * item.qty}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex items-center gap-1 mt-2 text-xs text-gray-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path
                          d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-5 bg-gray-50/40 space-y-4">
            {/* Delivery Address */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Delivery Address
              </p>
              <div className="relative flex justify-between items-center">
                <p className="text-sm text-gray-400">No address found</p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-indigo-500 text-xs hover:underline cursor-pointer"
                >
                  Change
                </button>
                {showAddress && (
                  <div className="absolute bottom-8 left-0 right-0 bg-white border border-gray-200 shadow-md text-sm z-10">
                    <p
                      onClick={() => setShowAddress(false)}
                      className="text-gray-500 p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      Buenos Aires, Argentina
                    </p>
                    <p
                      onClick={() => setShowAddress(false)}
                      className="text-indigo-500 text-center cursor-pointer p-2.5 hover:bg-indigo-50/50"
                    >
                      + Add address
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Payment Method
              </p>
              <select className="w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400 transition">
                <option value="COD">Cash On Delivery</option>
                <option value="Online">Online Payment</option>
                <option value="Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'Free' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (2%)</span>
                <span>${tax}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders over $100</p>
              )}
              <div className="flex justify-between text-base font-semibold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span>${total}</span>
              </div>
            </div>

            <button className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 transition text-white font-medium text-sm cursor-pointer">
              Place Order
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 border border-gray-300 text-gray-600 text-sm hover:border-gray-400 transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = () => {
  const linkSections = [
    {
      title: 'Quick Links',
      links: ['Home', 'Best Sellers', 'Offers & Deals', 'Contact Us', 'FAQs'],
    },
    {
      title: 'Need Help?',
      links: [
        'Delivery Information',
        'Return & Refund Policy',
        'Payment Methods',
        'Track your Order',
        'Contact Us',
      ],
    },
    { title: 'Follow Us', links: ['Instagram', 'Twitter', 'Facebook', 'YouTube'] },
  ];
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        <div>
          <span className="text-xl font-semibold text-indigo-600 tracking-tight">MyShop</span>
          <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet
            cumque accusamus atque qui error quo enim fugiat?
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {linkSections.map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="hover:underline transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 ©{' '}
        <a href="#" className="text-indigo-500">
          MyShop
        </a>{' '}
        All Rights Reserved.
      </p>
    </div>
  );
};

// ─── CART TOAST ──────────────────────────────────────────────────────────────

const CartToast = ({ message, visible }: { message: string; visible: boolean }) => (
  <div
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-lg shadow-lg transition-all duration-300 z-50 whitespace-nowrap ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
  >
    {message}
  </div>
);

// ─── PROPS INTERFACE ─────────────────────────────────────────────────────────────────────

interface TemplateModernProps {
  tienda?: any;
  tema?: any;
  accent?: string;
  personalizacion?: any;
  editorConfig?: EditorConfig;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export interface HeroGalleryProps {
  titulo: string;
  descripcion?: string;
  carrusel?: Array<{
    id?: number;
    url: string;
    titulo?: string | null;
    subtitulo?: string;
    linkUrl?: string | null;
    orden?: number;
    activa?: boolean;
  }>;
  editMode?: boolean;
  onChange?: (patch: any) => void;
}
export default function TemplateConCarrito(props: TemplateModernProps) {
  // ──── Props
  const { tienda, tema, accent = '#6344ee', personalizacion, editorConfig } = props;

  //props que se le pasara a hero gallery
  const heroProps: HeroGalleryProps = {
    titulo: editorConfig?.activeSectionId === 'hero' ? editorConfig.data?.titulo : tienda.titulo,
    descripcion: editorConfig?.activeSectionId === 'hero' ? editorConfig.data?.descripcion : tienda.descripcion,
    carrusel: editorConfig?.activeSectionId === 'hero' ? editorConfig.data?.carrusel : tienda.carrusel,
    editMode: editorConfig?.activeSectionId === 'hero',
    onChange: (patch) => {
      // HeroGallery sends { titulo, descripcion, carrusel } partials
      editorConfig?.onChange?.(patch);
    }
  };
  console.log(tienda.carrusel);
  const tituloTienda = tienda.titulo;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ ${product.name} agregado al carrito`);
  };

  const handleUpdateQty = (id: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }`}</style>

      <EditableSection sectionId="navbar" label="Menú Navegación" editorConfig={editorConfig}>
        <Header 
          cartCount={cartCount} 
          onCartClick={() => setCartOpen(true)} 
          brandName={editorConfig?.activeSectionId === 'navbar' ? editorConfig?.data?.titulo : tienda.titulo}
          editMode={editorConfig?.activeSectionId === 'navbar'}
          onChange={(val) => editorConfig?.onChange?.({ titulo: val })}
        />
      </EditableSection>

      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
          <EditableSection sectionId="hero" label="Hero / Galería" editorConfig={editorConfig}>
            <HeroGallery {...heroProps} />
          </EditableSection>
          
          <EditableSection sectionId="marcas" label="Marcas" editorConfig={editorConfig}>
            {editorConfig?.activeSectionId === 'marcas' ? (
               <div className="py-20 bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-400 rounded-xl m-10">
                 <span className="text-4xl mb-3">🏷️</span>
                 <p className="font-semibold text-sm">Editor de marcas — Próximamente</p>
               </div>
            ) : (
              <LogoMarquee />
            )}
          </EditableSection>

          <EditableSection sectionId="nuevos" label="Nuevos Ingresos" editorConfig={editorConfig}>
            {editorConfig?.activeSectionId === 'nuevos' ? (
               <div className="py-20 bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-400 rounded-xl m-10">
                 <span className="text-4xl mb-3">✨</span>
                 <p className="font-semibold text-sm">Editor de nuevos ingresos — Próximamente</p>
               </div>
            ) : (
              <NewArrivals />
            )}
          </EditableSection>

          <EditableSection sectionId="productos" label="Todos los productos" editorConfig={editorConfig}>
            {editorConfig?.activeSectionId === 'productos' ? (
               <div className="py-20 bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-400 rounded-xl m-10">
                 <span className="text-4xl mb-3">📦</span>
                 <p className="font-semibold text-sm">Los productos se gestionan desde el panel "Productos"</p>
               </div>
            ) : (
              <ProductsSection onSelectProduct={setSelectedProduct} onAddToCart={handleAddToCart} />
            )}
          </EditableSection>
        </>
      )}

      <Footer />

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
        />
      )}

      <CartToast visible={toast.visible} message={toast.message} />
    </div>
  );
}
