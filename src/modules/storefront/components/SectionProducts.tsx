import { useEffect, useState } from 'react';
import image from '../../../assets/image4.png'; // descomentá tu import
import product1 from '../../../assets/sectonProductos/img1.png';
import product2 from '../../../assets/sectonProductos/img2.png';
import product3 from '../../../assets/sectonProductos/img3.png';
import product4 from '../../../assets/sectonProductos/img4.png';
import product5 from '../../../assets/sectonProductos/img5.png';
import product6 from '../../../assets/sectonProductos/img6.png';
import product7 from '../../../assets/sectonProductos/img7.png';
import product8 from '../../../assets/sectonProductos/img8.png';

const PRODUCT_IMAGES = [
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
];

// ─── Centro del SVG ───
const CX = 400;
const CY = 400;
const IMG_R = 148; // radio de la imagen circular central
const NODE_R = 46; // radio de cada ícono satélite

// ─── Nodos satélite ───────────────────────────────────────────────────
// cx/cy     → centro del círculo del ícono en el viewBox (0 0 800 800)
// edgeX/edgeY → punto exacto en el borde de la imagen circular donde nace la línea
// bend      → coordenada intermedia del quiebre en L (puede haber 0, 1 o 2 quiebres)
//             formato: array de puntos {x, y} que forman los segmentos rectos
const nodes = [
  {
    id: 1,
    name: 'Laptops',
    img: product1,
    color: '#3b82f6',
    cx: 160,
    cy: 188,
    // sale izquierda, dobla arriba
    linePoints: [
      { x: CX - IMG_R, y: CY - 48 }, // borde imagen
      { x: 160, y: CY - 48 }, // quiebre horizontal
      { x: 160, y: 234 }, // llega al borde del nodo
    ],
  },
  {
    id: 2,
    name: 'Celulares',
    img: product2,
    color: '#a855f7',
    cx: 82,
    cy: CY,
    // sale directo horizontal izquierda
    linePoints: [
      { x: CX - IMG_R, y: CY },
      { x: 128, y: CY }, // borde del nodo
    ],
  },
  {
    id: 3,
    name: 'Accesorios',
    img: product3,
    color: '#ec4899',
    cx: 160,
    cy: 612,
    // sale izquierda, dobla abajo
    linePoints: [
      { x: CX - IMG_R, y: CY + 48 },
      { x: 160, y: CY + 48 },
      { x: 160, y: 566 }, // borde del nodo
    ],
  },
  {
    id: 4,
    name: 'Fotografía',
    img: product4,
    color: '#22c55e',
    cx: 640,
    cy: 188,
    // sale derecha, dobla arriba
    linePoints: [
      { x: CX + IMG_R, y: CY - 48 },
      { x: 640, y: CY - 48 },
      { x: 640, y: 234 },
    ],
  },
  {
    id: 5,
    name: 'Electrónica',
    img: product5,
    color: '#f97316',
    cx: 718,
    cy: CY,
    // sale directo horizontal derecha
    linePoints: [
      { x: CX + IMG_R, y: CY },
      { x: 672, y: CY },
    ],
  },
  {
    id: 6,
    name: 'Ventas',
    img: product6,
    color: '#6366f1',
    cx: 640,
    cy: 612,
    // sale derecha, dobla abajo
    linePoints: [
      { x: CX + IMG_R, y: CY + 48 },
      { x: 640, y: CY + 48 },
      { x: 640, y: 566 },
    ],
  },
];

// Convierte array de puntos a atributo "d" de SVG path con líneas rectas
const pointsToPath = (pts: { x: number; y: number }[]): string =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

const SectionProducts = () => {
  const [imageOffset, setImageOffset] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setImageOffset((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f4ef',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="relative overflow-hidden py-12 sm:py-20 md:min-h-screen"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(203,183,255,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 20%, rgba(255,107,61,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Glow ambiental de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background:
            'radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      {/* Contenedor cuadrado */}
      <div
        style={{
          position: 'relative',
          width: 'min(90vw, 720px)',
          aspectRatio: '1 / 1',
        }}
      >
        {/* ── SVG: líneas + íconos satélite ── */}
        <svg
          viewBox="0 0 800 800"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            overflow: 'visible',
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Sombra para cada nodo */}
            <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.08" />
            </filter>

            {/* Marcador de flecha — uno por color para heredar el tono exacto */}
            {nodes.map((node) => (
              <marker
                key={`marker-${node.id}`}
                id={`arrow-${node.id}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path
                  d="M2 1L8 5L2 9"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            ))}
          </defs>

          {/* ── Líneas rectas en L con flecha al final ── */}
          {nodes.map((node) => (
            <path
              key={`line-${node.id}`}
              d={pointsToPath(node.linePoints)}
              stroke={node.color}
              strokeWidth="1.8"
              strokeOpacity="0.55"
              fill="none"
              strokeLinecap="square" // esquinas cuadradas para look técnico
              strokeLinejoin="miter"
              markerEnd={`url(#arrow-${node.id})`}
            />
          ))}

          {/* Puntos de origen sobre el borde de la imagen */}
          {nodes.map((node) => {
            const origin = node.linePoints[0];
            return (
              <circle
                key={`dot-${node.id}`}
                cx={origin.x}
                cy={origin.y}
                r="4"
                fill={node.color}
                fillOpacity="0.7"
              />
            );
          })}

          {/* ── Productos satélite ── */}
          {nodes.map((node) => {
            const currentImage =
              PRODUCT_IMAGES[(node.id - 1 + imageOffset) % PRODUCT_IMAGES.length];
            return (
              <g key={`node-${node.id}`}>
                {/* Círculo blanco con sombra */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={NODE_R}
                  fill="white"
                  filter="url(#nodeShadow)"
                  stroke={node.color}
                  strokeWidth="1.2"
                  strokeOpacity="0.25"
                />
                {/* Tinte de color suave */}
                <circle cx={node.cx} cy={node.cy} r={NODE_R} fill={node.color} fillOpacity="0.05" />

                {/* Imagen del producto dentro del círculo */}
                <foreignObject
                  x={node.cx - 24}
                  y={node.cy - 24}
                  width="48"
                  height="48"
                  style={{ overflow: 'visible' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={currentImage}
                      alt={node.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* ── Imagen central ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            width: '46%',
          }}
        >
          {/* Glow detrás de la imagen */}
          <div
            style={{
              position: 'absolute',
              inset: '-15%',
              background:
                'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 65%)',
              borderRadius: '50%',
              zIndex: 0,
            }}
          />
          <img
            src={image}
            alt="Producto central"
            style={{
              width: '100%',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.12))',
            }}
          />
        </div>
      </div>

      <p className="relative z-10 px-1 text-center text-[1.4rem] sm:text-2xl font-semibold text-[#15110e] leading-tight">
        <span className="text-[#7c3aed]">“</span>
        Todo lo que necesitás para vender online.
        <span className="text-[#7c3aed]">”</span> con{' '}
        <span className="relative inline-flex items-center justify-center isolate">
          <svg
            className="absolute inset-0 -z-10 mx-auto w-[145%] h-[160%] -translate-x-4 -translate-y-2"
            viewBox="0 0 100 48"
            fill="none"
            stroke="#fca326"
            strokeWidth="14"
            strokeLinecap="round"
          >
            <path d="M110,25 L10,24" className="opacity-95" />
            <path d="M10,38 L110,38" className="opacity-90" />
          </svg>
          <span className="relative z-10 text-purple-600 font-black">TiendiZi</span>
        </span>
      </p>
    </section>
  );
};

export default SectionProducts;
