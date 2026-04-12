import { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import OrdersSection from '../components/OrdersSection';
import ProductsSection from '../components/ProductsSection';
import CreateShop from './CreateShop';
import EditingSite from './myShop/EditingSite';
import MethodsSection from './myShop/MethodsSection';
import Templates from './myShop/Templates';
import SettingsSection from './SettingsSection';
import CmAiSection from './CmAiSection';
import BannerCreatorSection from './BannerCreatorSection';
import ReviewsSection from './ReviewsSection';

interface SectionRendererProps {
  active: string;
  accent: string;
  setAccent: (color: string) => void;
  isActiveShop?: boolean;
  myShop?: any;
}

export const SectionRenderer = ({
  active,
  accent,
  isActiveShop = false,
  myShop,
}: SectionRendererProps) => {
  const myShopSlug = myShop?.slug ?? myShop?.datos?.slug;

  useEffect(() => {
    if (active === 'store-website' && myShopSlug) {
      window.open(`/tienda/${myShopSlug}`, '_blank');
    }
  }, [active, myShopSlug]);

  switch (active) {
    case 'home':
      return <HomeSection accent={accent} />;
    case 'products':
      return <ProductsSection accent={accent} />;
    case 'orders':
      return <OrdersSection accent={accent} />;
    case 'store':
    case 'store-templates':
      return isActiveShop ? <Templates accent={accent} /> : <CreateShop accent={accent} />;
    case 'store-edit':
      return isActiveShop ? <EditingSite tienda={myShop} /> : <CreateShop accent={accent} />;
    case 'store-methods':
      return <MethodsSection accent={accent} />;
    case 'store-website':
      return null; // Solo abre nueva pestaña, no renderiza nada
    case 'cm-ai':
      return <CmAiSection accent={accent} tienda={myShop} />;
    case 'banner-creator':
      return <BannerCreatorSection accent={accent} tienda={myShop} />;
    case 'reviews':
      return <ReviewsSection accent={accent} tienda={myShop} />;
    case 'settings':
      return <SettingsSection accent={accent} />;
    default:
      return <HomeSection accent={accent} />;
  }
};

export default SectionRenderer;
