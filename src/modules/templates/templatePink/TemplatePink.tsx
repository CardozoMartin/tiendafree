import { useState } from 'react';

// ============================================================================
// 1. IMPORTACIÓN DE COMPONENTES (SECCIONES)
// ============================================================================
// Aquí importamos cada parte individual de la tienda.
// Separar en componentes hace que el código sea más ordenado y fácil de mantener.
import Navbar from './NavbarPink';
import Hero from './HeroPink';
import Gallery from './GalleryPink';
import ProductGrid from './ProductGrid';
import ProductDetail from './ProductDetailPink';
import Banner from './Banner';
import Footer from './FooterPink';

// Importamos el Carrito (separado en su propio archivo) y los datos tipados
import CartPink from './CartPink';
import type { Product, CartItem, ThemeConfig } from './types';
import { PRODUCTS } from './types';

// ============================================================================
// 2. INTERFACES Y TIPOS
// ============================================================================

interface CarruselItem {
  url?: string;
  src?: string;
}


export interface TemplatePinkProps {
  tienda?: any;
  tema?: any;
  accent?: string;         // Color principal (ej. para botones, textos destacados)
  fontFamily?: string;     // Tipografía seleccionada
  personalizacion?: any;
  themeConfig?: ThemeConfig;
}



// ============================================================================
// 4. FUNCIONES AUXILIARES
// ============================================================================
type View = 'home' | 'detail';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

// Validamos que un producto tenga las propiedades correctas
const isProduct = (value: unknown): value is Product => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.offerPrice === 'number' &&
    typeof value.image1 === 'string' &&
    typeof value.image2 === 'string' &&
    typeof value.category === 'string' &&
    typeof value.rating === 'number' &&
    Array.isArray(value.description)
  );
};



// ============================================================================
// 5. COMPONENTE PRINCIPAL (TEMPLATE PINK)
// ============================================================================
export default function TemplatePink(props: TemplatePinkProps = {}) {
  const accent = props.accent || '#e11d48'; // Color rosa oscuro por defecto si falla
  const { tienda = {}, tema = {}, themeConfig: temaConfig = {} } = props;

  // --- B. PREPARACIÓN DE SECCIONES (NUEVA LÓGICA POR OBJETO) ---
  const seccionesVisibles: Record<string, boolean> = (temaConfig.seccionesVisibles as any) || {};

  // --- C. TEXTOS PRINCIPALES ---
  // Prioriza los datos en modo edición (temaConfig) > datos del tema guardado > datos de la tienda > fallback
  const heroTitle =
    (typeof temaConfig.hero_titulo === 'string' && temaConfig.hero_titulo) ||
    (typeof tema.heroTitulo === 'string' && tema.heroTitulo) ||
    (typeof tienda.titulo === 'string' && tienda.titulo) ||
    'Tu belleza, tu esencia.';

  const heroSubtitle =
    (typeof temaConfig.hero_subtitulo === 'string' && temaConfig.hero_subtitulo) ||
    (typeof tema.heroSubtitulo === 'string' && tema.heroSubtitulo) ||
    (typeof tienda.descripcion === 'string' && tienda.descripcion) ||
    'Cosméticos de alta calidad formulados con ingredientes naturales. Porque cada persona merece brillar a su manera.';

  const brandName = (typeof tienda.nombre === 'string' && tienda.nombre) || 'LUMÉ';

  const galleryImages = Array.isArray(tienda.carrusel)
    ? (tienda.carrusel as CarruselItem[])
        .map((item) => item.url || item.src)
        .filter((item): item is string => typeof item === 'string' && item.length > 0)
    : [];

  const dynamicProducts = Array.isArray(tienda.productos) ? tienda.productos.filter(isProduct) : [];

  // --- D. ESTADOS (Navegación y Carrito) ---
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Funciones del Carrito
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };
  const updateQty = (id: number, qty: number) => setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  const removeItem = (id: number) => setCartItems((prev) => prev.filter((i) => i.id !== id));
  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const isDark = props.themeConfig?.modoOscuro ?? false; // Pink is light by default

  const theme: any = {
    primary: props.themeConfig?.primary || accent,
    accent: props.themeConfig?.accent || '#f59e0b',
    modoOscuro: isDark,
    background: isDark ? '#0d0d12' : '#ffffff',
    text: isDark ? '#f5f0e8' : '#1e293b',
    buttonBg: props.themeConfig?.primary || accent,
    buttonText: isDark ? '#0d0d12' : '#ffffff',
    navbarBg: 'transparent',
    navbarText: isDark ? '#f5f0e8' : '#1e293b',
    navbarStyle: props.themeConfig?.navbarStyle || 'TRANSPARENT',
    heroCtaTexto: props.themeConfig?.heroCtaTexto || 'Comprar ahora',
    heroTitulo: props.themeConfig?.heroTitulo || heroTitle,
    heroSubtitulo: props.themeConfig?.heroSubtitulo || heroSubtitle,
    cardMostrarPrecio: props.themeConfig?.cardMostrarPrecio ?? true,
    cardMostrarBadge: props.themeConfig?.cardMostrarBadge ?? true,
    seccionesVisibles: props.themeConfig?.seccionesVisibles || {
      hero: true,
      navbar: true,
      productos: true,
      galeria: true,
      contacto: true,
      footer: true
    }
  };

  // Visibilidad de cada componente (Sincronizado con seccionesVisibles del backend)
  const showHero = seccionesVisibles.hero !== false;
  const showGallery = seccionesVisibles.galeria !== false;
  const showProducts = seccionesVisibles.productos !== false;
  const showNavbar = seccionesVisibles.navbar !== false;
  const showFooter = seccionesVisibles.footer !== false;


  // ============================================================================
  // 6. RENDERIZADO DEL SITIO
  // ============================================================================
  return (
    // Agregamos la tipografía en el contenedor principal para que hereden todos los hijos
    <div
      className="min-h-screen transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: "'Poppins', sans-serif",
        // Variables CSS iniciales
        ['--primary-color' as any]: theme.primary,
        ['--accent-color' as any]: theme.accent,
        ['--button-bg' as any]: theme.buttonBg,
        ['--button-text' as any]: theme.buttonText,
        ['--navbar-bg' as any]: theme.navbarBg,
        ['--navbar-text' as any]: theme.navbarText,
        ['--site-bg' as any]: theme.background,
        ['--nav-text' as any]: theme.navbarText,
        ['--nav-hover' as any]: theme.primary,
    }}
    >
      {/* Aplicar fuente de título a encabezados mediante CSS inyectado */}
      <style>{`
        h1, h2, h3, h4, .font-title { font-family: 'Poppins', sans-serif !important; }

        .bg-primary { background-color: var(--primary-color) !important; }
        .text-primary { color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
        .btn-primary {
          background-color: var(--button-bg) !important;
          color: var(--button-text) !important;
        }

        /* Forzar transiciones en elementos clave */
        * { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important; }
        .nav-link-hover:hover { color: var(--nav-hover) !important; }
      `}</style>
      {/* Fuente nativa importada si fuera Poppins */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');`}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/*
        ------------------ SECCIÓN 1: NAVBAR (Menú Superior) ------------------
        Le pasamos el "accent" para colorear el botón de ingresar y textos.
      */}
      {showNavbar && (
        <Navbar
          onCartClick={() => setCartOpen(true)}
          cartCount={cartCount}
          onLogoClick={() => setView('home')}
          brandName={brandName}
          accent={theme.primary}
          bgColor={theme.navbarBg}
          navbarStyle={theme.navbarStyle?.toLowerCase() as any}
          navbarFixed={true}
        />
      )}

      {view === 'home' && (
        <>
          {/*
            ------------------ SECCIÓN 2: HERO (Portada) ------------------
            Aquí pasamos los textos clave y la función onChange para saber
            qué modificar en el modo "Edición"
          */}
          {showHero && (
            <Hero
              onShopClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              title={heroTitle}
              subtitle={heroSubtitle}
              accent={accent}
              heroCtaTexto={theme.heroCtaTexto}
              carrusel={(tienda.carrusel || []) as any}
            />
          )}

          {/*
            ------------------ SECCIÓN 3: GALERÍA ------------------
          */}
          {showGallery && (
            <Gallery
              imgs={galleryImages}
              accent={theme.primary}
            />
          )}

          {/*
            ------------------ SECCIÓN 4: PRODUCTOS ------------------
          */}
          {showProducts && (
            <div id="productos">
              <ProductGrid
                products={PRODUCTS.concat(dynamicProducts)}
                onView={(p) => {
                  setSelectedProduct(p);
                  setView('detail');
                }}
                onAddCart={addToCart}
                accent={accent}
                showPrice={theme.cardMostrarPrecio}
                showBadge={theme.cardMostrarBadge}
              />
            </div>
          )}

          <Banner accent={accent} />
        </>
      )}

      {/* Si se hizo clic en ver detalle de un producto... */}
      {view === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setView('home')}
          onAddCart={addToCart}
          accent={theme.primary}
          buttonBg={theme.buttonBg}
          buttonText={theme.buttonText}
        />
      )}

      {/*
        ------------------ SECCIÓN 5: FOOTER ------------------
      */}
      {showFooter && <Footer brandName={String(tienda?.nombre || 'LUMÉ')} />}

      {/*
        ------------------ MODAL: CARRITO ------------------
        Si 'cartOpen' es verdadero, renderizamos el carrito importado
      */}
      {cartOpen && (
        <CartPink
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          accent={theme.primary}
          buttonBg={theme.buttonBg}
          buttonText={theme.buttonText}
        />
      )}
    </div>
  );
}
