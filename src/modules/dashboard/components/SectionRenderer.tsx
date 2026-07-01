import { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import OrdersSection from '../components/OrdersSection';
import ProductsSection from '../components/ProductsSection';
import CreateShop from './CreateShop';
import EditorSitio from './myShop/EditorSitio';
import MethodsSection from './myShop/MethodsSection';
import SettingsSection from './SettingsSection';
import DominioSection from './DominioSection';
import MarketingSection from './MarketingSection';
import CmAiSection from './CmAiSection';
import BannerCreatorSection from './BannerCreatorSection';
import ReviewsSection from './ReviewsSection';
import AdminSection from './AdminSection';
import ClientesSection from './ClientesSection';
import AnalyticsSection from './AnalyticsSection';
import CuponesSection from './CuponesSection';
import BannerPromoSection from './BannerPromoSection';

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
      return isActiveShop ? <EditorSitio tienda={myShop} /> : <CreateShop accent={accent} />;
    case 'store-methods':
      return <MethodsSection accent={accent} />;
    case 'store-website':
      return null; // Solo abre nueva pestaña, no renderiza nada
    case 'cm-ai':
      return <CmAiSection accent={accent} tienda={myShop} />;
    case 'banner-creator':
      return <BannerCreatorSection accent={accent} tienda={myShop} />;
    case 'clientes':
      return <ClientesSection />;
    case 'analytics':
      return <AnalyticsSection accent={accent} />;
    case 'cupones':
      return <CuponesSection accent={accent} />;
    case 'banner-promo':
      return <BannerPromoSection accent={accent} />;
    case 'reviews':
      return <ReviewsSection accent={accent} tienda={myShop} />;
    case 'settings':
      return <SettingsSection accent={accent} />;
    case 'dominio':
      return <DominioSection accent={accent} />;
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
