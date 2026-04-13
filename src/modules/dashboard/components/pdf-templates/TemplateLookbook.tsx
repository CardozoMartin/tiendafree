import React from 'react';
import type { TemplateProps } from './TemplateMinimal';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE: LOOKBOOK — Estilo editorial/revista de moda. Fotos protagonistas, 
   tipografía serif elegante. Ideal para ropa, joyería, lifestyle.
   ────────────────────────────────────────────────────────────────────────── */

export const TemplateLookbook: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  const textMain = '#1a1a1a';
  const textMuted = '#9ca3af';
  const borderCol = '#e5e7eb';
  const bgPage = '#ffffff';
  const totalProductos = productos.length;

  return (
    <div
      style={{
        width: '794px',
        background: bgPage,
        fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Georgia', serif",
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
        {/* Marco fino */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: `0.5px solid ${borderCol}`,
            pointerEvents: 'none',
          }}
        />

        {/* Contenido */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
          }}
        >
          {/* Nombre de la tienda — tipografía grande, serif */}
          <h1
            style={{
              fontSize: '68px',
              fontWeight: 400,
              color: textMain,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
              textAlign: 'center',
              padding: '0 60px',
              lineHeight: 1.1,
            }}
          >
            {tienda.nombre}
          </h1>

          {/* Línea vertical delgada */}
          <div
            style={{
              width: '1px',
              height: '56px',
              background: textMain,
              margin: '32px 0',
            }}
          />

          {/* Subtítulo */}
          <p
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: textMuted,
              margin: 0,
            }}
          >
            The Collection · {new Date().getFullYear()}
          </p>

          {/* Tagline en itálica */}
          {tienda.tagline && (
            <p
              style={{
                fontSize: '20px',
                fontStyle: 'italic',
                marginTop: '36px',
                color: '#6b7280',
                maxWidth: '420px',
                textAlign: 'center',
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              "{tienda.tagline}"
            </p>
          )}
        </div>

        {/* Footer de portada */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              color: textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {totalProductos} Piezas
          </span>
          <span style={{ width: '1px', height: '12px', background: borderCol }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              color: textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
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
            background: bgPage,
          }}
        >
          {/* Header de categoría — editorial */}
          <div
            style={{
              padding: '64px 56px 48px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: textMuted,
                margin: '0 0 12px',
              }}
            >
              Selección Curada
            </p>
            <h2
              style={{
                fontSize: '44px',
                fontWeight: 400,
                fontStyle: 'italic',
                margin: 0,
                textTransform: 'capitalize',
                color: textMain,
                letterSpacing: '0.02em',
              }}
            >
              {categoria}
            </h2>
            <div
              style={{
                width: '1px',
                height: '32px',
                background: borderCol,
                margin: '20px auto 0',
              }}
            />
          </div>

          {/* Grid editorial 2 columnas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              padding: '0 56px 56px',
            }}
          >
            {items.map((producto) => (
              <div
                key={producto.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Imagen grande tipo revista */}
                <div
                  style={{
                    width: '100%',
                    height: '420px',
                    background: '#f9fafb',
                    overflow: 'hidden',
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
                    <div
                      style={{
                        padding: '24px',
                        border: `1px solid ${borderCol}`,
                        margin: '24px',
                        height: 'calc(100% - 48px)',
                        width: 'calc(100% - 48px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        color: textMuted,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Detalles centrados — elegante */}
                <div style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      margin: 0,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {producto.nombre}
                  </h3>

                  {producto.descripcion && (
                    <p
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        color: '#6b7280',
                        margin: '8px 0 0',
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

                  {/* Precio */}
                  <div
                    style={{
                      marginTop: '12px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      color: textMain,
                    }}
                  >
                    {producto.precioOferta ? (
                      <span style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'baseline' }}>
                        <span style={{ textDecoration: 'line-through', color: textMuted, fontSize: '12px' }}>
                          {formatPrice(producto.precio, producto.moneda)}
                        </span>
                        <span style={{ color: textMain, fontWeight: 700, fontSize: '15px' }}>
                          {formatPrice(producto.precioOferta, producto.moneda)}
                        </span>
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{formatPrice(producto.precio, producto.moneda)}</span>
                    )}
                  </div>

                  {/* Talles — sutiles */}
                  {producto.tags && producto.tags.filter(t => t.nombre.toLowerCase().startsWith('talle')).length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                      {producto.tags
                        .filter(t => t.nombre.toLowerCase().startsWith('talle'))
                        .map(t => (
                          <span
                            key={t.nombre}
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '9px',
                              color: textMuted,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                            }}
                          >
                            {t.nombre.replace(/^talle[:\s]*/i, '')}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                    {producto.stock <= 0 && (
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '8px',
                          fontWeight: 700,
                          color: '#b91c1c',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Agotado
                      </span>
                    )}
                    {producto.stock > 0 && producto.stock <= 5 && (
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '8px',
                          fontWeight: 700,
                          color: '#d97706',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Últimas unidades
                      </span>
                    )}
                    {producto.destacado && (
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '8px',
                          fontWeight: 700,
                          color: textMain,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ★ Destacado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
          gap: '0',
          pageBreakBefore: 'always',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: `0.5px solid ${borderCol}`,
            pointerEvents: 'none',
          }}
        />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            color: textMuted,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          Thank You
        </p>

        <h2
          style={{
            fontSize: '40px',
            fontWeight: 400,
            color: textMain,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0 80px',
          }}
        >
          {tienda.nombre}
        </h2>

        <div style={{ width: '1px', height: '40px', background: textMain, margin: '28px 0' }} />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            color: textMuted,
            margin: 0,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {totalProductos} piezas · {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
};
