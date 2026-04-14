import React from 'react';
import type { TemplateProps } from './TemplateMinimal';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE: MODERN — Oscuro premium, editorial de moda/streetwear.
   Ideal para ropa urbana, gorras, zapatillas, tecnología.
   ────────────────────────────────────────────────────────────────────────── */

export const TemplateModern: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  const bg = '#0a0a0a';
  const bgCard = '#141414';
  const bgAccent = '#1a1a1a';
  const accentRed = '#e11d48';
  const textWhite = '#fafafa';
  const textMuted = '#71717a';
  const borderCol = '#262626';
  const totalProductos = productos.length;

  return (
    <div
      style={{
        width: '794px',
        background: bg,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: textWhite,
        padding: 0,
      }}
    >
      {/* ═══════════════════ PORTADA ═══════════════════ */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pageBreakAfter: 'always',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Líneas decorativas top/bottom */}
        <div style={{ position: 'absolute', top: '36px', left: '36px', right: '36px', height: '1px', background: borderCol }} />
        <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px', height: '1px', background: borderCol }} />
        {/* Líneas laterales */}
        <div style={{ position: 'absolute', top: '36px', bottom: '36px', left: '36px', width: '1px', background: borderCol }} />
        <div style={{ position: 'absolute', top: '36px', bottom: '36px', right: '36px', width: '1px', background: borderCol }} />

        {/* Logo */}
        {tienda.logo && (
          <img
            src={tienda.logo}
            alt={tienda.nombre}
            crossOrigin="anonymous"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${borderCol}`,
              marginBottom: '40px',
            }}
          />
        )}

        {/* Nombre gigante */}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: textWhite,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
            padding: '0 60px',
            lineHeight: 1.05,
          }}
        >
          {tienda.nombre}
        </h1>

        {/* Tagline */}
        {tienda.tagline && (
          <p
            style={{
              fontSize: '14px',
              color: textMuted,
              fontWeight: 400,
              margin: '20px 0 0',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            {tienda.tagline}
          </p>
        )}

        {/* Badge */}
        <div
          style={{
            marginTop: '48px',
            padding: '10px 28px',
            background: accentRed,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Colección {new Date().getFullYear()}
        </div>

        {/* Footer info */}
        <div
          style={{
            position: 'absolute',
            bottom: '64px',
            display: 'flex',
            gap: '32px',
          }}
        >
          <span style={{ fontSize: '10px', color: textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {totalProductos} Productos
          </span>
          <span style={{ fontSize: '10px', color: textMuted }}>·</span>
          <span style={{ fontSize: '10px', color: textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ═══════════════════ CATEGORÍAS ═══════════════════ */}
      {Object.entries(grupos).map(([categoria, items]) => (
        <div
          key={categoria}
          style={{
            pageBreakBefore: 'always',
            width: '794px',
            minHeight: '1123px',
            background: bg,
          }}
        >
          {/* Header de categoría */}
          <div
            style={{
              padding: '44px 48px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderBottom: `1px solid ${borderCol}`,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '9px',
                  color: accentRed,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  margin: '0 0 10px',
                  fontWeight: 700,
                }}
              >
                {tienda.nombre} / {new Date().getFullYear()}
              </p>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: textWhite,
                  margin: 0,
                  letterSpacing: '-0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {categoria}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 200,
                  color: borderCol,
                  lineHeight: 1,
                }}
              >
                {String(items.length).padStart(2, '0')}
              </span>
              <p style={{ fontSize: '9px', color: textMuted, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Artículos
              </p>
            </div>
          </div>

          {/* Grid 3 columnas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: borderCol,
            }}
          >
            {items.map((producto) => (
              <div
                key={producto.id}
                style={{
                  background: bgCard,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Imagen */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: bgAccent,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
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
                    <span style={{ fontSize: '10px', color: textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      Sin imagen
                    </span>
                  )}

                  {/* Badge destacado */}
                  {producto.destacado && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: accentRed,
                        color: '#fff',
                        fontSize: '8px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Top
                    </div>
                  )}

                  {/* Badge oferta */}
                  {producto.precioOferta && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#fff',
                        color: bg,
                        fontSize: '8px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Sale
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      margin: '0 0 4px',
                      lineHeight: 1.3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {producto.nombre}
                  </p>

                  {/* Precio */}
                  <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    {producto.precioOferta ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: accentRed }}>
                          {formatPrice(producto.precioOferta, producto.moneda)}
                        </span>
                        <span style={{ fontSize: '10px', color: textMuted, textDecoration: 'line-through' }}>
                          {formatPrice(producto.precio, producto.moneda)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '15px', fontWeight: 800 }}>
                        {formatPrice(producto.precio, producto.moneda)}
                      </span>
                    )}
                  </div>

                  {/* Talles */}
                  {producto.tags && producto.tags.filter(t => t.nombre.toLowerCase().startsWith('talle')).length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {producto.tags
                        .filter(t => t.nombre.toLowerCase().startsWith('talle'))
                        .map(t => (
                          <span
                            key={t.nombre}
                            style={{
                              fontSize: '8px',
                              fontWeight: 600,
                              border: `1px solid ${borderCol}`,
                              padding: '2px 6px',
                              color: textMuted,
                              letterSpacing: '0.05em',
                            }}
                          >
                            {t.nombre.replace(/^talle[:\s]*/i, '').toUpperCase()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Celdas vacías de relleno */}
            {items.length % 3 !== 0 &&
              Array.from({ length: 3 - (items.length % 3) }).map((_, i) => (
                <div key={`fill-${i}`} style={{ background: bgCard }} />
              ))}
          </div>
        </div>
      ))}

      {/* ═══════════════════ CONTRAPORTADA ═══════════════════ */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          pageBreakBefore: 'always',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '36px', left: '36px', right: '36px', height: '1px', background: borderCol }} />
        <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px', height: '1px', background: borderCol }} />

        <p
          style={{
            fontSize: '10px',
            color: textMuted,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Gracias por elegirnos
        </p>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 900,
            color: textWhite,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {tienda.nombre}
        </h2>
        <div style={{ width: '40px', height: '3px', background: accentRed, margin: '4px 0' }} />
        <p style={{ fontSize: '9px', color: textMuted, margin: 0, letterSpacing: '0.1em' }}>
          {totalProductos} productos — Generado el {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
};
