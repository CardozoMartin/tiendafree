import React from 'react';
import type { IProduct } from '../../types/product.type';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

export interface TemplateProps {
  productos: IProduct[];
  tienda: { nombre: string; tagline?: string; logo?: string };
  grupos: Record<string, IProduct[]>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE: MINIMAL — Elegante, limpio, fondo blanco con acentos dorados.
   Ideal para catálogos de joyería, cosmética, productos premium.
   ────────────────────────────────────────────────────────────────────────── */

export const TemplateMinimal: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  const accent = '#b8860b';       // dorado oscuro
  const textMain = '#1a1a1a';
  const textMuted = '#888888';
  const borderCol = '#e8e4de';
  const bgPage = '#ffffff';
  const bgSoft = '#faf9f7';
  const totalProductos = productos.length;

  return (
    <div
      style={{
        width: '794px',
        background: bgPage,
        fontFamily: "'Outfit', 'Helvetica Neue', Arial, sans-serif",
        color: textMain,
        padding: 0,
      }}
    >
      {/* ═══════════════════ PORTADA ═══════════════════ */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: bgPage,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pageBreakAfter: 'always',
          position: 'relative',
        }}
      >
        {/* Marco decorativo */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            right: '48px',
            bottom: '48px',
            border: `1px solid ${borderCol}`,
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        {tienda.logo && (
          <img
            src={tienda.logo}
            alt={tienda.nombre}
            crossOrigin="anonymous"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${borderCol}`,
              marginBottom: '32px',
            }}
          />
        )}

        {/* Nombre de la tienda */}
        <h1
          style={{
            fontSize: '44px',
            fontWeight: 300,
            color: textMain,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
            padding: '0 80px',
            lineHeight: 1.2,
          }}
        >
          {tienda.nombre}
        </h1>

        {/* Línea decorativa */}
        <div
          style={{
            width: '56px',
            height: '1px',
            background: accent,
            margin: '28px 0',
          }}
        />

        {/* Tagline */}
        {tienda.tagline && (
          <p
            style={{
              fontSize: '13px',
              color: textMuted,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
              textAlign: 'center',
              padding: '0 80px',
              fontWeight: 300,
            }}
          >
            {tienda.tagline}
          </p>
        )}

        {/* Badge inferior */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              color: textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Catálogo de Productos
          </p>
          <p style={{ fontSize: '10px', color: accent, margin: 0, fontWeight: 500 }}>
            {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })} — {totalProductos} artículos
          </p>
        </div>
      </div>

      {/* ═══════════════════ PÁGINAS POR CATEGORÍA ═══════════════════ */}
      {Object.entries(grupos).map(([categoria, items], catIndex) => (
        <div
          key={categoria}
          style={{
            pageBreakBefore: 'always',
            width: '794px',
            minHeight: '1123px',
            background: bgPage,
          }}
        >
          {/* Header de categoría */}
          <div
            style={{
              padding: '56px 56px 36px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${borderCol}`,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '9px',
                  color: accent,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                  fontWeight: 600,
                }}
              >
                Colección
              </p>
              <h2
                style={{
                  fontSize: '30px',
                  fontWeight: 300,
                  color: textMain,
                  margin: 0,
                  textTransform: 'capitalize',
                  letterSpacing: '0.05em',
                }}
              >
                {categoria}
              </h2>
            </div>
            <p
              style={{
                fontSize: '10px',
                color: textMuted,
                margin: 0,
                letterSpacing: '0.1em',
              }}
            >
              {String(catIndex + 1).padStart(2, '0')} / {String(Object.keys(grupos).length).padStart(2, '0')}
            </p>
          </div>

          {/* Grid de productos — 2 columnas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
              margin: 0,
            }}
          >
            {items.map((producto, idx) => (
              <div
                key={producto.id}
                style={{
                  background: idx % 2 === 0 ? bgPage : bgSoft,
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderBottom: `1px solid ${borderCol}`,
                  borderRight: idx % 2 === 0 ? `1px solid ${borderCol}` : 'none',
                }}
              >
                {/* Imagen */}
                <div
                  style={{
                    width: '100%',
                    height: '240px',
                    overflow: 'hidden',
                    background: bgSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {producto.imagenPrincipalUrl ? (
                    <img
                      src={producto.imagenPrincipalUrl}
                      alt={producto.nombre}
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ color: '#ccc', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Info del producto */}
                <div>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: textMain,
                      margin: '0 0 4px',
                      lineHeight: 1.4,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {producto.nombre}
                  </p>
                  {producto.descripcion && (
                    <p
                      style={{
                        fontSize: '10px',
                        color: textMuted,
                        margin: 0,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {producto.descripcion}
                    </p>
                  )}
                </div>

                {/* Precio */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  {producto.precioOferta ? (
                    <>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: textMain }}>
                        {formatPrice(producto.precioOferta, producto.moneda)}
                      </span>
                      <span style={{ fontSize: '11px', color: textMuted, textDecoration: 'line-through' }}>
                        {formatPrice(producto.precio, producto.moneda)}
                      </span>
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 700,
                          background: accent,
                          color: '#fff',
                          padding: '2px 7px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Oferta
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '16px', fontWeight: 600, color: textMain }}>
                      {formatPrice(producto.precio, producto.moneda)}
                    </span>
                  )}
                </div>

                {/* Badges: Stock + Talles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {producto.stock <= 0 && (
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        padding: '2px 7px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Agotado
                    </span>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: accent,
                        border: `1px solid ${accent}`,
                        padding: '2px 7px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Últimas {producto.stock} un.
                    </span>
                  )}
                  {producto.destacado && (
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: accent,
                        padding: '2px 7px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      ★ Destacado
                    </span>
                  )}
                  {producto.tags
                    ?.filter((t) => t.nombre.toLowerCase().startsWith('talle'))
                    .map((t) => (
                      <span
                        key={t.nombre}
                        style={{
                          fontSize: '8px',
                          fontWeight: 500,
                          color: textMuted,
                          border: `1px solid ${borderCol}`,
                          padding: '2px 6px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {t.nombre.replace(/^talle[:\s]*/i, '').toUpperCase()}
                      </span>
                    ))}
                </div>
              </div>
            ))}

            {/* Celda vacía si impar */}
            {items.length % 2 !== 0 && (
              <div style={{ background: bgSoft, borderBottom: `1px solid ${borderCol}` }} />
            )}
          </div>
        </div>
      ))}

      {/* ═══════════════════ CONTRAPORTADA ═══════════════════ */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: bgPage,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          pageBreakBefore: 'always',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            right: '48px',
            bottom: '48px',
            border: `1px solid ${borderCol}`,
            pointerEvents: 'none',
          }}
        />
        <p style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 300 }}>
          Gracias por elegirnos
        </p>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 300,
            color: textMain,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0 80px',
          }}
        >
          {tienda.nombre}
        </p>
        <div style={{ width: '40px', height: '1px', background: accent, margin: '4px 0' }} />
        <p style={{ fontSize: '9px', color: textMuted, margin: 0, letterSpacing: '0.1em' }}>
          Catálogo generado el {new Date().toLocaleDateString('es-AR')} — {totalProductos} productos
        </p>
      </div>
    </div>
  );
};
