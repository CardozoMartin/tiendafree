import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['Todo', 'Camisas', 'Zapatos', 'Accesorios', 'Pantalones', 'Vestidos'];

const COMPANY_LOGOS = ['slack', 'framer', 'netflix', 'google', 'linkedin', 'instagram', 'facebook'];

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

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop',
    span: 'row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop',
    span: '',
  },
];

// ─── STAR RATING SVG ─────────────────────────────────────────────────────────

const StarIcon = ({ filled }) => (
  <svg width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  activeAccent,
}: {
  cartCount: number;
  onCartClick: () => void;
  activeAccent?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <a href="#">
        <span className="text-xl font-semibold text-indigo-600 tracking-tight">MyShop</span>
      </a>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <a href="#" className="text-sm hover:text-indigo-500 transition">
          Home
        </a>
        <a href="#" className="text-sm hover:text-indigo-500 transition">
          About
        </a>
        <a href="#" className="text-sm hover:text-indigo-500 transition">
          Contact
        </a>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
            type="text"
            placeholder="Search products"
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

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={onCartClick}>
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
        </div>

        <button className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
          Login
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button onClick={() => setOpen(!open)} className="sm:hidden">
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden z-50">
          <a href="#" className="block">
            Home
          </a>
          <a href="#" className="block">
            About
          </a>
          <a href="#" className="block">
            Contact
          </a>
          <button className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── HERO GALLERY ─────────────────────────────────────────────────────────────
// Desktop: expanding panels on hover
// Mobile:  horizontal snap carousel

const HeroGallery = () => {
  const scrollRef = useState(null);

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">
      <h1 className="text-3xl font-semibold text-center mx-auto">Our Latest Creations</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        A visual collection of our most recent works — each piece crafted with intention, emotion,
        and style.
      </p>

      {/* ── Desktop: expanding panels ── */}
      <div className="hidden md:flex items-center gap-2 h-[400px] w-full max-w-4xl mt-10 mx-auto">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className="relative group flex-grow transition-all w-20 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full"
          >
            <img
              className="h-full w-full object-cover object-center"
              src={img.src}
              alt={`gallery-${i}`}
            />
          </div>
        ))}
      </div>

      {/* ── Mobile: snap carousel ── */}
      <div className="md:hidden mt-8 relative">
        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.gallery-scroll::-webkit-scrollbar { display: none; }`}</style>
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-scroll snap-center flex-shrink-0 w-[75vw] h-64 rounded-2xl overflow-hidden"
            >
              <img
                className="w-full h-full object-cover object-center"
                src={img.src}
                alt={`gallery-${i}`}
              />
            </div>
          ))}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {GALLERY_IMAGES.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full bg-gray-300`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── LOGO MARQUEE ─────────────────────────────────────────────────────────────

const LogoMarquee = () => (
  <section className="py-8 px-6 md:px-16 lg:px-24 xl:px-32">
    <p className="text-center text-sm text-gray-400 mb-6 tracking-widest uppercase">As seen in</p>
    <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
      <style>{`
        .marquee-inner { animation: marqueeScroll linear infinite; }
        @keyframes marqueeScroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
      `}</style>
      <div
        className="marquee-inner flex will-change-transform min-w-[200%]"
        style={{ animationDuration: '15s' }}
      >
        <div className="flex items-center">
          {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, i) => (
            <img
              key={i}
              src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
              alt={company}
              className="h-8 mx-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition"
              draggable={false}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>
  </section>
);

// ─── NEW ARRIVALS GRID ────────────────────────────────────────────────────────

const NewArrivals = () => (
  <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
      .font-poppins { font-family: 'Poppins', sans-serif; }
    `}</style>
    <h1 className="text-3xl font-medium text-slate-800 text-center mb-2 font-poppins">
      New Arrivals
    </h1>
    <p className="text-slate-600 mb-10 font-poppins text-center">
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
          <p className="text-sm mt-2 font-poppins">White Crew-Neck T-Shirt</p>
          <p className="text-xl font-poppins">{item.price}</p>
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
  product: any;
  onSelect: (product: any) => void;
  onAddToCart: (product: any) => void;
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
  activeAccent,
}: {
  onSelectProduct: (product: any) => void;
  onAddToCart: (product: any) => void;
  activeAccent: string;
}) => {
  const [activeCategory, setActiveCategory] = useState('Todo');

  const filtered =
    activeCategory === 'Todo' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <h2 className="text-2xl font-medium text-center mb-6">All Products</h2>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-sm border rounded-full transition cursor-pointer ${
              activeCategory === cat
                ? 'text-white border-indigo-500'
                : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-500'
            }`}
            style={activeCategory === cat ? { backgroundColor: activeAccent } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
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
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}) => {
  const [selectedImg, setSelectedImg] = useState(0);

  if (!product) return null;

  return (
    <div className="max-w-6xl w-full px-6 py-10 mx-auto">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-6">
        <span>Home</span> / <span>Products</span> / <span>{product.category}</span> /{' '}
        <span className="text-indigo-500">{product.name}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-xs text-indigo-500 underline cursor-pointer"
          >
            ← Back
          </button>
        )}
      </p>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.images?.map((img: any, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`border max-w-24 rounded overflow-hidden cursor-pointer transition ${
                  selectedImg === i ? 'border-indigo-500' : 'border-gray-500/30'
                }`}
              >
                <img src={img} alt={`thumb-${i}`} />
              </div>
            ))}
          </div>
          {/* Main image */}
          <div className="border border-gray-500/30 max-w-xs rounded overflow-hidden">
            <img src={product.images[selectedImg]} alt={product.name} />
          </div>
        </div>

        {/* Info */}
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

// ─── FOOTER ───────────────────────────────────────────────────────────────────

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

// ─── CART TOAST ───────────────────────────────────────────────────────────────

const CartToast = ({ message, visible }: { message: string; visible: boolean }) => (
  <div
    className={`fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-5 py-3 rounded-lg shadow-lg transition-all duration-300 z-50 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    {message}
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function TemplateModernDemo({
  accent,
  personalizacion,
}: {
  accent?: string;
  personalizacion?: any;
}) {
  const temaConfig = personalizacion?.temaConfig || {};
  const activeAccent = temaConfig.color_primario || accent || '#0ea5e9';
  const heroTitulo = temaConfig.hero_titulo || 'Nuevas Llegadas en la Colección De Primavera';
  const heroSubtitulo =
    temaConfig.hero_subtitulo ||
    'Descubre los últimos estilos que elevan tu aspecto cotidiano. Desde piezas atemporales hasta tendencias modernas, tenemos lo necesario.';
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handleAddToCart = (product: any) => {
    setCart((prev: any) => [...prev, product] as any);
    showToast(`✓ ${product.name} added to cart`);
  };

  const sections = personalizacion?.sections || [];
  const hideHero = sections.find((s: any) => s.id === 1 && !s.enabled);
  const hideFeatured = sections.find((s: any) => s.id === 2 && !s.enabled);
  const hideTestimonials = sections.find((s: any) => s.id === 3 && !s.enabled);
  const hideNewsletter = sections.find((s: any) => s.id === 4 && !s.enabled);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar/Header */}
      <Header
        cartCount={cart.length}
        onCartClick={() => showToast(`🛒 ${cart.length} items in cart`)}
        activeAccent={activeAccent}
      />

      {selectedProduct ? (
        // ── Product Detail View ──
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      ) : (
        // ── Main Store View ──
        <>
          {!hideHero && <HeroGallery />}
          {!hideFeatured && (
            <>
              <LogoMarquee />
              <NewArrivals />
              <ProductsSection onSelectProduct={setSelectedProduct} onAddToCart={handleAddToCart} />
            </>
          )}
        </>
      )}

      <Footer />
      <CartToast visible={toast.visible} message={toast.message} />
    </div>
  );
}
