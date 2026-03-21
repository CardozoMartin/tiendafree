import TemplateModern from "./TemplateModer";


const TEMPLATES: Record<string, React.ComponentType<any>> = {
  plantilla_comun: TemplateModern,
  // plantilla_elegante: TemplateElegant,  ← escalable
};

interface StoreRendererProps {
  tienda: any;
}

const StoreRenderer = ({ tienda }: StoreRendererProps) => {
  const Template = TEMPLATES[tienda.plantilla.nombre] ?? TemplateModern;
  const tema = tienda.temaConfig;

  return (
    <Template
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
