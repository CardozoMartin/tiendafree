import React from 'react';
import type { IProduct } from '../../types/product.type';

const formatPrice = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(price);

export interface TemplateProps {
  productos: IProduct[];
  tienda: { nombre: string; tagline?: string; logo?: string };
  grupos: Record<string, IProduct[]>;
}

export const TemplateMinimal: React.FC<TemplateProps> = ({ tienda, grupos }: TemplateProps) => {
  return (
    <div
      style={{
        width: '794px',           // A4 a 96dpi
        background: '#ffffff',
        fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
        color: '#111',
        padding: '0',
      }}
    >
      {/* ── Portada ── */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          pageBreakAfter: 'always',
        }}
      >
        {tienda.logo && (
          <img
            src={tienda.logo}
            alt={tienda.nombre}
            crossOrigin="anonymous"
            style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }}
          />
        )}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          {tienda.nombre}
        </h1>
        {tienda.tagline && (
          <p style={{ fontSize: '14px', color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, textAlign: 'center', padding: '0 20px' }}>
            {tienda.tagline}
          </p>
        )}
        <div style={{ width: '48px', height: '2px', background: '#f59e0b', marginTop: '8px' }} />
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
          Catálogo de Productos — {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* ── Páginas por categoría ── */}
      {Object.entries(grupos).map(([categoria, items]) => (
        <div key={categoria} style={{ pageBreakBefore: 'always', width: '794px', minHeight: '1123px', background: '#f1f5f9' }}>

          {/* Header de categoría */}
          <div
            style={{
              background: '#f8fafc',
              borderBottom: '3px solid #f59e0b',
              padding: '32px 48px 24px',
            }}
          >
            <p style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              Categoría
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>
              {categoria}
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
              {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid de productos — 2 columnas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: '#e2e8f0',
              margin: '0',
            }}
          >
            {items.map((producto) => (
              <div
                key={producto.id}
                style={{
                  background: '#ffffff',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Imagen */}
                <div
                  style={{
                    width: '100%',
                    height: '220px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e2e8f0',
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
                    <span style={{ fontSize: '32px', color: '#cbd5e1' }}>📦</span>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {producto.nombre}
                  </p>
                  {producto.descripcion && (
                    <p style={{
                      fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {producto.descripcion}
                    </p>
                  )}
                </div>

                {/* Precio */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    {formatPrice(producto.precio, producto.moneda)}
                  </span>
                  {producto.precioOferta ? (
                    <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {formatPrice(producto.precioOferta, producto.moneda)}
                    </span>
                  ) : null}
                  {producto.precioOferta ? (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, background: '#fef3c7',
                      color: '#d97706', padding: '2px 6px', borderRadius: '4px'
                    }}>
                      OFERTA
                    </span>
                  ) : null}
                </div>

                {/* Stock / Talles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {producto.stock <= 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#fef2f2', color: '#dc2626', padding: '3px 8px', borderRadius: '4px', border: '1px solid #fecaca' }}>
                      SIN STOCK
                    </span>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#fffbeb', color: '#d97706', padding: '3px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      ÚLTIMAS {producto.stock} UNIDADES
                    </span>
                  )}
                  {producto.stock > 5 && (
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                      DISPONIBLE
                    </span>
                  )}
                  {/* Talles */}
                  {producto.tags
                    ?.filter((t: any) => t.nombre.toLowerCase().startsWith('talle'))
                    .map((t: any) => (
                      <span key={t.nombre} style={{
                        fontSize: '10px', fontWeight: 600, background: '#f8fafc',
                        color: '#475569', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0'
                      }}>
                        {t.nombre.replace(/^talle[:\s]*/i, '').toUpperCase()}
                      </span>
                    ))}
                </div>

                {/* Badges destacado */}
                {producto.destacado && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#fffbeb', color: '#d97706', padding: '3px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      ★ DESTACADO
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Celda vacía si número impar */}
            {items.length % 2 !== 0 && (
              <div style={{ background: '#ffffff' }} />
            )}
          </div>
        </div>
      ))}

      {/* ── Contraportada ── */}
      <div
        style={{
          width: '794px',
          height: '1123px',
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          pageBreakBefore: 'always',
        }}
      >
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Gracias por elegirnos
        </p>
        <p style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0, textAlign: 'center', padding: '0 20px' }}>
          {tienda.nombre}
        </p>
        <div style={{ width: '32px', height: '2px', background: '#f59e0b', margin: '8px 0' }} />
        <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>
          Catálogo generado el {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>
    </div>
  );
};
