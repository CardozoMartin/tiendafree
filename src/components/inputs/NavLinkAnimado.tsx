import { useState } from "react";
import { Link } from "react-router-dom";

const NavLinkAnimado = ({ to, label }: { to: string; label: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center text-sm font-semibold text-slate-600 isolate"
    >
      <svg
        className="absolute inset-0 -z-10 w-[120%] h-[200%] -translate-x-[5%] -translate-y-[20%]"
        viewBox="0 0 100 48"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
      >
        <path
          style={{
            stroke: '#fca326',
            strokeDasharray: 100,
            strokeDashoffset: hovered ? 0 : 100,
            transition: 'stroke-dashoffset 0.35s ease',
          }}
          className="opacity-90"
          d="M92,24 L10,24"
          pathLength="100"
        />
        <path
          style={{
            stroke: '#fca326',
            strokeDasharray: 100,
            strokeDashoffset: hovered ? 0 : 100,
            transition: 'stroke-dashoffset 0.45s ease 0.08s',
          }}
          className="opacity-80"
          d="M8,38 L95,34"
          pathLength="100"
        />
      </svg>
      <span
        className="transition-colors duration-300"
        style={{ color: hovered ? '#6344ee' : undefined }}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavLinkAnimado;
