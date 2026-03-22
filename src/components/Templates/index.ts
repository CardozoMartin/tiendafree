import TemplateModernDemo from "./TemplateModernDemo";
import TemplatePinkDemo from "./TemplatePinkDemo";


export const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_comun: TemplateModernDemo,
  plantilla_pink: TemplatePinkDemo
};

export const DEMO_ROUTES: Record<string, string> = {
  plantilla_comun: '/demo/moderna',
  plantilla_pink: '/demo/pink'
};
