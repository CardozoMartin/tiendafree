//--- Types de navbar
export type NavbarTarget = 'inicio' | 'producto' | 'contacto' | 'sobrenosotros';

export interface NavbarProps {
  cartCount: number;
  onCart: () => void;
  logo?: string;
  titulo?: string;
  onIngresar: () => void;
  onMiCuenta: () => void;
  onNavigate: (target: NavbarTarget) => void;
}

// --- Types generales de la tienda
export interface CategoriaProducto {
  id: number;
  nombre: string;
}

export interface MetodoEntregaItem {
  metodoEntrega: {
    id: number;
    nombre: string;
  };
}

export interface MetodoPagoItem {
  metodoPago: {
    id: number;
    nombre: string;
  };
}

export interface ProductoVariante {
  id: number;
  nombre: string;
  sku?: string;
  precioExtra?: number | string;
  imagenUrl?: string;
  disponible?: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenPrincipalUrl?: string;
  imagen?: string;
  imagenes?: Array<{ id?: number; url: string; orden?: number }>;
  precio?: number | string;
  precioOferta?: number | string;
  destacado?: boolean;
  categoria?: CategoriaProducto;
  variantes?: ProductoVariante[];
}

export interface CarritoItem {
  id: number;
  cantidad: number;
  precioUnit: number | string;
  producto: Producto;
}

export interface Carrito {
  items: CarritoItem[];
  total?: number | string;
  cantidad?: number | string;
}

export interface Tienda {
  id?: number;
  nombre?: string;
  titulo?: string;
  tituloDos?: { primera: string; segunda: string };
  descripcion?: string;
  whatsapp?: string;
  instagram?: string;
  ciudad?: string;
  provincia?: string;
  logoUrl?: string;
  metodosEntrega?: MetodoEntregaItem[];
  metodosPago?: MetodoPagoItem[];
  carrusel?: HeroSlide[];
}

//Hero types

export interface HeroSlide {
  url?: string;
  img?: string;
  label?: string;
  subtitulo?: string;
  titulo?: string;
  descripcion?: string;
}

export interface IHeroProps {
  titulo?: string;
  descripcion?: string;
  imagenCarrusel?: HeroSlide[];
  tituloDos?: { primera: string; segunda: string };
  acento?: string;
  txtColor?: string;
  btnTextColor?: string;
  bgColor?: string;
  mutedColor?: string;
  whatsapp?: string;
}

//types de CartDrawer
export interface ThemeProps {
  bg?: string;
  surface?: string;
  surface2?: string;
  txt?: string;
  muted?: string;
  subtle?: string;
  border?: string;
  acento?: string;
  btnTxt?: string;
}

//types Toast
export interface ToastProps {
  msg: string;
  visible: boolean;
  imagen?: string;
  nombre?: string;
  precio?: number | string;
  acento?: string;
  bg?: string;
  txt?: string;
}

//types FormLogin
export interface LoginData {
  email: string;
  password: string;
  tiendaId: number;
}

export interface FormLoginProps {
  tiendaNombre: string;
  onGoRegistro: () => void;
  onGoOlvide: () => void;
}

//types Footer
export interface IFooterProps {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  descripcion?: string;
  ciudad?: string;
  pais?: string;
  acento?: string;
  nombreTienda?: string;
}

//types AboutUs
export interface AboutUsProps {
  descripcion?: string;
  ciudad?: string;
  provincia?: string;
  instagram?: string;
  acento?: string;
  bg?: string;
  border?: string;
  txt?: string;
  muted?: string;
}

//types FormRegistro
export interface FormRegistroProps {
  tiendaNombre: string;
  onGoLogin: () => void;
}

//types contacto

export interface ContactProps {
  tienda?: Tienda;
  theme?: ThemeProps;
}
