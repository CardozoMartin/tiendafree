import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── COLORES FIJOS ─────────────────────────────────────────────
let ACENTO = '#f97316'; // naranja vibrante
const BG = '#ffffff';
const SURFACE = '#fafafa';
const SURFACE2 = '#f3f4f6';
const TXT = '#111827';
const MUTED = '#6b7280';
const SUBTLE = '#9ca3af';
const BORDER = 'rgba(0,0,0,0.08)';
const BTN_TXT = '#ffffff';

let TIENDA = {
  nombre: 'CapZone',
  descripcion: 'Gorras y accesorios urbanos para los que marcan tendencia en Tucumán.',
  whatsapp: '5493812345678',
  instagram: 'capzone.tuc',
  facebook: 'capzonetucuman',
  ciudad: 'Tucumán',
  pais: 'Argentina',
};

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&h=700&fit=crop&q=80',
    label: 'Nueva temporada',
    bg: `${ACENTO}18`,
    accent: ACENTO,
  },
  {
    img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=700&h=700&fit=crop&q=80',
    label: 'Edición limitada',
    bg: '#f0f7ff',
    accent: '#4a90d9',
  },
  {
    img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=700&h=700&fit=crop&q=80',
    label: 'Streetwear local',
    bg: '#f0fff4',
    accent: '#3aab6d',
  },
  {
    img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&h=700&fit=crop&q=80',
    label: 'Últimos modelos',
    bg: '#fff8f0',
    accent: '#e5973a',
  },
];

const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Cap Clásica Negra',
    cat: 'Snapback',
    precio: 3500,
    precioAnt: 4200,
    badge: 'Sale',
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 2,
    nombre: 'Trucker Beige',
    cat: 'Trucker',
    precio: 4200,
    precioAnt: null,
    badge: 'Nuevo',
    img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 3,
    nombre: '5 Panel Olive',
    cat: '5 Panel',
    precio: 3800,
    precioAnt: null,
    badge: null,
    img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 4,
    nombre: 'Snapback Camo',
    cat: 'Snapback',
    precio: 4500,
    precioAnt: 5000,
    badge: 'Limitado',
    img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 5,
    nombre: 'Bucket Hat Blanco',
    cat: 'Bucket',
    precio: 3200,
    precioAnt: null,
    badge: 'Nuevo',
    img: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 6,
    nombre: 'Dad Hat Washed Blue',
    cat: 'Dad Hat',
    precio: 3600,
    precioAnt: 4000,
    badge: null,
    img: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 7,
    nombre: 'Trucker Negra Logo',
    cat: 'Trucker',
    precio: 4800,
    precioAnt: null,
    badge: 'Más vendido',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 8,
    nombre: 'Cap Bordada Custom',
    cat: 'Snapback',
    precio: 5200,
    precioAnt: null,
    badge: 'Limitado',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop&q=80',
  },
];

const CATS = ['Todo', 'Snapback', 'Trucker', '5 Panel', 'Bucket', 'Dad Hat'];

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({ cartCount, onCart, logo, titulo }: INavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.cz-scroll');
    const fn = () => setScrolled((el?.scrollTop ?? 0) > 50);
    el?.addEventListener('scroll', fn, { passive: true });
    return () => el?.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.97)' : BG,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all .3s ease',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: TXT,
          }}
        >
          {logo ? (
            <img
              src={logo}
              alt={titulo || 'Logo'}
              style={{ height: '32px', objectFit: 'contain' }}
            />
          ) : (
            titulo || 'CapZone'
          )}
        </span>
        <span
          style={{
            background: ACENTO,
            color: BTN_TXT,
            fontSize: '.52rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '20px',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
          }}
        >
          NEW
        </span>
      </div>

      {/* Desktop links */}
      <div className="cz-hide-mob" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {['Inicio', 'Gorras', 'Novedades', 'Contacto'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '.78rem',
              fontWeight: 500,
              color: MUTED,
              textDecoration: 'none',
              letterSpacing: '.04em',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACENTO)}
            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
          >
            {l}
          </a>
        ))}

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: `1px solid ${BORDER}`,
            borderRadius: '20px',
            padding: '6px 14px',
            background: SURFACE,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615 15 14.695"
              stroke={MUTED}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke={MUTED}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <input
            placeholder="Buscar gorras..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '.72rem',
              color: TXT,
              width: '120px',
              fontFamily: "'DM Sans',sans-serif",
            }}
          />
        </div>

        {/* Cart */}
        <button
          onClick={onCart}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke={ACENTO}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.9"
            />
          </svg>
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: ACENTO,
                color: BTN_TXT,
                fontSize: '.52rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* CTA */}
        <button
          style={{
            padding: '9px 22px',
            background: ACENTO,
            color: BTN_TXT,
            border: 'none',
            borderRadius: '50px',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity .2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Ingresar
        </button>
      </div>

      {/* Hamburger */}
      <button
        className="cz-show-mob"
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
          <rect width="22" height="1.5" rx=".75" fill={TXT} />
          <rect x="6" y="6.5" width="16" height="1.5" rx=".75" fill={TXT} />
          <rect x="3" y="13" width="19" height="1.5" rx=".75" fill={TXT} />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: BG,
            borderBottom: `1px solid ${BORDER}`,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(0,0,0,.06)',
          }}
        >
          {['Inicio', 'Gorras', 'Novedades', 'Contacto'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.85rem',
                fontWeight: 500,
                color: MUTED,
                textDecoration: 'none',
              }}
            >
              {l}
            </a>
          ))}
          <button
            style={{
              alignSelf: 'flex-start',
              padding: '10px 24px',
              background: ACENTO,
              color: BTN_TXT,
              border: 'none',
              borderRadius: '50px',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '.5rem',
            }}
          >
            Ingresar
          </button>
        </div>
      )}
    </nav>
  );
}

// ── HERO CAROUSEL ─────────────────────────────────────────────
function Hero({ titulo, descripcion, imagenCarrusel, tituloDos }: IHeroProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = imagenCarrusel && imagenCarrusel.length > 0 ? imagenCarrusel : SLIDES;

  // Paleta de colores y fondos para ciclar
  const colorPalette = [
    { accent: ACENTO, bg: `${ACENTO}18` },
    { accent: '#4a90d9', bg: '#f0f7ff' },
    { accent: '#3aab6d', bg: '#f0fff4' },
    { accent: '#e5973a', bg: '#fff8f0' },
  ];

  const currentColorScheme = colorPalette[active % colorPalette.length];

  const go = useCallback(
    (i: number) => {
      setActive(i);
      clearInterval(timerRef.current!);
      timerRef.current = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    },
    [slides.length]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    return () => clearInterval(timerRef.current!);
  }, [slides.length]);

  const cur = slides[active];

  return (
    <section
      style={{
        background: currentColorScheme.bg,
        transition: 'background .65s ease',
        padding: '3.5rem 1.5rem 4rem',
      }}
    >
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: `${currentColorScheme.accent}22`,
              borderRadius: '20px',
              padding: '5px 14px',
              marginBottom: '1.1rem',
            }}
          >
            <span
              style={{
                fontSize: '.62rem',
                fontWeight: 700,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: currentColorScheme.accent,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {cur.subtitulo || cur.label || 'Colección'}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(2.6rem,5vw,4.2rem)',
              fontWeight: 700,
              color: TXT,
              lineHeight: 1.05,
              marginBottom: '.9rem',
            }}
          >
            {tituloDos?.primera || titulo}
            <br />
            <span
              style={{ fontStyle: 'italic', fontWeight: 400, color: currentColorScheme.accent }}
            >
              {tituloDos?.segunda || descripcion}
            </span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '13px 30px',
                background: ACENTO,
                color: BTN_TXT,
                border: 'none',
                borderRadius: '50px',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.75rem',
                fontWeight: 600,
                letterSpacing: '.06em',
                cursor: 'pointer',
                transition: 'opacity .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Ver colección →
            </button>

            <a
              href={`https://wa.me/${TIENDA.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '13px 22px',
                background: '#25d366',
                color: '#fff',
                borderRadius: '50px',
                textDecoration: 'none',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                fontWeight: 600,
              }}
            >
              WhatsApp
            </a>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '6px', marginLeft: '.5rem' }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => go(i)}
                  style={{
                    width: i === active ? '22px' : '7px',
                    height: '7px',
                    borderRadius: '4px',
                    background:
                      i === active ? currentColorScheme.accent : `${currentColorScheme.accent}40`,
                    transition: 'all .35s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image circular */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '88%',
              aspectRatio: '1',
              borderRadius: '50%',
              background: `${currentColorScheme.accent}12`,
              transition: 'background .65s',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '78%',
              aspectRatio: '1',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `4px solid ${currentColorScheme.accent}30`,
              transition: 'border-color .65s',
              zIndex: 1,
            }}
          >
            <img
              src={cur.url || cur.img}
              alt={cur.titulo || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity .4s ease',
              }}
            />
          </div>
          {/* Floating badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              right: '3%',
              background: BG,
              borderRadius: '14px',
              padding: '10px 14px',
              boxShadow: `0 4px 20px ${cur.accent}22`,
              zIndex: 2,
              minWidth: '110px',
            }}
          >
            <div
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.58rem',
                color: MUTED,
                marginBottom: '2px',
              }}
            >
              Más vendido
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '.92rem',
                fontWeight: 700,
                color: TXT,
              }}
            >
              Edición {new Date().getFullYear()}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.75rem',
                color: cur.accent,
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              Ver →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────
function Marquee() {
  const words = [
    'Nueva Colección',
    'Envío a todo Tucumán',
    'Hecho Local',
    'Edición Limitada',
    'CapZone 2025',
    'Streetwear',
  ];
  const items = [...words, ...words, ...words];
  return (
    <div style={{ background: ACENTO, overflow: 'hidden', padding: '9px 0' }}>
      <style>{`@keyframes czmq{from{transform:translateX(0)}to{transform:translateX(-33.33%)}} .cz-track{display:flex;width:max-content;animation:czmq 20s linear infinite} .cz-track:hover{animation-play-state:paused}`}</style>
      <div className="cz-track">
        {items.map((w, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '.65rem',
              fontWeight: 700,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: BTN_TXT,
              padding: '0 1.8rem',
              whiteSpace: 'nowrap',
            }}
          >
            {w} <span style={{ opacity: 0.45 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── TRUST BADGES ─────────────────────────────────────────────
function TrustBadges() {
  const items = [
    { icon: '🚚', title: 'Envío gratis', sub: 'Pedidos desde $8.000' },
    { icon: '↩', title: '30 días devolución', sub: 'Sin preguntas' },
    { icon: '✦', title: 'Hecho en Tucumán', sub: 'Apoyá lo local' },
    { icon: '🔒', title: 'Pago seguro', sub: 'Múltiples métodos' },
  ];
  return (
    <section style={{ background: SURFACE }}>
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {items.map(({ icon, title, sub }) => (
          <div
            key={title}
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderRight: `1px solid ${BORDER}`,
            }}
          >
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.78rem',
                  fontWeight: 600,
                  color: TXT,
                  marginBottom: '2px',
                }}
              >
                {title}
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.68rem', color: MUTED }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PRODUCTOS ─────────────────────────────────────────────────
function Productos({ onCart }: { onCart: (p: any) => void }) {
  const [cat, setCat] = useState('Todo');
  const [hov, setHov] = useState<number | null>(null);

  const filtered = cat === 'Todo' ? PRODUCTOS : PRODUCTOS.filter((p) => p.cat === cat);

  return (
    <section style={{ background: BG, padding: '4.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
                fontWeight: 700,
                color: TXT,
              }}
            >
              Toda la{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: ACENTO }}>Colección</em>
            </h2>
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.72rem', color: SUBTLE }}>
            {filtered.length} productos
          </span>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: '7px 18px',
                borderRadius: '50px',
                border: `1.5px solid ${c === cat ? ACENTO : BORDER}`,
                background: c === cat ? `${ACENTO}14` : 'transparent',
                color: c === cat ? ACENTO : MUTED,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                fontWeight: c === cat ? 600 : 400,
                cursor: 'pointer',
                transition: 'all .18s',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
            gap: '18px',
          }}
        >
          {filtered.map((p, i) => (
            <div
              key={p.id}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                background: SURFACE,
                border: `1.5px solid ${hov === i ? ACENTO + '50' : BORDER}`,
                transition: 'border-color .25s, transform .25s, box-shadow .25s',
                transform: hov === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hov === i ? `0 12px 32px ${ACENTO}18` : 'none',
                cursor: 'pointer',
              }}
            >
              {/* Imagen */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  background: SURFACE2,
                }}
              >
                <img
                  src={p.img}
                  alt={p.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: hov === i ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform .45s ease',
                  }}
                />

                {/* Hover CTA */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '10px',
                    opacity: hov === i ? 1 : 0,
                    transition: 'opacity .3s',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
                  }}
                >
                  <button
                    onClick={() => onCart(p)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: ACENTO,
                      color: BTN_TXT,
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '.62rem',
                      fontWeight: 700,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    + Agregar
                  </button>
                </div>

                {/* Badge */}
                {p.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: ACENTO,
                      color: BTN_TXT,
                      fontSize: '.56rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px 16px' }}>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.8rem',
                    fontWeight: 500,
                    color: TXT,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '3px',
                  }}
                >
                  {p.nombre}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.65rem',
                    color: MUTED,
                    marginBottom: '8px',
                  }}
                >
                  {p.cat}
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    {p.precioAnt && (
                      <span
                        style={{
                          fontSize: '.68rem',
                          color: SUBTLE,
                          textDecoration: 'line-through',
                        }}
                      >
                        ${p.precioAnt.toLocaleString()}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: ACENTO,
                      }}
                    >
                      ${p.precio.toLocaleString()}
                    </span>
                  </div>
                  {p.precioAnt && (
                    <span
                      style={{
                        background: `${ACENTO}14`,
                        color: ACENTO,
                        fontSize: '.58rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '20px',
                      }}
                    >
                      -{Math.round((1 - p.precio / p.precioAnt) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACTO ─────────────────────────────────────────────────
function Contacto() {
  return (
    <section
      style={{ background: SURFACE, padding: '4rem 1.5rem', borderTop: `1px solid ${BORDER}` }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(1.6rem,3vw,2.4rem)',
            fontWeight: 700,
            color: TXT,
            marginBottom: '.75rem',
          }}
        >
          ¿Querés hacer un
          <br />
          <em style={{ color: ACENTO, fontWeight: 400 }}>pedido especial?</em>
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.85rem',
            color: MUTED,
            lineHeight: 1.8,
            marginBottom: '2rem',
            maxWidth: '420px',
            margin: '0 auto 2rem',
          }}
        >
          Personalizamos gorras con logos, bordados y diseños exclusivos. Escribinos por WhatsApp o
          redes.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${TIENDA.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '12px 28px',
              background: '#25d366',
              color: '#fff',
              borderRadius: '50px',
              textDecoration: 'none',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            WhatsApp
          </a>
          <a
            href={`https://instagram.com/${TIENDA.instagram}`}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '12px 28px',
              background: `${ACENTO}14`,
              border: `1.5px solid ${ACENTO}`,
              color: ACENTO,
              borderRadius: '50px',
              textDecoration: 'none',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '.78rem',
              fontWeight: 600,
            }}
          >
            @{TIENDA.instagram}
          </a>
        </div>
      </div>
    </section>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────
function CartDrawer({
  items,
  onClose,
  onQty,
  onRemove,
}: {
  items: any[];
  onClose: () => void;
  onQty: (id: number, q: number) => void;
  onRemove: (id: number) => void;
}) {
  const subtotal = items.reduce((a, i) => a + i.precio * i.qty, 0);
  const ship = subtotal > 8000 ? 0 : 800;
  const total = subtotal + ship;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: 'min(400px,100vw)',
          background: BG,
          borderLeft: `1px solid ${BORDER}`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 48px rgba(0,0,0,.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: TXT,
            }}
          >
            Carrito{' '}
            {items.length > 0 && (
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.72rem',
                  fontWeight: 400,
                  color: ACENTO,
                }}
              >
                {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: MUTED,
              fontSize: '1.1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '1rem',
              }}
            >
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem', color: MUTED }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.78rem',
                  color: ACENTO,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: SURFACE2,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '.8rem',
                      fontWeight: 500,
                      color: TXT,
                    }}
                  >
                    {item.nombre}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '.68rem',
                      color: MUTED,
                      marginTop: '2px',
                    }}
                  >
                    {item.cat}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: `1px solid ${BORDER}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      {[
                        {
                          l: '−',
                          a: () =>
                            item.qty > 1 ? onQty(item.id, item.qty - 1) : onRemove(item.id),
                        },
                        { l: String(item.qty), a: null },
                        { l: '+', a: () => onQty(item.id, item.qty + 1) },
                      ].map(({ l, a }, i) => (
                        <div
                          key={i}
                          onClick={a ?? undefined}
                          style={{
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: a ? 'pointer' : 'default',
                            color: i === 1 ? TXT : MUTED,
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: '.85rem',
                            fontWeight: i === 1 ? 600 : 400,
                            borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none',
                            background: i === 1 ? SURFACE : 'transparent',
                          }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: ACENTO,
                      }}
                    >
                      ${(item.precio * item.qty).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      marginTop: '6px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '.62rem',
                      color: SUBTLE,
                      padding: 0,
                      transition: 'color .2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = SUBTLE)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: `1px solid ${BORDER}`,
              background: SURFACE,
            }}
          >
            {[
              { l: 'Subtotal', v: `$${subtotal.toLocaleString()}` },
              {
                l: 'Envío',
                v: ship === 0 ? 'Gratis' : `$${ship.toLocaleString()}`,
                green: ship === 0,
              },
            ].map(({ l, v, green }: any) => (
              <div
                key={l}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}
              >
                <span
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.75rem', color: MUTED }}
                >
                  {l}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: '.75rem',
                    color: green ? '#16a34a' : SUBTLE,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            {ship > 0 && (
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.62rem',
                  color: SUBTLE,
                  marginBottom: '8px',
                }}
              >
                Envío gratis en pedidos desde $8.000
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: `1px solid ${BORDER}`,
                marginBottom: '1.1rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '.85rem',
                  fontWeight: 600,
                  color: TXT,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: ACENTO,
                }}
              >
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '14px',
                background: ACENTO,
                color: BTN_TXT,
                border: 'none',
                borderRadius: '50px',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.75rem',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'opacity .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Confirmar pedido
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '11px',
                background: 'transparent',
                border: `1px solid ${BORDER}`,
                borderRadius: '50px',
                color: MUTED,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                cursor: 'pointer',
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  const socials = [
    {
      label: 'IG',
      href: `https://instagram.com/${TIENDA.instagram}`,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'FB',
      href: `https://facebook.com/${TIENDA.facebook}`,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'WA',
      href: `https://wa.me/${TIENDA.whatsapp}`,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer style={{ background: TXT, padding: '0 1.5rem' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2.5rem',
            justifyContent: 'space-between',
            padding: '3rem 0 2.5rem',
            borderBottom: '0.5px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Brand */}
          <div style={{ minWidth: '160px' }}>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Cap<span style={{ color: ACENTO }}>Zone</span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.8,
                maxWidth: '200px',
              }}
            >
              {TIENDA.descripcion}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Contacto
            </p>
            <a
              href={`https://wa.me/${TIENDA.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                marginBottom: '6px',
              }}
            >
              📱 {TIENDA.whatsapp}
            </a>
            <a
              href={`https://instagram.com/${TIENDA.instagram}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
              }}
            >
              📷 @{TIENDA.instagram}
            </a>
          </div>

          {/* Ubicación */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Ubicación
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.72rem',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.75,
              }}
            >
              {TIENDA.ciudad}
              <br />
              {TIENDA.pais}
            </p>
          </div>

          {/* Redes */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: '.58rem',
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '.9rem',
                fontWeight: 600,
              }}
            >
              Seguinos
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ACENTO;
                    e.currentTarget.style.color = ACENTO;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.62rem',
            color: 'rgba(255,255,255,0.2)',
            textAlign: 'center',
            padding: '.9rem 0',
          }}
        >
          © {new Date().getFullYear()} <span style={{ color: ACENTO, opacity: 0.8 }}>CapZone</span>{' '}
          — Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

// ── TOAST ────────────────────────────────────────────────────
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        background: TXT,
        border: `1.5px solid ${ACENTO}`,
        borderRadius: '50px',
        padding: '10px 22px',
        fontFamily: "'DM Sans',sans-serif",
        fontSize: '.75rem',
        fontWeight: 500,
        color: '#fff',
        zIndex: 60,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all .3s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: ACENTO, marginRight: '6px', fontWeight: 700 }}>✓</span>
      {msg}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export interface PlantillaGorrasProps {
  tienda?: any;
  tema?: any;
  accent?: string;
  themeConfig?: any;
}
interface IHeroProps {
  titulo?: string;
  descripcion?: string;
  imagenCarrusel?: any[];
  tituloDos?: { primera: string; segunda: string };
}

interface INavProps {
  cartCount: number;
  onCart: () => void;
  logo?: string;
  titulo?: string;
}

export default function TemplateGorrasDemo({ tienda, accent, themeConfig }: PlantillaGorrasProps) {
  const resolvedAccent = accent || themeConfig?.primary || '#f97316';

  const resolvedTienda = useMemo(
    () => ({
      ...TIENDA,
      nombre: tienda?.titulo ?? TIENDA.nombre,
      descripcion: tienda?.descripcion ?? TIENDA.descripcion,
      whatsapp: tienda?.whatsapp ?? TIENDA.whatsapp,
      instagram: tienda?.instagram ?? TIENDA.instagram,
      ciudad: tienda?.ciudad ?? TIENDA.ciudad,
    }),
    [tienda]
  );
  //props para el Hero

  const heroProps: IHeroProps = {
    titulo: tienda?.titulo,
    descripcion: tienda?.descripcion,
    imagenCarrusel: tienda?.carrusel || [],
    tituloDos: tienda?.tituloDos,
  };

  //props para el navbar
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const navbarProps: INavProps = {
    cartCount,
    onCart: () => {},
    logo: tienda?.logoUrl,
    titulo: tienda?.nombre,
  };

  useEffect(() => {
    ACENTO = resolvedAccent;
    TIENDA = { ...resolvedTienda };
  }, [resolvedAccent, resolvedTienda]);

  const addToCart = (p: any) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      return ex
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });
    setToast({ msg: `${p.nombre} agregado`, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  return (
    <>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        img { display: block; }
        .cz-scroll { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        .cz-hide-mob { display: flex !important; }
        .cz-show-mob { display: none !important; }
        @media(max-width: 640px) {
          .cz-hide-mob { display: none !important; }
          .cz-show-mob { display: flex !important; }
        }
      `}</style>

      <div className="cz-scroll" style={{ background: BG }}>
        <Navbar {...navbarProps} />
        <Hero {...heroProps} />
        <Marquee />
        <TrustBadges />
        <Productos onCart={addToCart} />
        <Contacto />
        <Footer />
      </div>

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onQty={(id, q) => setCart((p) => p.map((i) => (i.id === id ? { ...i, qty: q } : i)))}
          onRemove={(id) => setCart((p) => p.filter((i) => i.id !== id))}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
