import React from 'react';
import type { TemplateProps } from './TemplateMinimal';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

export const TemplateModern: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  return (
    <div
      style={{
        width: '794px',
        background: '#18181b', // zinc-900 oscuro
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        color: '#f4f4f5',
        padding: '0',
      }}
    >
      {/* ── Portada Modern ── */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pageBreakAfter: 'always',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', borderTop: '1px solid #3f3f46' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', borderBottom: '1px solid #3f3f46' }} />
        
        {tienda.logo && (
          <img
            src={tienda.logo}
            alt={tienda.nombre}
            crossOrigin="anonymous"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f4f4f5', marginBottom: '32px' }}
          />
        )}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#f4f4f5',
            letterSpacing: '-2px',
            margin: 0,
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.1,
          }}
        >
          {tienda.nombre}
        </h1>
        {tienda.tagline && (
          <p style={{ fontSize: '18px', color: '#a1a1aa', fontWeight: 500, margin: '16px 0 0', textAlign: 'center' }}>
            {tienda.tagline}
          </p>
        )}
        <div style={{ padding: '8px 24px', background: '#f4f4f5', color: '#18181b', borderRadius: '99px', marginTop: '48px', fontWeight: 600, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Colección Oficial
        </div>
      </div>

      {/* ── Categorías ── */}
      {Object.entries(grupos).map(([categoria, items]) => (
        <div key={categoria} style={{ pageBreakBefore: 'always', width: '794px', minHeight: '1123px', background: '#09090b' }}>
          {/* Header Oscuro */}
          <div style={{ padding: '40px 48px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 8px' }}>
                Catálogo / {new Date().getFullYear()}
              </p>
              <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#f4f4f5', margin: 0, letterSpacing: '-1px' }}>
                {categoria}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '32px', fontWeight: 300, color: '#3f3f46' }}>
                {String(items.length).padStart(2, '0')}
              </span>
              <p style={{ fontSize: '10px', color: '#71717a', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Productos</p>
            </div>
          </div>

          {/* Grid Modern (3 columnas por ser más tecnológicas/modernas) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#27272a' }}>
            {items.map((producto) => (
              <div key={producto.id} style={{ background: '#18181b', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                {/* Imagen */}
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#09090b', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {producto.imagenPrincipalUrl ? (
                    <img
                      src={producto.imagenPrincipalUrl}
                      alt={producto.nombre}
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '32px', color: '#3f3f46' }}>?</span>
                  )}
                  {producto.destacado && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#f4f4f5', color: '#09090b', fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      Top
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{producto.nombre}</p>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        {producto.precioOferta ? (
                           <>
                              <span style={{ display: 'block', fontSize: '10px', color: '#71717a', textDecoration: 'line-through' }}>{formatPrice(producto.precio, producto.moneda)}</span>
                              <span style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{formatPrice(producto.precioOferta, producto.moneda)}</span>
                           </>
                        ) : (
                           <span style={{ fontSize: '16px', fontWeight: 700 }}>{formatPrice(producto.precio, producto.moneda)}</span>
                        )}
                    </div>
                    {producto.tags?.filter((t: any) => t.nombre.toLowerCase().startsWith('talle')).map((t: any) => (
                      <span key={t.nombre} style={{ fontSize: '9px', fontWeight: 500, border: '1px solid #3f3f46', padding: '2px 6px', borderRadius: '4px' }}>
                        {t.nombre.replace(/^talle[:\s]*/i, '').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Fill blanks if needed */}
            {items.length % 3 !== 0 && Array.from({ length: 3 - (items.length % 3) }).map((_, i) => (
              <div key={i} style={{ background: '#18181b' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
