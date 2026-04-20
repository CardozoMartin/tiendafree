/**
 * BenefitStack.tsx — TiendiZi
 * Mecánica: horizontal scroll con GSAP ScrollTrigger
 * El wrapper se pinea, los slides viajan de derecha a izquierda.
 * 4 slides narrativos:
 *  01 — Notificación WhatsApp  (crema)
 *  02 — Personalizá tu tienda  (oscuro, simple)
 *  03 — Catálogo PDF            (crema)
 *  04 — $0 brutalista           (oscuro)
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Check,
  FileText,
  Package,
  Palette,
  ShoppingBag,
  Sparkles,
  Store,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// ─── Datos ────────────────────────────────────────────────────────────────────

const demoProducts = [
  {
    name: 'Campera Oversize',
    price: '$28.500',
    badge: 'Nuevo',
    badgeColor: '#ff6b3d',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400',
    tag: 'Streetwear',
  },
  {
    name: 'Zapatillas Urban',
    price: '$45.900',
    badge: 'Hot',
    badgeColor: '#ff6b3d',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    tag: 'Calzado',
  },
  {
    name: 'Vestido Floral',
    price: '$19.800',
    badge: '-20%',
    badgeColor: '#7c6bff',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    tag: 'Indumentaria',
  },
  {
    name: 'Bolso Artesanal',
    price: '$32.000',
    badge: 'Exclusivo',
    badgeColor: '#181311',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400',
    tag: 'Accesorios',
  },
];

const storeThemes = [
  { hex: '#ff6b3d', name: 'Naranja' },
  { hex: '#7c6bff', name: 'Púrpura' },
  { hex: '#10b981', name: 'Esmeralda' },
  { hex: '#3b82f6', name: 'Azul' },
];

// ─── Slide 01: Teléfono WhatsApp ─────────────────────────────────────────────

const waOrders = [
  { name: 'Camila F.', item: 'Campera Oversize 🧥', amount: '$28.500' },
  { name: 'Lucas M.', item: 'Zapatillas Urban 👟', amount: '$45.900' },
  { name: 'Vale R.', item: 'Vestido Floral 🌸', amount: '$19.800' },
  { name: 'Mateo D.', item: 'Bolso Artesanal 👜', amount: '$32.000' },
];

function PhoneMockup() {
  const [msgs, setMsgs] = useState<typeof waOrders>([]);
  const iRef = useRef(0);

  useEffect(() => {
    const fire = () => {
      const o = waOrders[iRef.current % waOrders.length];
      setMsgs((prev) => [o, ...prev].slice(0, 3));
      iRef.current++;
    };
    fire();
    const iv = setInterval(fire, 2600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ width: 260, background: '#1a1a1a', borderRadius: 36, padding: '14px 6px 20px', boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 7px #111', flexShrink: 0 }}>
      <div style={{ width: 80, height: 22, background: '#111', borderRadius: 11, margin: '0 auto 10px' }} />
      <div style={{ background: '#e5ddd5', borderRadius: 24, overflow: 'hidden', minHeight: 360 }}>
        <div style={{ background: '#075e54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🛍️</div>
          <div>
            <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, margin: 0 }}>TiendiZi Pedidos</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, margin: 0 }}>en línea</p>
          </div>
          <div style={{ marginLeft: 'auto', background: '#25d366', color: '#fff', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>
            {msgs.length}
          </div>
        </div>
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 300 }}>
          {msgs.map((m, i) => (
            <div key={`${m.name}-${i}`} style={{ background: '#fff', borderRadius: '10px 10px 10px 2px', padding: '8px 10px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', opacity: i === 0 ? 1 : 0.65 - i * 0.15, transform: `scale(${1 - i * 0.03})`, transformOrigin: 'top left', transition: 'all 0.4s ease' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#075e54', margin: '0 0 2px' }}>🛒 Nuevo pedido</p>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a', margin: '0 0 1px' }}>{m.name}</p>
              <p style={{ fontSize: 9, color: '#666', margin: '0 0 5px', lineHeight: 1.4 }}>{m.item}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#25d366' }}>{m.amount}</span>
                <span style={{ fontSize: 8, color: '#aaa' }}>{new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 02: Color picker simple ───────────────────────────────────────────

function ThemePicker() {
  const [active, setActive] = useState(1);
  const theme = storeThemes[active];

  useEffect(() => {
    const iv = setInterval(() => setActive((p) => (p + 1) % storeThemes.length), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ width: 320, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 72px rgba(0,0,0,0.32)', flexShrink: 0 }}>
      <div style={{ background: '#221a16', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 5, padding: '3px 10px', fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
          urbanlook.tiendizi.com
        </div>
      </div>
      <div style={{ background: '#f7f4ef' }}>
        <div style={{ background: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(23,18,15,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: theme.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s' }}>
              <Store size={11} color="#fff" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#17120f', letterSpacing: '-0.02em' }}>UrbanLook</span>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 9, color: '#7d5d48', fontWeight: 600 }}>
            <span>Inicio</span>
            <span style={{ color: theme.hex, transition: 'color 0.5s' }}>Productos</span>
          </div>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: theme.hex, transition: 'background 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={11} color="#fff" />
          </div>
        </div>
        <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {demoProducts.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,18,15,0.06)' }}>
              <div style={{ position: 'relative' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: 5, left: 5, padding: '2px 6px', borderRadius: 999, background: p.badgeColor, color: '#fff', fontSize: 7, fontWeight: 800 }}>
                  {p.badge}
                </div>
              </div>
              <div style={{ padding: '6px 8px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#17120f', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                <p style={{ fontSize: 11, fontWeight: 900, color: theme.hex, margin: 0, transition: 'color 0.5s' }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px 14px', borderTop: '1px solid rgba(23,18,15,0.06)', background: '#fff' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#7d5d48', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Color de tu marca</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {storeThemes.map((t, i) => (
              <div key={t.hex} onClick={() => setActive(i)} style={{ width: 24, height: 24, borderRadius: '50%', background: t.hex, border: i === active ? '2.5px solid #181311' : '2px solid transparent', boxShadow: i === active ? '0 0 0 2px #fff inset' : '0 1px 3px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.3s', transform: i === active ? 'scale(1.15)' : 'scale(1)' }} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: theme.hex, transition: 'color 0.5s' }}>{theme.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 03: PDF mockup ─────────────────────────────────────────────────────

function PDFMockup() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = () => {
      setDone(false);
      setProgress(0);
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 16 + 6;
        if (p >= 100) {
          clearInterval(iv);
          setProgress(100);
          setTimeout(() => setDone(true), 250);
          setTimeout(run, 4200);
          return;
        }
        setProgress(p);
      }, 110);
    };
    const t = setTimeout(run, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: 320, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 72px rgba(23,18,15,0.2)', flexShrink: 0 }}>
      <div style={{ background: '#f4f4f4', padding: '10px 14px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: '#e0e0e0', borderRadius: 5, padding: '3px 10px', fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
          catalogo-urbanlook.pdf
        </div>
        <FileText size={13} color="#999" />
      </div>
      <div style={{ padding: 16, background: '#fafafa' }}>
        <div style={{ background: '#181311', borderRadius: 12, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#ff6b3d', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Catálogo</p>
            <p style={{ color: '#fff', fontSize: 16, fontWeight: 900, margin: '2px 0 0', letterSpacing: '-0.03em' }}>UrbanLook</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={18} color="#ff6b3d" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {demoProducts.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: 65, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '6px 8px' }}>
                <p style={{ fontSize: 8, color: '#7d5d48', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1px' }}>{p.tag}</p>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#17120f', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                <p style={{ fontSize: 11, fontWeight: 900, color: '#ff6b3d', margin: 0 }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #eee', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 8, color: '#aaa', margin: 0 }}>urbanlook.tiendizi.com</p>
          <p style={{ fontSize: 8, color: '#aaa', margin: 0 }}>{demoProducts.length} productos</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #eee' }}>
        {!done ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: '#64584f', fontWeight: 600 }}>Generando catálogo...</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ff6b3d' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 4, background: '#f0ebe4', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ff6b3d', borderRadius: 999, width: `${progress}%`, transition: 'width 0.12s ease' }} />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={13} color="#16a34a" strokeWidth={3} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', margin: 0 }}>¡Listo para compartir!</p>
              <p style={{ fontSize: 9, color: '#71717a', margin: 0 }}>4 productos · generado en 1 clic</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Config de slides ─────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 'notif',
    bg: '#f7f4ef',
    dark: false,
    tag: 'WhatsApp nativo',
    tagColor: '#169b49',
    tagBg: 'rgba(37,211,102,0.10)',
    tagBorder: 'rgba(37,211,102,0.20)',
    tagDot: '#25d366',
    headline: 'Son las 11pm',
    headlineAccent: 'y acabo de vender.',
    accentColor: '#ff6b3d',
    body: 'Cada pedido llega directo a tu WhatsApp. Sin apps raras, sin mail que nadie lee. Tu cliente escribe, vos vendés.',
    pills: ['Pedidos al instante', 'Sin intermediarios', 'Confirmación automática', 'Chat directo'],
    pillDot: '#25d366',
    Visual: PhoneMockup,
  },
  {
    id: 'theme',
    bg: '#181311',
    dark: true,
    tag: 'Tu identidad',
    tagColor: 'rgba(255,255,255,0.65)',
    tagBg: 'rgba(255,255,255,0.07)',
    tagBorder: 'rgba(255,255,255,0.13)',
    tagDot: '#7c6bff',
    headline: 'Tu tienda,',
    headlineAccent: 'tu cara.',
    accentColor: '#7c6bff',
    body: 'Cambiá colores, nombre y estilo en segundos. Sin código, sin diseñador. Tu marca se ve profesional desde el primer día.',
    pills: ['Logo propio', 'Paleta libre', 'Banners editables', 'Mobile first'],
    pillDot: '#7c6bff',
    Visual: ThemePicker,
  },
  {
    id: 'pdf',
    bg: '#f7f4ef',
    dark: false,
    tag: 'Catálogos PDF',
    tagColor: '#c2410c',
    tagBg: 'rgba(255,107,61,0.10)',
    tagBorder: 'rgba(255,107,61,0.20)',
    tagDot: '#ff6b3d',
    headline: 'Mandé el catálogo',
    headlineAccent: 'y cerré en el día.',
    accentColor: '#ff6b3d',
    body: 'Un clic y tu catálogo está listo para mandar por WhatsApp. Tus clientes mayoristas eligen y compran. Sin ir y venir.',
    pills: ['1 clic, listo', 'Diseño profesional', 'Envío por WhatsApp', 'Siempre actualizado'],
    pillDot: '#ff6b3d',
    Visual: PDFMockup,
  },
  {
    id: 'zero',
    bg: '#181311',
    dark: true,
    tag: 'Sin letra chica',
    tagColor: 'rgba(255,255,255,0.65)',
    tagBg: 'rgba(255,255,255,0.07)',
    tagBorder: 'rgba(255,255,255,0.13)',
    tagDot: '#ff6b3d',
    headline: '$0 en comisiones.',
    headlineAccent: 'Jamás.',
    accentColor: '#ff6b3d',
    body: '',
    pills: [],
    pillDot: '#ff6b3d',
    Visual: null,
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function BenefitStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalSlides = SLIDES.length;
      const moveAmount = (totalSlides - 1) * 100;

      gsap.to(trackRef.current, {
        x: () => `-${moveAmount}vw`,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalSlides * 100}vh`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * totalSlides), totalSlides - 1);
            setActiveIdx(idx);
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const current = SLIDES[activeIdx];

  return (
    <section id="plataforma">
      {/* Encabezado exterior */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-32 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ background: 'rgba(203,183,255,0.20)', border: '1px solid rgba(124,107,255,0.18)', color: '#5a4acc' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              ¿Por qué elegir TiendiZi?
            </span>
            <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-[#15110e] sm:text-5xl">
              Momentos reales,{' '}
              <span className="text-[#ff6b3d]">resultados concretos.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[#64584f]">
            Scrolleá para ver cada historia →
          </p>
        </div>
      </div>

      {/* Zona pineable */}
      <div ref={sectionRef} style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Track horizontal */}
        <div
          ref={trackRef}
          style={{ display: 'flex', width: `${SLIDES.length * 100}vw`, willChange: 'transform' }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              style={{
                width: '100vw', minHeight: '100vh',
                background: s.bg,
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Glow */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: s.dark
                  ? 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(124,107,255,0.07) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(203,183,255,0.14) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 20%, rgba(255,107,61,0.06) 0%, transparent 60%)',
              }} />

              {/* Número decorativo */}
              <span style={{
                position: 'absolute', bottom: -40, right: -10,
                fontSize: 'clamp(10rem, 22vw, 22rem)',
                fontWeight: 900, lineHeight: 1,
                color: s.dark ? 'rgba(255,255,255,0.03)' : 'rgba(23,18,15,0.04)',
                letterSpacing: '-0.06em',
                pointerEvents: 'none', userSelect: 'none',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Slide $0: especial brutalista */}
              {s.id === 'zero' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{ background: s.tagBg, border: `1px solid ${s.tagBorder}`, color: s.tagColor, marginBottom: '2rem' }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.tagDot, flexShrink: 0 }} />
                    {s.tag}
                  </span>

                  <div style={{ fontSize: 'clamp(7rem, 20vw, 16rem)', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.06em', color: '#ff6b3d', marginBottom: '1.5rem' }}>
                    $0
                  </div>

                  <p style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                    en comisiones.{' '}
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>Jamás.</span>
                  </p>

                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 420, lineHeight: 1.7, marginBottom: '2.5rem' }}>
                    Ni por la primera venta, ni por la décima mil.
                    Vos ponés el precio, vos te quedás con todo.
                  </p>

                  <a
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white"
                    style={{ background: '#ff6b3d' }}
                  >
                    Crear mi tienda gratis
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', width: '100%' }}>
                    {[
                      { n: '0%', label: 'comisión' },
                      { n: '∞', label: 'productos' },
                      { n: '1 clic', label: 'para crear' },
                    ].map((st) => (
                      <div key={st.n} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>{st.n}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{st.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

              ) : (
                /* Layout estándar: texto | visual */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) auto',
                  gap: '4rem',
                  alignItems: 'center',
                  padding: '4rem clamp(1.5rem, 6vw, 5rem)',
                  maxWidth: 1100,
                  margin: '0 auto',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Texto */}
                  <div>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]"
                      style={{ background: s.tagBg, border: `1px solid ${s.tagBorder}`, color: s.tagColor, marginBottom: '2rem', display: 'inline-flex' }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.tagDot, flexShrink: 0 }} />
                      {s.tag}
                    </span>

                    <h2 style={{
                      fontSize: 'clamp(2.6rem,5.5vw,5rem)',
                      fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.06em',
                      color: s.dark ? '#fff' : '#15110e',
                      margin: '0 0 1.75rem',
                    }}>
                      {s.headline}<br />
                      <span style={{ color: s.accentColor }}>{s.headlineAccent}</span>
                    </h2>

                    <p style={{ fontSize: 17, lineHeight: 1.75, color: s.dark ? 'rgba(255,255,255,0.55)' : '#64584f', maxWidth: 420, margin: '0 0 2.25rem' }}>
                      {s.body}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {s.pills.map((f) => (
                        <span key={f} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 7,
                          borderRadius: 999, padding: '8px 14px',
                          fontSize: 12, fontWeight: 600,
                          background: s.dark ? 'rgba(255,255,255,0.07)' : 'rgba(23,18,15,0.05)',
                          border: `1px solid ${s.dark ? 'rgba(255,255,255,0.12)' : 'rgba(23,18,15,0.08)'}`,
                          color: s.dark ? 'rgba(255,255,255,0.7)' : '#64584f',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.pillDot, flexShrink: 0 }} />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  {s.Visual && <s.Visual />}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots de progreso */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 50, pointerEvents: 'none',
        }}>
          <Zap size={13} style={{ color: current.dark ? 'rgba(255,255,255,0.25)' : 'rgba(23,18,15,0.2)', transform: 'rotate(-90deg)' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {SLIDES.map((sl, i) => (
              <div key={sl.id} style={{
                height: 6,
                width: i === activeIdx ? 24 : 6,
                borderRadius: 999,
                background: i === activeIdx
                  ? (current.dark ? '#fff' : '#181311')
                  : (current.dark ? 'rgba(255,255,255,0.18)' : 'rgba(23,18,15,0.14)'),
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            color: current.dark ? 'rgba(255,255,255,0.25)' : 'rgba(23,18,15,0.25)',
          }}>
            {String(activeIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
