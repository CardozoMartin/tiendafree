import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TextAnimatedProps {
  to?: string;
  label: string;
  className?: string;
  color?: string;
  hoverColor?: string;
  strokeColor?: string;
  fontSize?: string;
  fontWeight?: string;
  strokeWidth?: number;
  linea1?: string;
  linea2?: string;
  svgWidth?: string;
  svgHeight?: string;
  svgTranslateX?: string;
  svgTranslateY?: string;
}

const TextAnimated = ({
  to,
  label,
  className = '',
  color = '#6b7280',
  hoverColor = '#6344ee',
  strokeColor = '#fca326',
  fontSize = 'text-sm',
  fontWeight = 'font-bold',
  strokeWidth = 12,
  linea1 = 'M92,24 L10,24',
  linea2 = 'M8,38 L95,34',
  svgWidth = 'w-[120%]',
  svgHeight = 'h-[200%]',
  svgTranslateX = '-translate-x-[10%]',
  svgTranslateY = '-translate-y-[25%]',
}: TextAnimatedProps) => {
  const [hovered, setHovered] = useState(false);

  const contenido = (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center justify-center isolate cursor-pointer ${className}`}
    >
      <svg
        className={`absolute inset-0 -z-10 ${svgWidth} ${svgHeight} ${svgTranslateX} ${svgTranslateY}`}
        viewBox="0 0 100 48"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      >
        <path
          style={{
            stroke: strokeColor,
            strokeDasharray: 100,
            strokeDashoffset: hovered ? 0 : 100,
            transition: 'stroke-dashoffset 0.35s ease',
          }}
          className="opacity-90"
          d={linea1}
          pathLength="100"
        />
        <path
          style={{
            stroke: strokeColor,
            strokeDasharray: 100,
            strokeDashoffset: hovered ? 0 : 100,
            transition: 'stroke-dashoffset 0.45s ease 0.08s',
          }}
          className="opacity-80"
          d={linea2}
          pathLength="100"
        />
      </svg>
      <span
        className={`transition-colors duration-300 px-1 ${fontSize} ${fontWeight}`}
        style={{ color: hovered ? hoverColor : color }}
      >
        {label}
      </span>
    </span>
  );

  if (to) return <Link to={to}>{contenido}</Link>;
  return contenido;
};

export default TextAnimated;
