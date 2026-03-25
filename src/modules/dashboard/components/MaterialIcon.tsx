// ── Shared Material Icon Component ─────────────────────────────────────────
export const MI = ({
  name,
  className = '',
  style = {},
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", ...style }}
  >
    {name}
  </span>
);

export default MI;
