import { Navigate, useParams } from 'react-router-dom';
import TemplateAccesoriosDemo from '../demos/TemplateAccesoriosDemo';
import TemplateGorrasDemo from '../demos/TemplateGorrasDemo';
import TemplateRopaDemo from '../demos/TemplateRopaDemo';
import UrbanTiendzi from '../urban/UrbanTiendzi';

const DEMO_MAP: Record<string, string> = {
  accesorios: 'plantilla_accesorios',
  gorras: 'plantilla_gorras',
  ropa: 'plantilla_ropa',
  urban: 'plantilla_urban',
};

const DEMO_TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_accesorios: TemplateAccesoriosDemo,
  plantilla_gorras: TemplateGorrasDemo,
  plantilla_ropa: TemplateRopaDemo,
  plantilla_urban: UrbanTiendzi,
};

const DemoStorePage = () => {
  const { nombre } = useParams<{ nombre: string }>();
  const templateKey = DEMO_MAP[nombre!];
  const Template = templateKey ? DEMO_TEMPLATES[templateKey] : null;

  if (!Template) return <Navigate to="/" replace />;

  // El template tiene todo hardcodeado adentro, no necesita props
  return <Template />;
};

export default DemoStorePage;
