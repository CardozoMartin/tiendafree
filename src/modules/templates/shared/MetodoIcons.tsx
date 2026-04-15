export function normalizarMetodo(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

interface MetodoChipProps {
  nombre: string;
  className?: string;
  style?: React.CSSProperties;
  iconSize?: number;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export function MetodoChip({
  nombre,
  style,
  textColor = 'inherit',
  borderColor = 'rgba(0,0,0,0.08)',
  backgroundColor = 'transparent',
}: MetodoChipProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: `0.5px solid ${borderColor}`,
        background: backgroundColor,
        ...style,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: textColor === 'inherit' ? '#000' : textColor,
          opacity: 0.6,
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: textColor,
          whiteSpace: 'nowrap',
        }}
      >
        {nombre}
      </span>
    </div>
  );
}
