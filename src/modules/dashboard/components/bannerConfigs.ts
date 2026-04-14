import banner1 from '../../../assets/banners/banner1.png';
import bannerCyber from '../../../assets/banners/Banner_cyberMonday.png';
import bannerDegrade from '../../../assets/banners/Banner_Degrade.png';
import bannerPastel from '../../../assets/banners/Banner_Pastel.png';

export interface ElementPosition {
  x: number; // %
  y: number; // %
  width?: number; // %
  fontSize?: number; // px
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  color?: string;
  shadow?: string;
}

export interface BannerLayout {
  storeName: ElementPosition;
  productImages: ElementPosition[]; // Array para soportar múltiples imágenes
  productName: ElementPosition;
  productDesc: ElementPosition;
  priceContainer: ElementPosition;
  ctaBadge: ElementPosition;
}

export interface BannerConfig {
  id: string;
  name: string;
  category: 'BANNER' | 'CARD';
  width: number;
  height: number;
  image?: string; // Opcional (Cards pueden no tener)
  backgroundColor?: string;
  layout: BannerLayout;
  description: string;
}

export const BANNER_CONFIGS: Record<string, BannerConfig> = {
  // ── BANNERS (1200x628) ───────────────────────────────────────────────────
  banner1: {
    id: 'banner1',
    name: '📷 Imagen Natural',
    category: 'BANNER',
    width: 1200,
    height: 628,
    image: banner1,
    description: 'Perfecta para fotos de producto',
    layout: {
      storeName: { x: 20, y: 10, fontSize: 18, color: '#ffffff', textAlign: 'left' },
      productImages: [{ x: 28, y: 50, width: 22 }],
      productName: {
        x: 55,
        y: 30,
        fontSize: 32,
        maxWidth: '600px',
        color: '#ffffff',
        textAlign: 'left',
      },
      productDesc: {
        x: 55,
        y: 40,
        fontSize: 14,
        maxWidth: '500px',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'left',
      },
      priceContainer: { x: 55, y: 65, fontSize: 28, color: '#FFD700', textAlign: 'left' },
      ctaBadge: { x: 80, y: 10, fontSize: 14, color: '#ffffff', textAlign: 'center' },
    },
  },

  cyber: {
    id: 'cyber',
    name: '🚀 Cyber Modern',
    category: 'BANNER',
    width: 1200,
    height: 628,
    image: bannerCyber,
    description: 'Estilo tecnológico de alto impacto',
    layout: {
      storeName: {
        x: 50,
        y: 8,
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        shadow: '0 0 10px rgba(0,0,0,0.5)',
      },
      productImages: [{ x: 50, y: 55, width: 30 }],
      productName: {
        x: 50,
        y: 22,
        fontSize: 38,
        maxWidth: '800px',
        color: '#00f2ff',
        textAlign: 'center',
        shadow: '0 0 15px rgba(0,242,255,0.3)',
      },
      productDesc: {
        x: 50,
        y: 35,
        fontSize: 16,
        maxWidth: '600px',
        color: '#ffffff',
        textAlign: 'center',
      },
      priceContainer: { x: 50, y: 85, fontSize: 36, color: '#fff', textAlign: 'center' },
      ctaBadge: { x: 50, y: 72, fontSize: 16, color: '#000', textAlign: 'center' },
    },
  },

  degrade: {
    id: 'degrade',
    name: '🌈 Gradiente Suave',
    category: 'BANNER',
    width: 1200,
    height: 628,
    image: bannerDegrade,
    description: 'Colores degradados armoniosos',
    layout: {
      storeName: { x: 8, y: 8, fontSize: 12, color: '#ffffff', textAlign: 'left' },
      productImages: [{ x: 80, y: 50, width: 28 }],
      productName: {
        x: 10,
        y: 25,
        fontSize: 26,
        maxWidth: '500px',
        color: '#ffffff',
        textAlign: 'left',
      },
      productDesc: {
        x: 10,
        y: 40,
        fontSize: 14,
        maxWidth: '400px',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'left',
      },
      priceContainer: { x: 10, y: 70, fontSize: 32, color: '#FFD700', textAlign: 'left' },
      ctaBadge: { x: 80, y: 88, fontSize: 12, color: '#ffffff', textAlign: 'center' },
    },
  },

  multi_focus: {
    id: 'multi_focus',
    name: '📦 Multi Producto',
    category: 'BANNER',
    width: 1200,
    height: 628,
    image: bannerPastel,
    description: 'Ideal para mostrar 3 variantes',
    layout: {
      storeName: { x: 50, y: 6, fontSize: 16, color: '#333', textAlign: 'center' },
      productImages: [
        { x: 20, y: 50, width: 18 },
        { x: 50, y: 55, width: 22 },
        { x: 80, y: 50, width: 18 },
      ],
      productName: {
        x: 50,
        y: 18,
        fontSize: 24,
        maxWidth: '700px',
        color: '#333',
        textAlign: 'center',
      },
      productDesc: {
        x: 50,
        y: 88,
        fontSize: 12,
        maxWidth: '600px',
        color: '#666',
        textAlign: 'center',
      },
      priceContainer: { x: 50, y: 78, fontSize: 28, color: '#FF6B9B', textAlign: 'center' },
      ctaBadge: { x: 15, y: 12, fontSize: 12, color: '#fff', textAlign: 'center' },
    },
  },

  // ── CARDS (1080x1080) ────────────────────────────────────────────────────
  card_clean: {
    id: 'card_clean',
    name: '⬜ Card Minimal',
    category: 'CARD',
    width: 1080,
    height: 1080,
    backgroundColor: '#ffffff',
    description: 'Limpio y enfocado en el producto',
    layout: {
      storeName: { x: 10, y: 8, fontSize: 22, color: '#111', textAlign: 'left' },
      productImages: [{ x: 50, y: 45, width: 75 }],
      productName: {
        x: 50,
        y: 75,
        fontSize: 48,
        maxWidth: '900px',
        color: '#111',
        textAlign: 'center',
      },
      productDesc: {
        x: 50,
        y: 82,
        fontSize: 20,
        maxWidth: '800px',
        color: '#666',
        textAlign: 'center',
      },
      priceContainer: { x: 50, y: 92, fontSize: 52, color: '#000', textAlign: 'center' },
      ctaBadge: { x: 10, y: 8, fontSize: 20, color: '#fff', textAlign: 'left' },
    },
  },

  card_dark: {
    id: 'card_dark',
    name: '🖤 Card Premium',
    category: 'CARD',
    width: 1080,
    height: 1080,
    backgroundColor: '#111111',
    description: 'Elegante con contrastes fuertes',
    layout: {
      storeName: { x: 10, y: 8, fontSize: 18, color: '#fff', textAlign: 'left' },
      productImages: [{ x: 50, y: 40, width: 70 }],
      productName: {
        x: 10,
        y: 74,
        fontSize: 44,
        maxWidth: '900px',
        color: '#fff',
        textAlign: 'left',
      },
      productDesc: {
        x: 10,
        y: 82,
        fontSize: 18,
        maxWidth: '850px',
        color: '#888',
        textAlign: 'left',
      },
      priceContainer: { x: 10, y: 92, fontSize: 48, color: '#FFD700', textAlign: 'left' },
      ctaBadge: { x: 10, y: 8, fontSize: 18, color: '#fff', textAlign: 'left' },
    },
  },

  card_vibrant: {
    id: 'card_vibrant',
    name: '💜 Card Gradiente',
    category: 'CARD',
    width: 1080,
    height: 1080,
    backgroundColor: '#6c47ff',
    description: 'Moderno y llamativo',
    layout: {
      storeName: { x: 10, y: 8, fontSize: 20, color: '#fff', textAlign: 'left' },
      productImages: [{ x: 50, y: 42, width: 72 }],
      productName: {
        x: 50,
        y: 75,
        fontSize: 46,
        maxWidth: '900px',
        color: '#fff',
        textAlign: 'center',
      },
      productDesc: {
        x: 50,
        y: 82,
        fontSize: 22,
        maxWidth: '800px',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
      },
      priceContainer: { x: 50, y: 92, fontSize: 54, color: '#fff', textAlign: 'center' },
      ctaBadge: { x: 10, y: 8, fontSize: 22, color: '#000', textAlign: 'left' },
    },
  },
};

export const BANNER_LIST = Object.values(BANNER_CONFIGS);
