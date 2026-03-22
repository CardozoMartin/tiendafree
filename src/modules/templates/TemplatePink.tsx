import RuntimeTemplatePink from './templatePink/TemplatePink';

interface TemplatePinkProps {
  tienda?: unknown;
  tema?: unknown;
  accent?: string;
  personalizacion?: unknown;
}

const TemplatePink = (props: TemplatePinkProps) => {
  return <RuntimeTemplatePink {...props} />;
};

export default TemplatePink;
