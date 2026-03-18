
import CreateShop from './CreateShop';
import HomeSection from './HomeSection';
import OrdersSection from './OrdersSection';
import ProductsSection from './ProductsSection';
import SettingsSection from './SettingsSection';
import StoreSection from './StoreSection';

interface SectionRendererProps {
  active: string;
  accent: string;
  setAccent: (color: string) => void;
  isActiveShop?: boolean;
}

export const SectionRenderer = ({
  active,
  accent,
  setAccent,
}: SectionRendererProps) => {

  const isActiveShop = false
  switch (active) {
    case 'home':
      return <HomeSection accent={accent} />;
    case 'products':
      return <ProductsSection accent={accent} />;
    case 'orders':
      return <OrdersSection accent={accent} />;
    case 'store':
      return isActiveShop ? <StoreSection accent={accent} setAccent={setAccent} /> : <CreateShop />;
    case 'settings':
      return <SettingsSection accent={accent} />;
    default:
      return <HomeSection accent={accent} />;
  }
};

export default SectionRenderer;
