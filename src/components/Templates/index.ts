import TemplateAccesoriosDemo from "./TemplateAccesoriosDemo";
import TemplateGorrasDemo from "./TemplateGorrasDemo";
import TemplateRopaDemo from "./TemplateRopaDemo";

export const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_accesorios: TemplateAccesoriosDemo,
  plantilla_gorras: TemplateGorrasDemo,
  plantilla_ropa: TemplateRopaDemo,
};

export const DEMO_ROUTES: Record<string, string> = {
  plantilla_accesorios: '/demo/accesorios',
  plantilla_gorras: '/demo/gorras',
  plantilla_ropa: '/demo/ropa'
};
