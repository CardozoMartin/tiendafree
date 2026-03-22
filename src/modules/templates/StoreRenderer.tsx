import TemplateModern from './TemplateModer';
import TemplatePink from './TemplatePink';
import { resolveTemplateIdFromShop } from './registry';

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_comun: TemplateModern,
  plantilla_pink: TemplatePink,
  // plantilla_elegante: TemplateElegant,  ← escalable
};

interface StoreRendererProps {
  tienda: any;
}

const StoreRenderer = ({ tienda }: StoreRendererProps) => {
  const templateId = resolveTemplateIdFromShop(tienda);
  const Template = TEMPLATES[templateId] ?? TemplateModern;
  const tema = tienda.temaConfig;

  return (
    <Template
      tienda={tienda}
      tema={tema}
      accent={tema?.colorPrimario ?? '#6344ee'}
      personalizacion={{
        temaConfig: {
          color_primario: tema?.colorPrimario,
          hero_titulo: tema?.heroTitulo ?? tienda.titulo,
          hero_subtitulo: tema?.heroSubtitulo ?? tienda.descripcion,
        },
        sections: Object.entries(tema?.seccionesVisibles ?? {}).map(([key, enabled], i) => ({
          id: i + 1,
          key,
          enabled,
        })),
      }}
    />
  );
};

export default StoreRenderer;
