import React from 'react';
import type { TemplateProps } from './TemplateMinimal';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

export const TemplateLookbook: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  return (
    <div
      style={{
        width: '794px',
        background: '#ffffff',
        fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", // tipográfia tipo Lookbook/Revista
        color: '#111827',
        padding: '0',
      }}
    >
      {/* ── Portada Lookbook ── */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pageBreakAfter: 'always',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', padding: '16px' }}>
             {/* If logo exists, we use it as background opacity, or just a minimal border */}
            <div style={{ width: '100%', height: '100%', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '72px', margin: '0', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {tienda.nombre}
                </h1>
                <div style={{ width: '1px', height: '60px', background: '#111827', margin: '32px 0' }} />
                <p style={{ fontSize: '14px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280' }}>
                  THE COLLECTION . {new Date().getFullYear()}
                </p>
                {tienda.tagline && (
                  <p style={{ fontSize: '18px', fontStyle: 'italic', marginTop: '24px', color: '#4b5563', maxWidth: '400px', textAlign: 'center' }}>
                    "{tienda.tagline}"
                  </p>
                )}
            </div>
        </div>
      </div>

      {/* ── Categorías (Magazine Style) ── */}
      {Object.entries(grupos).map(([categoria, items]) => (
        <div key={categoria} style={{ pageBreakBefore: 'always', width: '794px', minHeight: '1123px', background: '#fafafa', padding: '48px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
             <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '4px', color: '#9ca3af' }}>Curated Selection</p>
             <h2 style={{ fontSize: '48px', fontWeight: 400, fontStyle: 'italic', margin: '8px 0', textTransform: 'capitalize' }}>{categoria}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {items.map((producto) => (
              <div key={producto.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                
                {/* Gran Imagen Lookbook */}
                <div style={{ width: '100%', height: '450px', background: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {producto.imagenPrincipalUrl ? (
                    <img
                      src={producto.imagenPrincipalUrl}
                      alt={producto.nombre}
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ padding: '24px', border: '1px solid #d1d5db', margin: '24px', height: 'calc(100% - 48px)', width: 'calc(100% - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       NO IMAGE
                    </div>
                  )}
                </div>

                {/* Detalles centrados */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0', letterSpacing: '1px', textTransform: 'uppercase' }}>{producto.nombre}</h3>
                  <div style={{ marginTop: '8px', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#4b5563' }}>
                    {producto.precioOferta ? (
                      <span style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                         <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{formatPrice(producto.precio, producto.moneda)}</span>
                         <span style={{ color: '#000', fontWeight: 600 }}>{formatPrice(producto.precioOferta, producto.moneda)}</span>
                      </span>
                    ) : (
                      <span>{formatPrice(producto.precio, producto.moneda)}</span>
                    )}
                  </div>

                  {/* Talles sutiles */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                    {producto.tags?.filter((t: any) => t.nombre.toLowerCase().startsWith('talle')).map((t: any) => (
                      <span key={t.nombre} style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {t.nombre.replace(/^talle[:\s]*/i, '')}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
          
        </div>
      ))}
    </div>
  );
};
