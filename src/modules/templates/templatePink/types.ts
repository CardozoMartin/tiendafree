export interface Product {
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

export interface CartItem extends Product {
  qty: number;
}

export interface CarruselItem {
  id?: number;
  url: string;
  titulo?: string | null;
  subtitulo?: string;
  linkUrl?: string | null;
  orden?: number;
  activa?: boolean;
}

export interface ThemeConfig {
  primary: string;
  accent: string;
  modoOscuro: boolean;
  background?: string;
  text?: string;
  buttonBg?: string;
  buttonText?: string;
  navbarBg?: string;
  navbarText?: string;
  navbarStyle?: string;
  heroCtaTexto?: string;
  seccionesVisibles?: Record<string, boolean>;
  cardMostrarPrecio?: boolean;
  cardMostrarBadge?: boolean;
  heroTitulo?: string;
  heroSubtitulo?: string;
}

export const PRODUCTS: Product[] = [
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
