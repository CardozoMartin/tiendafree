import { useParams, Navigate } from 'react-router-dom';
import { TEMPLATES } from '../components/Templates';


const DEMO_MAP: Record<string, string> = {
  moderna: 'plantilla_comun',
  pink: 'plantilla_pink',
};

const DemoStorePage = () => {
  const { nombre } = useParams<{ nombre: string }>();
  const templateKey = DEMO_MAP[nombre!];
  const Template = templateKey ? TEMPLATES[templateKey] : null;

  if (!Template) return <Navigate to="/" replace />;

  // El template tiene todo hardcodeado adentro, no necesita props
  return <Template />;
};

export default DemoStorePage;
