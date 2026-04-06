import banner1 from '../../../assets/banners/banner1.png';
import bannerDegrade from '../../../assets/banners/Banner_Degrade.png';
import bannerPastel from '../../../assets/banners/Banner_Pastel.png';

export interface ElementPosition {
  x: number; // % o px
  y: number; // % o px
  width?: number; // % o px (ancho del contenedor)
  fontSize?: number; // px para textos
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string; // límite de ancho
  color?: string; // color del texto
}

export interface BannerLayout {
  storeName: ElementPosition;
  productImage: ElementPosition;
  productName: ElementPosition;
  productDesc: ElementPosition;
  priceContainer: ElementPosition;
  ctaBadge: ElementPosition;
}

export interface BannerConfig {
  id: string;
  name: string;
  image: string;
  layout: BannerLayout;
  description: string;
}

/**
 * BANNERS CONFIGURATION
 * Cada banner tiene sus propias posiciones para los elementos.
 * Puedes ajustar los valores de x, y, fontSize, width, etc.
 *
 * UNIDADES: % (porcentaje del contenedor) o px (píxeles)
 */

export const BANNER_CONFIGS: Record<string, BannerConfig> = {
  banner1: {
    id: 'banner1',
    name: '📷 Imagen Natural',
    image: banner1,
    description: 'Perfecta para fotos de producto',
    layout: {
      storeName: {
        x: 20,
        y: 10,
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'left',
      },
      productImage: {
        x: 28,
        y: 50,
        width: 15,
      },
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
      priceContainer: {
        x: 55,
        y: 65,
        fontSize: 24,
        color: '#FFD700',
        textAlign: 'left',
      },
      ctaBadge: {
        x: 80,
        y: 10,
        fontSize: 14,
        backgroundColor: '$accent',
        color: '#ffffff',
        textAlign: 'center',
      },
    },
  },

  degrade: {
    id: 'degrade',
    name: '🌈 Gradiente Suave',
    image: bannerDegrade,
    description: 'Colores degradados armoniosos',
    layout: {
      storeName: {
        x: 5,
        y: 5,
        fontSize: 10,
        color: '#ffffff',
        textAlign: 'left',
      },
      productImage: {
        x: 80,
        y: 50,
        width: 22,
      },
      productName: {
        x: 8,
        y: 22,
        fontSize: 24,
        maxWidth: '520px',
        color: '#ffffff',
        textAlign: 'left',
      },
      productDesc: {
        x: 58,
        y: 42,
        fontSize: 14,
        maxWidth: '480px',
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'left',
      },
      priceContainer: {
        x: 58,
        y: 64,
        fontSize: 26,
        color: '#FFD700',
        textAlign: 'left',
      },
      ctaBadge: {
        x: 68,
        y: 80,
        fontSize: 7,
        color: '#ffffff',
        textAlign: 'center',
      },
    },
  },

  pastel: {
    id: 'pastel',
    name: '🎨 Pastel Minimalista',
    image: bannerPastel,
    description: 'Colores suaves y elegantes',
    layout: {
      storeName: {
        x: 4,
        y: 10,
        fontSize: 19,
        color: '#ffff',
        textAlign: 'left',
      },
      productImage: {
        x: 82,
        y: 42,
        width: 35,
      },
      productName: {
        x: 4,
        y: 20,
        fontSize: 22,
        maxWidth: '510px',
        color: '#ffff',
        textAlign: 'left',
      },
      productDesc: {
        x: 54,
        y: 40,
        fontSize: 13,
        maxWidth: '470px',
        color: '#ffff',
        textAlign: 'left',
      },
      priceContainer: {
        x: 54,
        y: 85,
        fontSize: 24,
        color: '#FF6B9D',
        textAlign: 'left',
      },
      ctaBadge: {
        x: 76,
        y: 10,
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center',
      },
    },
  },
};

export const BANNER_LIST = Object.values(BANNER_CONFIGS);
