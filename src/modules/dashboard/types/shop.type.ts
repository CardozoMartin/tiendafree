export interface IShopData {
  id?: number;
  slug?: string;
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  plantillaId?: number;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  pais?: string;
  provincia?: string;
  ciudad?: string;
  dominio?: string;
  configuracion?: {
    tagline?: string;
    logoUrl?: string;
  };
  metodosPago?: any[];
  metodosEntrega?: any[];
  datos?: Partial<IShopData>;
  heroTitulo?: string;
  heroSubtitulo?: string;
  carrusel?: any;
}



