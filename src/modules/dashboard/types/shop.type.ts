export interface IShopData {
  // Datos generales
  nombre: string;
  titulo: string;
  descripcion: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  slug?: string;
  pais: string;
  provincia: string;
  ciudad: string;
  activa?: boolean;
  publica?: boolean;
  logoUrl?: string;

  // Campos de tema (endpoint /tema/)
  colorAcento?: string;
  modoOscuro?: boolean;
  navbarStyle?: string;
  navbarVariante?: 'CLASICO' | 'PILL';
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroCtaTexto?: string;
  cardMostrarPrecio?: boolean;
  cardMostrarBadge?: boolean;
  tipoSeccionHero?: 'HERO_FIJO' | 'CARRUSEL' | 'GALERIA' | 'BANNER' | 'VIDEO';
  intervaloCarrusel?: number;
  seccionesVisibles?: Record<string, boolean>;
}



