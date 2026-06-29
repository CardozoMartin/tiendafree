import { lazy, Suspense, useEffect } from 'react';

const HomeSection        = lazy(() => import('../components/HomeSection'));
const OrdersSection      = lazy(() => import('../components/OrdersSection'));
const ProductsSection    = lazy(() => import('../components/ProductsSection'));
const CreateShop         = lazy(() => import('./CreateShop'));
const EditingSite        = lazy(() => import('./myShop/EditingSite'));
const MethodsSection     = lazy(() => import('./myShop/MethodsSection'));
const Templates          = lazy(() => import('./myShop/Templates'));
const SettingsSection    = lazy(() => import('./SettingsSection'));
const CmAiSection        = lazy(() => import('./CmAiSection'));
const BannerCreatorSection = lazy(() => import('./BannerCreatorSection'));
const ReviewsSection     = lazy(() => import('./ReviewsSection'));
const AdminSection       = lazy(() => import('./AdminSection'));
const ClientesSection    = lazy(() => import('./ClientesSection'));
const AnalyticsSection   = lazy(() => import('./AnalyticsSection'));
const CuponesSection     = lazy(() => import('./CuponesSection'));
const BannerPromoSection = lazy(() => import('./BannerPromoSection'));

const SectionFallback = () => (
  <div className="flex items-center justify-center h-48">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
  </div>
);

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

  let section: React.ReactNode;

  switch (active) {
    case 'home':
      section = <HomeSection accent={accent} onNavigate={setActive} />;
      break;
    case 'products':
      section = <ProductsSection accent={accent} />;
      break;
    case 'orders':
      section = <OrdersSection accent={accent} />;
      break;
    case 'store':
    case 'store-templates':
      section = isActiveShop ? <Templates accent={accent} /> : <CreateShop accent={accent} />;
      break;
    case 'store-edit':
      section = isActiveShop ? <EditingSite tienda={myShop} /> : <CreateShop accent={accent} />;
      break;
    case 'store-methods':
      section = <MethodsSection accent={accent} />;
      break;
    case 'store-website':
      return null;
    case 'cm-ai':
      section = <CmAiSection accent={accent} tienda={myShop} />;
      break;
    case 'banner-creator':
      section = <BannerCreatorSection accent={accent} tienda={myShop} />;
      break;
    case 'clientes':
      section = <ClientesSection />;
      break;
    case 'analytics':
      section = <AnalyticsSection accent={accent} />;
      break;
    case 'cupones':
      section = <CuponesSection accent={accent} />;
      break;
    case 'banner-promo':
      section = <BannerPromoSection accent={accent} />;
      break;
    case 'reviews':
      section = <ReviewsSection accent={accent} tienda={myShop} />;
      break;
    case 'settings':
      section = <SettingsSection accent={accent} />;
      break;
    case 'admin':
      section = <AdminSection accent={accent} />;
      break;
    default:
      section = <HomeSection accent={accent} onNavigate={setActive} />;
  }

  return <Suspense fallback={<SectionFallback />}>{section}</Suspense>;
};

export default SectionRenderer;
