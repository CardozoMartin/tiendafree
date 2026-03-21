import { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import OrdersSection from '../components/OrdersSection';
import ProductsSection from '../components/ProductsSection';
import CreateShop from './CreateShop';
import EditingSite from './myShop/EditingSite';
import Plantillas from './myShop/Plantillas';
import SettingsSection from './SettingsSection';
import StoreSection from './StoreSection';

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
  setAccent,
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
      return <Plantillas />;
    case 'store-edit':
      return isActiveShop ? <EditingSite /> : <CreateShop />;
    case 'store-website':
      return isActiveShop ? <StoreSection accent={accent} setAccent={setAccent} /> : <CreateShop />;
    case 'settings':
      return <SettingsSection accent={accent} />;
    default:
      return <HomeSection accent={accent} />;
  }
};

export default SectionRenderer;
