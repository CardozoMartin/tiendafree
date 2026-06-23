import React from 'react';
import type { IProduct } from '../../types/product.type';

const fmt = (price: number, moneda: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(price);

export interface TemplateProps {
  productos: IProduct[];
  tienda: { nombre: string; tagline?: string; logo?: string; instagram?: string; whatsapp?: string; ciudad?: string };
  grupos: Record<string, IProduct[]>;
}

/* ─── Paleta ─────────────────────────────────────────────────────────────── */
const C = {
  bg:       '#FAFAF9',
  page:     '#FFFFFF',
  dark:     '#0F0F0E',
  ink:      '#1C1C1A',
  mid:      '#6B6860',
  mute:     '#AEACA6',
  line:     '#E8E6E1',
  lineSoft: '#F0EEE9',
  accent:   '#C8A96E',   // dorado cálido
  accentBg: '#FBF5EB',
  white:    '#FFFFFF',
};

const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Georgia', 'Times New Roman', serif";

/* ─── Página A4 en px a 96dpi ────────────────────────────────────────────── */
const PW = 794;
const PH = 1123;

/* ─── Helpers de estilo inline ───────────────────────────────────────────── */
const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...style });
const flex = (style: React.CSSProperties = {}): React.CSSProperties => ({ display: 'flex', ...style });
const page = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  width: `${PW}px`, height: `${PH}px`, background: C.page,
  position: 'relative', overflow: 'hidden', flexShrink: 0,
  pageBreakAfter: 'always', ...extra,
});

/* ═══════════════════════════════════════════════════════════════════════════
   PORTADA
═══════════════════════════════════════════════════════════════════════════ */
const Cover: React.FC<{ tienda: TemplateProps['tienda']; total: number }> = ({ tienda, total }) => {
  const fecha = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return (
    <div style={page({ background: C.dark, display: 'flex', flexDirection: 'column' })}>

      {/* Franja dorada izquierda */}
      <div style={abs({ top: 0, left: 0, width: '5px', height: '100%', background: C.accent })} />

      {/* Marco interior */}
      <div style={abs({ top: 32, left: 32, right: 32, bottom: 32, border: `0.5px solid #2A2A28` })} />

      {/* Contenido centrado */}
      <div style={flex({ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0', padding: '80px 80px 60px' })}>

        {/* Logo */}
        {tienda.logo && (
          <img
            src={tienda.logo}
            alt={tienda.nombre}
            crossOrigin="anonymous"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid #2A2A28`, marginBottom: '32px' }}
          />
        )}

        {/* Eyebrow */}
        <p style={{ fontFamily: SANS, fontSize: '9px', color: C.accent, letterSpacing: '0.35em', textTransform: 'uppercase', margin: '0 0 20px', fontWeight: 600 }}>
          Catálogo de productos
        </p>

        {/* Nombre tienda */}
        <h1 style={{ fontFamily: SERIF, fontSize: '58px', fontWeight: 400, color: C.white, margin: 0, textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1 }}>
          {tienda.nombre}
        </h1>

        {/* Línea dorada */}
        <div style={{ width: '60px', height: '1px', background: C.accent, margin: '28px 0' }} />

        {/* Tagline */}
        {tienda.tagline && (
          <p style={{ fontFamily: SANS, fontSize: '12px', color: '#8A887E', letterSpacing: '0.04em', margin: 0, textAlign: 'center', maxWidth: '380px', lineHeight: 1.7, fontWeight: 300 }}>
            {tienda.tagline}
          </p>
        )}

        {/* Stats */}
        <div style={flex({ gap: '48px', marginTop: '52px', alignItems: 'center' })}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: SERIF, fontSize: '32px', color: C.white, margin: 0, fontWeight: 400, letterSpacing: '0.04em' }}>{total}</p>
            <p style={{ fontFamily: SANS, fontSize: '8px', color: '#5A5A52', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '6px 0 0' }}>Productos</p>
          </div>
          <div style={{ width: '0.5px', height: '40px', background: '#2A2A28' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: SERIF, fontSize: '18px', color: C.white, margin: 0, fontWeight: 400, textTransform: 'capitalize', letterSpacing: '0.02em' }}>{fecha}</p>
            <p style={{ fontFamily: SANS, fontSize: '8px', color: '#5A5A52', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '6px 0 0' }}>Edición</p>
          </div>
          {tienda.ciudad && (
            <>
              <div style={{ width: '0.5px', height: '40px', background: '#2A2A28' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: SERIF, fontSize: '18px', color: C.white, margin: 0, fontWeight: 400, letterSpacing: '0.02em' }}>{tienda.ciudad}</p>
                <p style={{ fontFamily: SANS, fontSize: '8px', color: '#5A5A52', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '6px 0 0' }}>Ciudad</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer de portada */}
      <div style={flex({ justifyContent: 'space-between', alignItems: 'center', padding: '0 52px 52px' })}>
        {tienda.instagram && (
          <p style={{ fontFamily: SANS, fontSize: '8px', color: '#4A4A42', margin: 0, letterSpacing: '0.12em' }}>@{tienda.instagram}</p>
        )}
        {tienda.whatsapp && (
          <p style={{ fontFamily: SANS, fontSize: '8px', color: '#4A4A42', margin: 0, letterSpacing: '0.12em' }}>{tienda.whatsapp}</p>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SEPARADOR DE SECCIÓN (1 página por categoría)
═══════════════════════════════════════════════════════════════════════════ */
const SectionDivider: React.FC<{ categoria: string; count: number; tienda: TemplateProps['tienda'] }> = ({ categoria, count, tienda }) => (
  <div style={page({ background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })}>
    <div style={abs({ top: 24, left: 24, right: 24, bottom: 24, border: `0.5px solid ${C.line}` })} />
    <p style={{ fontFamily: SANS, fontSize: '9px', color: C.accent, letterSpacing: '0.32em', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 600 }}>
      {tienda.nombre}
    </p>
    <h2 style={{ fontFamily: SERIF, fontSize: '52px', fontWeight: 400, color: C.ink, margin: 0, textTransform: 'capitalize', letterSpacing: '0.04em', textAlign: 'center' }}>
      {categoria}
    </h2>
    <div style={{ width: '40px', height: '1px', background: C.accent, margin: '24px 0' }} />
    <p style={{ fontFamily: SANS, fontSize: '10px', color: C.mute, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
      {count} {count === 1 ? 'producto' : 'productos'}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER / FOOTER DE PÁGINA DE PRODUCTOS
═══════════════════════════════════════════════════════════════════════════ */
const PageHeader: React.FC<{ tienda: TemplateProps['tienda']; categoria: string; pageNum: number; total: number }> = ({ tienda, categoria, pageNum, total }) => (
  <div style={flex({ height: '40px', flexShrink: 0, borderBottom: `0.5px solid ${C.line}`, padding: '0 28px', alignItems: 'center', justifyContent: 'space-between', background: C.white })}>
    <p style={{ fontFamily: SANS, fontSize: '7.5px', color: C.mute, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
      {tienda.nombre} <span style={{ color: C.line, margin: '0 6px' }}>·</span> {categoria}
    </p>
    <p style={{ fontFamily: SANS, fontSize: '7.5px', color: C.mute, margin: 0, letterSpacing: '0.1em' }}>
      {pageNum} / {total}
    </p>
  </div>
);

const PageFooter: React.FC<{ tienda: TemplateProps['tienda'] }> = ({ tienda }) => (
  <div style={flex({ height: '32px', flexShrink: 0, borderTop: `0.5px solid ${C.line}`, padding: '0 28px', alignItems: 'center', justifyContent: 'space-between' })}>
    <p style={{ fontFamily: SANS, fontSize: '7px', color: C.mute, margin: 0, letterSpacing: '0.08em' }}>
      {tienda.instagram ? `@${tienda.instagram}` : tienda.nombre}
    </p>
    <p style={{ fontFamily: SANS, fontSize: '7px', color: C.mute, margin: 0 }}>
      {new Date().toLocaleDateString('es-AR')}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   CARD DE PRODUCTO  —  imagen grande + info debajo
   Layout: 2 col × 2 filas, imagen 72% de la altura
═══════════════════════════════════════════════════════════════════════════ */
const COLS     = 1;
const PAD      = 40;   // padding externo de la grilla
const GAP      = 20;   // gap entre cards
const HDR_H    = 40;
const FTR_H    = 32;

const CARD_W   = PW - PAD * 2;                                            // ~714px
const GRID_H   = PH - HDR_H - FTR_H - PAD * 2;
const ROWS     = 2;
const CARD_H   = Math.floor((GRID_H - GAP * (ROWS - 1)) / ROWS);         // ~490px

const IMG_H    = Math.floor(CARD_H * 0.62);
const INFO_H   = CARD_H - IMG_H;
const ITEMS_PG = COLS * ROWS;   // 2 por página

const ProductCard: React.FC<{ p: IProduct | null }> = ({ p }) => {
  if (!p) {
    return (
      <div style={{ width: `${CARD_W}px`, height: `${CARD_H}px`, background: C.lineSoft, flexShrink: 0 }} />
    );
  }

  const precio     = p.precioOferta ?? p.precio;
  const tieneOferta = !!p.precioOferta && p.precioOferta < p.precio;
  const descPct    = tieneOferta ? Math.round(((p.precio - precio) / p.precio) * 100) : 0;
  const sinStock   = p.stock <= 0;
  const pocoStock  = p.stock > 0 && p.stock <= 5;

  return (
    <div style={{ width: `${CARD_W}px`, height: `${CARD_H}px`, background: C.white, border: `0.5px solid ${C.line}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

      {/* ── Imagen ── */}
      <div style={{ width: '100%', height: `${IMG_H}px`, flexShrink: 0, background: C.lineSoft, overflow: 'hidden', position: 'relative' }}>
        {p.imagenPrincipalUrl ? (
          <img
            src={p.imagenPrincipalUrl}
            alt={p.nombre}
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        ) : (
          <div style={flex({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })}>
            <p style={{ fontFamily: SANS, fontSize: '8px', color: C.mute, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Sin imagen</p>
          </div>
        )}

        {/* Badge % descuento */}
        {tieneOferta && (
          <div style={abs({ top: 10, right: 10, background: C.accent, color: C.white, fontFamily: SANS, fontSize: '7px', fontWeight: 700, padding: '4px 8px', letterSpacing: '0.08em' })}>
            -{descPct}%
          </div>
        )}

        {/* Badge agotado */}
        {sinStock && (
          <div style={abs({ top: 10, left: 10, background: 'rgba(15,15,14,0.75)', color: C.white, fontFamily: SANS, fontSize: '7px', fontWeight: 600, padding: '4px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' })}>
            Agotado
          </div>
        )}

        {/* Badge poco stock */}
        {pocoStock && (
          <div style={abs({ top: 10, left: 10, background: C.accent, color: C.white, fontFamily: SANS, fontSize: '7px', fontWeight: 600, padding: '4px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' })}>
            Últimas {p.stock}
          </div>
        )}

        {/* Badge destacado */}
        {p.destacado && (
          <div style={abs({ bottom: 10, left: 10, background: C.dark, color: C.white, fontFamily: SANS, fontSize: '6.5px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.16em', textTransform: 'uppercase' })}>
            ★ Destacado
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ height: `${INFO_H}px`, flexShrink: 0, padding: '20px 28px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', borderTop: `0.5px solid ${C.line}` }}>

        {/* Nombre */}
        <p style={{
          fontFamily: SANS, fontSize: '18px', fontWeight: 700, color: C.ink,
          margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase',
          lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'visible',
        }}>
          {p.nombre}
        </p>

        {/* Separador + precio */}
        <div>
          <div style={{ height: '0.5px', background: C.line, marginBottom: '10px' }} />
          <div style={flex({ alignItems: 'baseline', justifyContent: 'space-between' })}>

            {/* Precio */}
            <div style={flex({ alignItems: 'baseline', gap: '8px' })}>
              <span style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 400, color: tieneOferta ? C.accent : C.ink, lineHeight: 1 }}>
                {fmt(precio, p.moneda)}
              </span>
              {tieneOferta && (
                <span style={{ fontFamily: SANS, fontSize: '9px', color: C.mute, textDecoration: 'line-through' }}>
                  {fmt(p.precio, p.moneda)}
                </span>
              )}
            </div>

            {/* Variantes / talles */}
            {p.variantes?.length > 0 && (
              <span style={{ fontFamily: SANS, fontSize: '8px', color: C.mute, letterSpacing: '0.08em' }}>
                {p.variantes.length} variante{p.variantes.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   CONTRAPORTADA
═══════════════════════════════════════════════════════════════════════════ */
const BackCover: React.FC<{ tienda: TemplateProps['tienda']; total: number }> = ({ tienda, total }) => (
  <div style={page({ background: C.dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0', pageBreakAfter: undefined })}>
    <div style={abs({ top: 32, left: 32, right: 32, bottom: 32, border: '0.5px solid #2A2A28' })} />
    <div style={abs({ top: 0, left: 0, width: '5px', height: '100%', background: C.accent })} />

    <p style={{ fontFamily: SANS, fontSize: '9px', color: C.accent, letterSpacing: '0.35em', textTransform: 'uppercase', margin: '0 0 20px', fontWeight: 600 }}>
      Gracias por elegirnos
    </p>
    <h2 style={{ fontFamily: SERIF, fontSize: '44px', fontWeight: 400, color: C.white, margin: 0, textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 80px', lineHeight: 1.1 }}>
      {tienda.nombre}
    </h2>
    <div style={{ width: '50px', height: '1px', background: C.accent, margin: '24px 0' }} />
    <p style={{ fontFamily: SANS, fontSize: '9px', color: '#5A5A52', margin: 0, letterSpacing: '0.12em' }}>
      {total} productos · {new Date().toLocaleDateString('es-AR')}
    </p>

    {/* Contacto */}
    <div style={flex({ gap: '32px', marginTop: '40px', alignItems: 'center' })}>
      {tienda.instagram && (
        <p style={{ fontFamily: SANS, fontSize: '8.5px', color: '#6A6A62', margin: 0, letterSpacing: '0.1em' }}>
          @{tienda.instagram}
        </p>
      )}
      {tienda.instagram && tienda.whatsapp && (
        <div style={{ width: '0.5px', height: '14px', background: '#2A2A28' }} />
      )}
      {tienda.whatsapp && (
        <p style={{ fontFamily: SANS, fontSize: '8.5px', color: '#6A6A62', margin: 0, letterSpacing: '0.1em' }}>
          {tienda.whatsapp}
        </p>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER PRINCIPAL
═══════════════════════════════════════════════════════════════════════════ */
export const TemplateMinimal: React.FC<TemplateProps> = ({ productos, tienda, grupos }) => {
  const total = productos.length;

  // Calcular total de páginas para el header
  let totalPages = 0;
  const sectionPages: Record<string, number> = {};
  for (const [cat, items] of Object.entries(grupos)) {
    const pags = Math.ceil(items.length / ITEMS_PG);
    sectionPages[cat] = pags;
    totalPages += 1 + pags; // 1 separador + páginas de productos
  }

  let globalPageNum = 0;

  return (
    <div style={{ width: `${PW}px`, background: C.bg, padding: 0, fontFamily: SANS }}>

      <Cover tienda={tienda} total={total} />

      {Object.entries(grupos).map(([categoria, items]) => {
        const chunks: IProduct[][] = [];
        for (let i = 0; i < items.length; i += ITEMS_PG) chunks.push(items.slice(i, i + ITEMS_PG));

        return (
          <React.Fragment key={categoria}>
            {/* Página separador de sección */}
            <SectionDivider categoria={categoria} count={items.length} tienda={tienda} />

            {/* Páginas de productos */}
            {chunks.map((chunk, chunkIdx) => {
              globalPageNum++;
              const cards: (IProduct | null)[] = [...chunk];
              while (cards.length < ITEMS_PG) cards.push(null);

              return (
                <div
                  key={chunkIdx}
                  style={{
                    width: `${PW}px`, height: `${PH}px`, background: C.white,
                    display: 'flex', flexDirection: 'column',
                    pageBreakBefore: 'always', overflow: 'hidden', flexShrink: 0,
                  }}
                >
                  <PageHeader tienda={tienda} categoria={categoria} pageNum={globalPageNum} total={totalPages} />

                  {/* Grilla 2×2 */}
                  <div style={{ flex: 1, padding: `${PAD}px`, display: 'flex', flexDirection: 'column', gap: `${GAP}px`, overflow: 'hidden' }}>
                    {Array.from({ length: ROWS }).map((_, row) => (
                      <div key={row} style={flex({ gap: `${GAP}px`, flexShrink: 0 })}>
                        {cards.slice(row * COLS, row * COLS + COLS).map((p, i) => (
                          <ProductCard key={i} p={p} />
                        ))}
                      </div>
                    ))}
                  </div>

                  <PageFooter tienda={tienda} />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}

      <BackCover tienda={tienda} total={total} />
    </div>
  );
};
