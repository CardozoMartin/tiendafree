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
   TEMPLATE MINIMAL — 4 productos por página (2×2).
   Sin descripción: imagen ocupa ~72% de la card, info reducida a nombre,
   precio y talles. Layout completamente predecible en PDF.
   ────────────────────────────────────────────────────────────────────────── */

const C = {
  dark:     '#18181B',
  page:     '#FFFFFF',
  soft:     '#F8F8F7',
  mid:      '#EFEFED',
  accent:   '#7C5C3B',
  border:   '#E4E4E0',
  text:     '#18181B',
  textMid:  '#6B6860',
  textMute: '#B0B0A8',
  white:    '#FFFFFF',
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

const PAGE_W = 794;
const PAGE_H = 1123;
const PAD_X  = 28;
const PAD_Y  = 20;
const HDR_H  = 44;
const FTR_H  = 32;
const GAP    = 12;

/* ── Cálculo de card ──
   Grilla: 1123 - 44 - 32 - 40 = 1007px → fila = (1007 - 12) / 2 = 497px
   Columna: (794 - 56 - 12) / 2 = 363px
── */
const CARD_W = Math.floor((PAGE_W - PAD_X * 2 - GAP) / 2);   // 363px
const CARD_H = Math.floor((PAGE_H - HDR_H - FTR_H - PAD_Y * 2 - GAP) / 2); // 497px

/* ── Sin descripción la imagen puede ser más generosa ──
   Imagen: 72% → 357px
   Info:   28% → 140px  (nombre 2 líneas + separador + precio+talles)
── */
const IMG_H  = Math.floor(CARD_H * 0.72);  // 357px
const INFO_H = CARD_H - IMG_H;             // 140px
const INFO_PAD_X = 16;
const INFO_PAD_Y = 14;

export const TemplateMinimal: React.FC<TemplateProps> = ({ productos, tienda }) => {
  const total = productos.length;
  const fecha = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const pages: IProduct[][] = [];
  for (let i = 0; i < total; i += 4) pages.push(productos.slice(i, i + 4));

  /* ── Badge sobre imagen ── */
  const Badge = ({
    children, top, left, right, bg,
  }: {
    children: React.ReactNode;
    top: number; left?: number; right?: number; bg: string;
  }) => (
    <span
      style={{
        position: 'absolute',
        top,
        ...(left  !== undefined ? { left }  : {}),
        ...(right !== undefined ? { right } : {}),
        background: bg,
        color: C.white,
        fontFamily: SANS,
        fontSize: '6.5px',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  );

  /* ── Card ── */
  const Card = ({ p }: { p: IProduct | null }) => {
    if (!p) {
      return (
        <div
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            background: C.soft,
            border: `0.5px solid ${C.border}`,
            flexShrink: 0,
          }}
        />
      );
    }

    const precio = p.precioOferta ?? p.precio;
    const oferta = !!p.precioOferta;
    const talles = p.tags
      ?.filter((t) => t.nombre.toLowerCase().startsWith('talle'))
      .slice(0, 5) ?? [];

    return (
      <div
        style={{
          width:         `${CARD_W}px`,
          height:        `${CARD_H}px`,
          background:    C.page,
          border:        `0.5px solid ${C.border}`,
          display:       'flex',
          flexDirection: 'column',
          overflow:      'hidden',
          flexShrink:    0,
        }}
      >
        {/* ── Imagen ── */}
        <div
          style={{
            width:      '100%',
            height:     `${IMG_H}px`,
            flexShrink: 0,
            background: C.mid,
            overflow:   'hidden',
            position:   'relative',
          }}
        >
          {p.imagenPrincipalUrl ? (
            <img
              src={p.imagenPrincipalUrl}
              alt={p.nombre}
              crossOrigin="anonymous"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                display: 'block',
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: SANS, fontSize: '8px', color: C.textMute, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Sin imagen
              </span>
            </div>
          )}
          {oferta       && <Badge top={10} right={10} bg={C.accent}>Oferta</Badge>}
          {p.stock <= 0 && <Badge top={10} left={10}  bg="rgba(24,24,27,0.72)">Agotado</Badge>}
          {p.stock > 0 && p.stock <= 5 && (
            <Badge top={10} left={10} bg={C.accent}>Últimas {p.stock}</Badge>
          )}
        </div>

        {/* ── Info — sin descripción ── */}
        <div
          style={{
            width:          '100%',
            height:         `${INFO_H}px`,
            flexShrink:     0,
            overflow:       'hidden',
            borderTop:      `0.5px solid ${C.border}`,
            padding:        `${INFO_PAD_Y}px ${INFO_PAD_X}px`,
            boxSizing:      'border-box',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Nombre — 2 líneas máx */}
          <p
            style={{
              fontFamily:      SANS,
              fontSize:        '9.5px',
              fontWeight:      600,
              color:           C.text,
              margin:          0,
              letterSpacing:   '0.04em',
              textTransform:   'uppercase',
              lineHeight:      '13.5px',
              height:          '27px',
              overflow:        'hidden',
              display:         '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {p.nombre}
          </p>

          {/* Precio + talles */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ height: '0.5px', background: C.border, marginBottom: '9px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              {/* Precio */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize:   '21px',
                    fontWeight: 600,
                    color:      oferta ? C.accent : C.text,
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(precio, p.moneda)}
                </span>
                {oferta && (
                  <span style={{ fontFamily: SANS, fontSize: '8px', color: C.textMute, textDecoration: 'line-through' }}>
                    {formatPrice(p.precio, p.moneda)}
                  </span>
                )}
              </div>

              {/* Talles + destacado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                {p.destacado && (
                  <span style={{ color: C.accent, fontSize: '10px', flexShrink: 0 }}>★</span>
                )}
                {talles.map((t) => (
                  <span
                    key={t.nombre}
                    style={{
                      fontFamily:    SANS,
                      fontSize:      '6.5px',
                      color:         C.textMid,
                      border:        `0.5px solid ${C.border}`,
                      padding:       '2px 5px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace:    'nowrap',
                      flexShrink:    0,
                    }}
                  >
                    {t.nombre.replace(/^talle[:\s]*/i, '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── Header / Footer ── */
  const PageHeader = ({ pageNum, tot }: { pageNum: number; tot: number }) => (
    <div
      style={{
        height: `${HDR_H}px`, flexShrink: 0,
        borderBottom: `0.5px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${PAD_X}px`, background: C.soft,
      }}
    >
      <p style={{ fontFamily: SANS, fontSize: '8px', color: C.textMute, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
        {tienda.nombre} — Catálogo
      </p>
      <p style={{ fontFamily: SANS, fontSize: '8px', color: C.textMute, letterSpacing: '0.12em', margin: 0 }}>
        Pág. {pageNum} de {tot}
      </p>
    </div>
  );

  const PageFooter = ({ items }: { items: IProduct[] }) => {
    const cats = [...new Set(items.map((p) => p.categoria?.nombre).filter(Boolean))];
    return (
      <div
        style={{
          height: `${FTR_H}px`, flexShrink: 0,
          borderTop: `0.5px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `0 ${PAD_X}px`,
        }}
      >
        <p style={{ fontFamily: SANS, fontSize: '7.5px', color: C.textMute, letterSpacing: '0.12em', margin: 0, textTransform: 'capitalize' }}>
          {cats.length > 0 ? cats.join(' · ') : fecha}
        </p>
        <p style={{ fontFamily: SANS, fontSize: '7.5px', color: C.textMute, margin: 0 }}>{fecha}</p>
      </div>
    );
  };

  /* ── Portada / Contraportada ── */
  const Cover = ({ isBack = false }: { isBack?: boolean }) => (
    <div
      style={{
        width: `${PAGE_W}px`, height: `${PAGE_H}px`,
        background: C.dark,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '20px',
        pageBreakAfter:  isBack ? undefined : 'always',
        pageBreakBefore: isBack ? 'always'  : undefined,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}
    >
      <div style={{ position: 'absolute', top: 40, left: 40, right: 40, bottom: 40, border: '0.5px solid #2e2c28' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: C.accent }} />

      {tienda.logo && (
        <img
          src={tienda.logo} alt={tienda.nombre} crossOrigin="anonymous"
          style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #3a3830' }}
        />
      )}

      <p style={{ fontFamily: SANS, fontSize: '8px', color: '#5a5a50', letterSpacing: '0.32em', textTransform: 'uppercase', margin: 0 }}>
        {isBack ? 'Gracias por elegirnos' : 'Catálogo de productos'}
      </p>

      <p style={{ fontFamily: SERIF, fontSize: '52px', fontWeight: 300, color: C.white, margin: 0, textAlign: 'center', letterSpacing: '0.10em', textTransform: 'uppercase', padding: '0 80px', lineHeight: 1.1 }}>
        {tienda.nombre}
      </p>

      <div style={{ width: '48px', height: '1px', background: C.accent }} />

      {!isBack && tienda.tagline && (
        <p style={{ fontFamily: SANS, fontSize: '9.5px', color: '#6a6a60', letterSpacing: '0.06em', margin: 0, fontWeight: 300, lineHeight: 1.8, textAlign: 'center', maxWidth: '400px' }}>
          {tienda.tagline}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: SANS, fontSize: '7px', color: '#4a4a42', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 4px' }}>Fecha</p>
          <p style={{ fontFamily: SERIF, fontSize: '16px', color: C.white, margin: 0, fontWeight: 400, textTransform: 'capitalize', letterSpacing: '0.04em' }}>{fecha}</p>
        </div>
        <div style={{ width: '0.5px', height: '40px', background: '#2e2c28' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: SANS, fontSize: '7px', color: '#4a4a42', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 4px' }}>Productos</p>
          <p style={{ fontFamily: SERIF, fontSize: '16px', color: C.white, margin: 0, fontWeight: 400, letterSpacing: '0.04em' }}>{total}</p>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ width: `${PAGE_W}px`, fontFamily: SANS, color: C.text, background: C.page, padding: 0 }}>

      <Cover />

      {pages.map((chunk, pageIdx) => {
        const items4: (IProduct | null)[] = [...chunk];
        while (items4.length < 4) items4.push(null);

        return (
          <div
            key={pageIdx}
            style={{
              width:          `${PAGE_W}px`,
              height:         `${PAGE_H}px`,
              background:     C.page,
              display:        'flex',
              flexDirection:  'column',
              pageBreakBefore: 'always',
              overflow:       'hidden',
              flexShrink:     0,
            }}
          >
            <PageHeader pageNum={pageIdx + 1} tot={pages.length} />

            <div
              style={{
                flex:          1,
                padding:       `${PAD_Y}px ${PAD_X}px`,
                display:       'flex',
                flexDirection: 'column',
                gap:           `${GAP}px`,
                overflow:      'hidden',
              }}
            >
              <div style={{ display: 'flex', gap: `${GAP}px`, flexShrink: 0 }}>
                {items4.slice(0, 2).map((p, i) => <Card key={i} p={p} />)}
              </div>
              <div style={{ display: 'flex', gap: `${GAP}px`, flexShrink: 0 }}>
                {items4.slice(2, 4).map((p, i) => <Card key={i} p={p} />)}
              </div>
            </div>

            <PageFooter items={chunk} />
          </div>
        );
      })}

      <Cover isBack />
    </div>
  );
};
