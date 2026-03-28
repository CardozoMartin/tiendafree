// ─── EDITOR TYPES ─────────────────────────────────────────────────────────────
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

// ─── PRODUCT TYPES ────────────────────────────────────────────────────────────
export interface Product {
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

export interface CartItem extends Product {
  qty: number;
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

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
export const CATEGORIES = ['Todo', 'Camisas', 'Zapatos', 'Accesorios', 'Pantalones', 'Vestidos'];

export const BRANDS = [
  { name: 'Intel', logo: 'https://cdn.simpleicons.org/intel/0068B5' },
  { name: 'AMD', logo: 'https://cdn.simpleicons.org/amd/ED1C24' },
  { name: 'NVIDIA', logo: 'https://cdn.simpleicons.org/nvidia/76B900' },
  { name: 'Logitech', logo: 'https://cdn.simpleicons.org/logitech/00B8FC' },
  { name: 'Corsair', logo: 'https://cdn.simpleicons.org/corsair/FFFFFF' },
  { name: 'Asus', logo: 'https://cdn.simpleicons.org/asus/00539B' },
  { name: 'MSI', logo: 'https://cdn.simpleicons.org/msi/FF0000' },
  { name: 'Razer', logo: 'https://cdn.simpleicons.org/razer/00FF00' },
  { name: 'Samsung', logo: 'https://cdn.simpleicons.org/samsung/1428A0' },
  { name: 'Kingston', logo: 'https://cdn.simpleicons.org/kingston/E2001A' },
  { name: 'Western Digital', logo: 'https://cdn.simpleicons.org/westerndigital/0079BE' },
  { name: 'Seagate', logo: 'https://cdn.simpleicons.org/seagate/6EAB3D' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Camisa Lino Blanca',
    category: 'Camisas',
    price: 59,
    mrp: 80,
    rating: 4,
    reviews: 12,
    badge: 'Nuevo',
    description: 'Camisa de lino premium, fresca y cómoda. Perfecta para el día a día con un toque de elegancia natural.',
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
    description: 'Vestido fluido de corte midi, ideal para días cálidos. Tela liviana con caída perfecta.',
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
    description: 'Pantalón cargo moderno con bolsillos laterales. Corte recto, tela de algodón resistente.',
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
    description: 'Mocasines de cuero genuino con suela de cuero. Acabado artesanal, máximo confort.',
    images: [
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png',
      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png',
    ],
  },
];
