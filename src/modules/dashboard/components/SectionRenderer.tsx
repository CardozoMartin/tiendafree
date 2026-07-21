import { useEffect, useState } from 'react';
import HomeSection from '../components/HomeSection';
import OrdersSection from '../components/OrdersSection';
import ProductsSection from '../components/ProductsSection';
import CreateShop from './CreateShop';
import OnboardingWelcome from './OnboardingWelcome';
import EditorSitio from './myShop/EditorSitio';
import MethodsSection from './myShop/MethodsSection';
import SettingsSection from './SettingsSection';
// import DominioSection from './DominioSection'; // oculto temporalmente: falta pulir
import MarketingSection from './MarketingSection';
// import CmAiSection from './CmAiSection'; // oculto temporalmente: falta pulir
import AsistenteSection from './AsistenteSection';
import BannerCreatorSection from './BannerCreatorSection';
import ReviewsSection from './ReviewsSection';
import AdminSection from './AdminSection';
import ClientesSection from './ClientesSection';
import AnalyticsSection from './AnalyticsSection';
import CuponesSection from './CuponesSection';
import PromocionesSection from './PromocionesSection';
import RevocacionesSection from './RevocacionesSection';
import LegalSection from './LegalSection';
import BannerPromoSection from './BannerPromoSection';
import disenoImg from '../../../assets/onboarding/diseño tienda.png';

interface SectionRendererProps {
  active: string;
  accent: string;
  setAccent: (color: string) => void;
  isActiveShop?: boolean;
  myShop?: any;
  setActive?: (section: string) => void;
}

export const SectionRenderer = ({
  active,
  accent,
  isActiveShop = false,
  myShop,
  setActive,
}: SectionRendererProps) => {
  const myShopSlug = myShop?.slug ?? myShop?.datos?.slug;

  // Bienvenida (onboarding) previa al formulario de crear tienda.
  // Se muestra mientras el usuario no tenga tienda; al tocar "Comenzar ahora"
  // se revela el formulario CreateShop.
  const [onboardingStarted, setOnboardingStarted] = useState(false);

  // Portada "Diseñá tu tienda": se muestra al entrar a la sección de diseño y,
  // al tocar el CTA, revela el EditorSitio. Se resetea cada vez que se sale y
  // vuelve a la sección de diseño (por eso depende de `active`).
  const [designStarted, setDesignStarted] = useState(false);
  const isDesignSection =
    active === 'store' || active === 'store-templates' || active === 'store-edit';
  useEffect(() => {
    if (!isDesignSection) setDesignStarted(false);
  }, [isDesignSection]);

  useEffect(() => {
    if (active === 'store-website' && myShopSlug) {
      window.open(`https://apptiendizi.netlify.app/${myShopSlug}`, '_blank');
    }
  }, [active, myShopSlug]);

  switch (active) {
    case 'home':
      return <HomeSection accent={accent} onNavigate={setActive} />;
    case 'products':
      return <ProductsSection accent={accent} />;
    case 'orders':
      return <OrdersSection accent={accent} />;
    case 'store':
    case 'store-templates':
    case 'store-edit':
      if (isActiveShop) {
        // Portada de diseño → al tocar el CTA se muestra el editor.
        return designStarted ? (
          <EditorSitio tienda={myShop} />
        ) : (
          <OnboardingWelcome
            accent={accent}
            image={disenoImg}
            title={
              <>
                Diseñá tu <span style={{ color: accent }}>tienda</span>
              </>
            }
            description="Personalizá cada sección: colores, imágenes, textos y más."
            subDescription="Hacé que tu tienda tenga tu estilo y se destaque."
            buttonLabel="Diseñar tienda"
            buttonIcon="brush"
            onStart={() => setDesignStarted(true)}
          />
        );
      }
      return onboardingStarted ? (
        <CreateShop accent={accent} />
      ) : (
        <OnboardingWelcome accent={accent} onStart={() => setOnboardingStarted(true)} />
      );
    case 'store-methods':
      return <MethodsSection accent={accent} />;
    case 'store-website':
      return null; // Solo abre nueva pestaña, no renderiza nada
    // case 'cm-ai': // oculto temporalmente: falta pulir
    //   return <CmAiSection accent={accent} tienda={myShop} />;
    case 'asistente':
      return <AsistenteSection accent={accent} />;
    case 'banner-creator':
      return <BannerCreatorSection accent={accent} tienda={myShop} />;
    case 'clientes':
      return <ClientesSection />;
    case 'analytics':
      return <AnalyticsSection accent={accent} />;
    case 'cupones':
      return <CuponesSection accent={accent} />;
    case 'promociones':
      return <PromocionesSection accent={accent} />;
    case 'banner-promo':
      return <BannerPromoSection accent={accent} />;
    case 'reviews':
      return <ReviewsSection accent={accent} tienda={myShop} />;
    case 'revocaciones':
      return <RevocacionesSection accent={accent} />;
    case 'legal':
      return <LegalSection accent={accent} />;
    case 'settings':
      return <SettingsSection accent={accent} />;
    // case 'dominio': // oculto temporalmente: falta pulir
    //   return <DominioSection accent={accent} />;
    // 'email-config' se mantiene por compatibilidad con links viejos; ahora
    // ambos (config + campañas) viven en MarketingSection.
    case 'email-config':
    case 'campanas':
      return <MarketingSection accent={accent} />;
    case 'admin':
      return <AdminSection accent={accent} />;
    default:
      return <HomeSection accent={accent} onNavigate={setActive} />;
  }
};

export default SectionRenderer;
