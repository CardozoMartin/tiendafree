export interface IShopData {
  // Datos generales
  nombre: string;
  titulo: string;
  descripcion: string;
  rubro?: string;
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

  // Datos legales del vendedor
  razonSocial?: string;
  cuit?: string;
  domicilioLegal?: string;

  // Campos de tema (endpoint /tema/)
  colorAcento?: string;
  modoOscuro?: boolean;
  navbarStyle?: string;
  navbarVariante?: 'CLASICO' | 'PILL' | 'BOUTIQUE' | 'BRASILIA';
  navbarColorTema?: 'CLARO' | 'OSCURO';
  cardVariante?: 'CLASICO' | 'MODERNO' | 'BRASILIA';
  footerVariante?: 'CENTRADO' | 'COLUMNAS' | 'BRASILIA';
  botonForma?: 'REDONDEADO' | 'CUADRADO';
  homeCategoriaFilas?: number[];
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroCtaTexto?: string;
  cardMostrarPrecio?: boolean;
  cardMostrarBadge?: boolean;
  tipoSeccionHero?: 'HERO_FIJO' | 'CARRUSEL' | 'GALERIA' | 'BANNER' | 'VIDEO' | 'BRASILIA';
  intervaloCarrusel?: number;
  seccionesVisibles?: Record<string, boolean>;
  fuenteKit?: string;
  categoriasDestacadasActivas?: boolean;
  categoriasDestacadasPosicion?: 'ANTES' | 'DESPUES';
}



