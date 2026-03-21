import TemplateModernDemo from "./TemplateModernDemo";


export const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_comun: TemplateModernDemo,
};

export const DEMO_ROUTES: Record<string, string> = {
  plantilla_comun: '/demo/moderna',
};
