import gsap from 'gsap';
import {
  ArrowRight,
  Check,
  Globe,
  Inbox,
  MousePointer2,
  Package,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ICON from './../../../assets/Logo.svg';

// ─── Datos ────────────────────────────────────────────────────────────────────

const words = ['Rapida', 'Gratis', 'Tuya', 'Unica'];

const trustPoints = ['Sin comisiones', 'Pedidos por WhatsApp', 'Diseño propio', 'Mobile first'];

// Productos de demo — simulan una tienda real
const demoProducts = [
  {
    name: 'Campera Oversize',
    price: '$28.500',
    oldPrice: '$34.000',
    badge: 'Nuevo',
    badgeColor: '#ff6b3d',
    rating: 4.8,
    reviews: 124,
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    tag: 'Streetwear',
    accent: 'rgba(203,183,255,0.15)',
  },
  {
    name: 'Zapatillas Urban',
    price: '$45.900',
    oldPrice: null,
    badge: 'Hot',
    badgeColor: '#ff6b3d',
    rating: 4.9,
    reviews: 89,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    tag: 'Calzado',
    accent: 'rgba(255,107,61,0.10)',
  },
  {
    name: 'Vestido Floral',
    price: '$19.800',
    oldPrice: '$24.500',
    badge: '-20%',
    badgeColor: '#7c6bff',
    rating: 4.7,
    reviews: 56,
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    tag: 'Indumentaria',
    accent: 'rgba(124,107,255,0.12)',
  },
  {
    name: 'Bolso Artesanal',
    price: '$32.000',
    oldPrice: null,
    badge: 'Exclusivo',
    badgeColor: '#181311',
    rating: 5.0,
    reviews: 33,
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    tag: 'Accesorios',
    accent: 'rgba(203,183,255,0.12)',
  },
];

// ─── Sub-componente: Demo Window ──────────────────────────────────────────────

function DemoWindow() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const storeThemes = [
    { hex: '#ff6b3d', name: 'Naranja' },
    { hex: '#7c6bff', name: 'Púrpura' },
    { hex: '#10b981', name: 'Esmeralda' },
    { hex: '#3b82f6', name: 'Azul' },
  ];
  const [themeIdx, setThemeIdx] = useState(0);
  const themeIdxRef = useRef(0);
  const theme = storeThemes[themeIdx];

  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const colorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleInputRef = useRef<HTMLDivElement>(null);

  const [storeTitle, setStoreTitle] = useState('MiTienda');
  const storeTitleValRef = useRef('MiTienda');
  const changeTitle = (t: string) => {
    setStoreTitle(t);
    storeTitleValRef.current = t;
  };

  const [dashView, setDashView] = useState<'editor' | 'orders' | 'products'>('editor');
  const dashViewRef = useRef<'editor' | 'orders' | 'products'>('editor');
  const changeDashView = (v: any) => {
    setDashView(v);
    dashViewRef.current = v;
  };

  const [activeApp, setActiveApp] = useState<'dashboard' | 'store'>('dashboard');
  const activeAppRef = useRef<'dashboard' | 'store'>('dashboard');
  const changeApp = (app: 'dashboard' | 'store') => {
    setActiveApp(app);
    activeAppRef.current = app;
  };

  const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted'>('pending');

  const tabEditorRef = useRef<HTMLButtonElement>(null);
  const tabOrdersRef = useRef<HTMLButtonElement>(null);
  const tabProductsRef = useRef<HTMLButtonElement>(null);
  const tabStoreWebRef = useRef<HTMLButtonElement>(null);
  const acceptOrderRef = useRef<HTMLButtonElement>(null);

  const product = demoProducts[activeIdx];

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    themeIdxRef.current = themeIdx;
  }, [themeIdx]);

  function goTo(idx: number) {
    if (isAnimating || idx === activeIdxRef.current) return;
    setIsAnimating(true);

    // Fade out
    gsap.to(cardRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIdx(idx);
        // Fade in
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  }

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const animateCursorTo = (targetEl: HTMLElement | null, onHit: () => void) => {
    return new Promise<void>((resolve) => {
      if (!cursorRef.current || !containerRef.current || !targetEl) {
        onHit();
        resolve();
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      let targetX = targetRect.left - containerRect.left + targetRect.width / 2;
      let targetY = targetRect.top - containerRect.top + targetRect.height / 2;

      targetX -= 5;
      targetY += 5;

      const tl = gsap.timeline({ onComplete: () => resolve() });

      tl.to(cursorRef.current, {
        x: targetX,
        y: targetY,
        duration: 1.2,
        ease: 'power2.inOut',
      })
        .to(cursorRef.current, { scale: 0.85, duration: 0.15 })
        .call(() => {
          onHit();
        })
        .to(cursorRef.current, { scale: 1, duration: 0.15 })
        .to(cursorRef.current, {
          x: targetX + 15,
          y: targetY + 25,
          duration: 0.8,
          ease: 'power1.out',
        });
    });
  };

  useEffect(() => {
    if (cursorRef.current) gsap.set(cursorRef.current, { x: 100, y: 350 });

    let unmounted = false;
    const titles = ['StoreFree', 'MiTienda', 'UrbanLook'];
    let loops = 0;

    async function runDemo() {
      await delay(1500);

      while (!unmounted) {
        // --- SCENE 1: EDITOR ---
        if (activeAppRef.current !== 'dashboard') {
          changeApp('dashboard');
          await delay(800);
        }

        if (dashViewRef.current !== 'editor') {
          await animateCursorTo(tabEditorRef.current, () => changeDashView('editor'));
          await delay(800);
        }
        if (unmounted) break;

        if (titleInputRef.current) {
          await animateCursorTo(titleInputRef.current, () => {
            gsap.fromTo(
              titleInputRef.current,
              { scale: 1 },
              { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 }
            );
          });
          await delay(400);

          const nextTitle = titles[loops % titles.length];
          let curr = storeTitleValRef.current.replace('|', '');

          while (curr.length > 0 && !unmounted) {
            curr = curr.slice(0, -1);
            changeTitle(curr + '|');
            await delay(50);
          }
          if (unmounted) break;

          for (let i = 0; i < nextTitle.length; i++) {
            if (unmounted) break;
            curr += nextTitle[i];
            changeTitle(curr + '|');
            await delay(80);
          }
          changeTitle(nextTitle);
        }
        if (unmounted) break;
        await delay(800);

        const nextTheme = (themeIdxRef.current + 1) % storeThemes.length;
        await animateCursorTo(colorRefs.current[nextTheme], () => {
          setThemeIdx(nextTheme);
          if (colorRefs.current[nextTheme]) {
            gsap.fromTo(
              colorRefs.current[nextTheme],
              { scale: 1 },
              { scale: 0.7, duration: 0.1, yoyo: true, repeat: 1 }
            );
          }
        });
        if (unmounted) break;
        await delay(1200);

        // --- SCENE 2: TIENDA PÚBLICA ---
        // Hace de cuenta que apretó "Ver Tienda"
        await animateCursorTo(tabStoreWebRef.current, () => {
          if (tabStoreWebRef.current)
            gsap.fromTo(
              tabStoreWebRef.current,
              { scale: 1 },
              { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
            );
        });
        if (unmounted) break;
        await delay(800); // Pequeña pausa antes de transicionar

        changeApp('store');
        await delay(1000); // Wait for crossfade

        await animateCursorTo(addToCartRef.current, () => {
          setCartCount((c) => c + 1);
          if (cartIconRef.current)
            gsap.fromTo(
              cartIconRef.current,
              { scale: 1 },
              { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
          if (addToCartRef.current)
            gsap.fromTo(
              addToCartRef.current,
              { scale: 1 },
              { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }
            );
        });
        if (unmounted) break;
        await delay(1000);

        // Siguiente Producto
        const nextIdx = (activeIdxRef.current + 1) % demoProducts.length;
        await animateCursorTo(thumbRefs.current[nextIdx], () => {
          goTo(nextIdx);
        });
        if (unmounted) break;
        await delay(1200);

        // --- SCENE 3: VOLVER A DASHBOARD -> PEDIDOS ---
        changeApp('dashboard');
        await delay(1000);

        await animateCursorTo(tabOrdersRef.current, () => {
          changeDashView('orders');
          setOrderStatus('pending');
        });
        if (unmounted) break;
        await delay(1000);

        if (acceptOrderRef.current) {
          await animateCursorTo(acceptOrderRef.current, () => {
            setOrderStatus('accepted');
            gsap.fromTo(
              acceptOrderRef.current,
              { scale: 1 },
              { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }
            );
          });
        }
        if (unmounted) break;
        await delay(1200);

        // --- SCENE 4: CATALOGO PRODUCTOS ---
        await animateCursorTo(tabProductsRef.current, () => changeDashView('products'));
        if (unmounted) break;
        await delay(2000);

        loops++;
        await delay(1500);
      }
    }

    runDemo();

    return () => {
      unmounted = true;
      if (cursorRef.current) gsap.killTweensOf(cursorRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        background: '#fff',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(23,18,15,0.28), 0 0 0 1px rgba(255,255,255,0.06)',
        position: 'relative',
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'block',
        height: '700px',
      }}
    >
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <MousePointer2
          size={28}
          fill="#17120f"
          color="white"
          strokeWidth={1.5}
          style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.3))' }}
        />
      </div>
      {/* DASHBOARD VIRTUAL OS LAYER */}
      <div
        className="absolute inset-0 flex flex-row bg-[#fafafa] z-10 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: activeApp === 'dashboard' ? 1 : 0,
          pointerEvents: activeApp === 'dashboard' ? 'auto' : 'none',
        }}
      >
        {/* -- Sidebar Realista (228px) -- */}
        <div className="hidden md:flex flex-col shrink-0 bg-white border-r border-zinc-100 relative w-[228px]">
          {/* Logo */}
          <div className="flex items-center h-14 border-b border-zinc-100 px-3.5 shrink-0 gap-2.5">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: theme.hex, transition: 'all 0.3s' }}
            >
              <Store size={15} color="#fff" />
            </div>
            <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">Vitrina</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-2 space-y-0.5 mt-2">
            {/* Store Tab */}
            <button
              ref={tabEditorRef}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all select-none font-bold"
              style={
                dashView === 'editor'
                  ? { backgroundColor: `${theme.hex}15`, color: theme.hex }
                  : { color: '#71717a' }
              }
            >
              <Palette size={17} />
              <span className="flex-1 text-left text-[14px]">Mi Tienda</span>
            </button>
            {/* Products Tab */}
            <button
              ref={tabProductsRef}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all select-none font-medium mt-1"
              style={
                dashView === 'products'
                  ? { backgroundColor: `${theme.hex}15`, color: theme.hex }
                  : { color: '#71717a', backgroundColor: 'transparent' }
              }
            >
              <Package size={17} />
              <span className="flex-1 text-left text-[14px]">Productos</span>
            </button>
            {/* Orders Tab */}
            <button
              ref={tabOrdersRef}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all select-none font-medium mt-1 relative"
              style={
                dashView === 'orders'
                  ? { backgroundColor: `${theme.hex}15`, color: theme.hex }
                  : { color: '#71717a', backgroundColor: 'transparent' }
              }
            >
              <Inbox size={17} />
              <span className="flex-1 text-left text-[14px]">Pedidos</span>
              {orderStatus === 'pending' && (
                <span className="ml-auto mr-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black px-1">
                  1
                </span>
              )}
            </button>
            {/* Reseñas (Dummy) */}
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-zinc-500 font-medium mt-1 opacity-50">
              <Star size={17} />
              <span className="flex-1 text-left text-[14px]">Reseñas</span>
            </button>

            <div className="my-2 border-t border-zinc-100" />
            {/* Tienda Web CTA */}
            <button
              ref={tabStoreWebRef}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all select-none font-bold text-blue-600 bg-blue-50"
              style={{ transition: 'all 0.3s ease' }}
            >
              <Globe size={17} />
              <span className="flex-1 text-left text-[14px]">Ver Tienda Web</span>
            </button>
          </nav>

          {/* Bottom User info */}
          <div className="shrink-0 border-t border-zinc-100 flex items-center gap-2.5 px-3 py-3">
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[11px]"
              style={{
                backgroundColor: `${theme.hex}18`,
                color: theme.hex,
                transition: 'all 0.3s',
              }}
            >
              MC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold text-zinc-900 truncate leading-tight">
                M. Cardozo
              </p>
              <p className="text-[11px] text-zinc-400 truncate leading-tight mt-0.5">
                user@vitrina.app
              </p>
            </div>
          </div>
        </div>

        {/* -- Inner Content Realista -- */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
          {dashView === 'editor' && (
            <div className="flex flex-col h-full">
              <div className="px-5 py-4 border-b border-zinc-100 bg-white shrink-0">
                <h1 className="text-lg font-bold text-zinc-900 leading-none">Mi Tienda</h1>
                <p className="text-[11px] text-zinc-500 mt-1.5">Configuración y apariencia</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
                  <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                    Nombre
                  </label>
                  <div
                    ref={titleInputRef}
                    className="text-sm font-semibold text-zinc-900 border-b border-zinc-200 pb-1 h-6"
                  >
                    {storeTitle}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
                  <label className="block text-xs font-bold text-zinc-700 mb-3 uppercase tracking-wide">
                    Color principal
                  </label>
                  <div className="flex gap-2.5">
                    {storeThemes.map((t, i) => (
                      <div
                        key={t.hex}
                        ref={(el) => (colorRefs.current[i] = el)}
                        className="w-7 h-7 rounded-full transition-all"
                        style={{
                          background: t.hex,
                          border: i === themeIdx ? `2.5px solid #111827` : '2px solid transparent',
                          boxShadow:
                            i === themeIdx ? '0 0 0 2px #fff inset' : '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashView === 'orders' && (
            <div className="flex flex-col h-full">
              <div className="px-5 py-4 border-b border-zinc-100 bg-white shrink-0">
                <h1 className="text-lg font-bold text-zinc-900 leading-none">Pedidos</h1>
                <p className="text-[11px] text-zinc-500 mt-1.5">+1 nueva orden pendiente</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-black text-zinc-900">#1042</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${orderStatus === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {orderStatus === 'accepted' ? 'PREPARANDO' : 'PENDIENTE'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-zinc-800 leading-tight">
                      Camila Fernandez
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1 mb-4">
                      MercadoPago • Envío Rápido
                    </p>
                  </div>
                  {orderStatus === 'pending' ? (
                    <button
                      ref={acceptOrderRef}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white text-[12px] font-bold rounded-lg transition-all"
                    >
                      <Check size={14} /> Confirmar orden
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 text-[12px] font-bold rounded-lg border border-emerald-100">
                      <Check size={14} /> Orden confirmada
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {dashView === 'products' && (
            <div className="flex flex-col h-full">
              <div className="px-5 py-4 border-b border-zinc-100 bg-white shrink-0">
                <h1 className="text-lg font-bold text-zinc-900 leading-none">Catálogo</h1>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  {demoProducts.length} productos activos
                </p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2.5 overflow-y-auto">
                {demoProducts.slice(0, 3).map((p, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-zinc-100 p-2.5 flex items-center gap-3 shadow-sm"
                  >
                    <img
                      src={p.img}
                      className="w-9 h-9 rounded-md object-cover ring-1 ring-zinc-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-zinc-900 truncate leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">EN STOCK</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>{' '}
      {/* Closes DASHBOARD VIRTUAL OS LAYER */}
      {/* STOREFRONT VIRTUAL OS LAYER */}
      <div
        className="absolute inset-0 flex flex-col bg-[#ececf1] sm:p-3 sm:pb-0 z-20 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: activeApp === 'store' ? 1 : 0,
          pointerEvents: activeApp === 'store' ? 'auto' : 'none',
        }}
      >
        <div className="flex-1 bg-[#181311] rounded-t-xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
          {/* Barra de browser */}
          <div
            style={{
              background: '#221a16',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Botones mac */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <div
                  key={c}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: c }}
                />
              ))}
            </div>
            {/* URL bar */}
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '4px 12px',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace',
                marginLeft: 8,
              }}
            >
              {storeTitle.replace('|', '').toLowerCase().replace(/ /g, '') || 'mitienda'}
              .tiendafree.com
            </div>
          </div>

          {/* Contenido de la tienda demo */}
          <div
            style={{
              padding: '0',
              background: '#f7f4ef',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Mini navbar de la tienda */}
            <div
              style={{
                background: '#fff',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(23,18,15,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: '#181311',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Store size={14} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#17120f',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {storeTitle.replace('|', '') || '\u00A0'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  fontSize: 11,
                  color: '#7d5d48',
                  fontWeight: 600,
                }}
              >
                <span>Inicio</span>
                <span style={{ color: theme.hex, transition: 'color 0.3s ease' }}>Productos</span>
                <span>Nosotros</span>
              </div>
              <div
                ref={cartIconRef}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: theme.hex,
                  transition: 'background 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <ShoppingBag size={14} color="#fff" />
                {cartCount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#181311',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8,
                      color: '#fff',
                      fontWeight: 800,
                    }}
                  >
                    {cartCount}
                  </div>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div
              style={{
                padding: '0.6rem 1.25rem',
                display: 'flex',
                gap: 8,
                background: '#fff',
                borderBottom: '1px solid rgba(23,18,15,0.06)',
              }}
            >
              {['Todo', 'Streetwear', 'Calzado', 'Accesorios'].map((cat, i) => (
                <div
                  key={cat}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    background: i === 0 ? '#181311' : 'rgba(23,18,15,0.06)',
                    color: i === 0 ? '#fff' : '#7d5d48',
                    letterSpacing: '0.05em',
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>

            {/* Grid de productos: activo grande + thumbnails */}
            <div
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                gap: '0.75rem',
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Producto principal */}
              <div ref={cardRef} style={{ flex: '1 1 55%' }}>
                <div
                  style={{
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    background: product.accent,
                    border: '1px solid rgba(23,18,15,0.06)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {/* Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: product.badgeColor,
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.badge}
                  </div>
                </div>

                <div style={{ marginTop: '0.6rem', padding: '0 2px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: '#7d5d48',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        {product.tag}
                      </p>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: '#17120f',
                          margin: '2px 0 0',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {product.name}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: theme.hex,
                          margin: 0,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {product.price}
                      </p>
                      {product.oldPrice && (
                        <p
                          style={{
                            fontSize: 10,
                            color: '#b0a49c',
                            textDecoration: 'line-through',
                            margin: 0,
                          }}
                        >
                          {product.oldPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          fill={i < Math.floor(product.rating) ? theme.hex : 'none'}
                          stroke={i < Math.floor(product.rating) ? theme.hex : '#d0c8c0'}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 9, color: '#9e918a' }}>
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Botón agregar */}
                  <button
                    ref={addToCartRef}
                    style={{
                      marginTop: 16,
                      width: '100%',
                      padding: '12px',
                      borderRadius: 8,
                      border: 'none',
                      background: theme.hex,
                      transition: 'background 0.3s ease',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <ShoppingBag size={14} />
                    AGREGAR AL CARRITO
                  </button>
                </div>
              </div>

              {/* Thumbnails verticales */}
              <div
                style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {demoProducts.map((p, i) => (
                  <button
                    key={i}
                    ref={(el) => (thumbRefs.current[i] = el)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '0.4rem 0.5rem',
                      borderRadius: '0.6rem',
                      border: `1.5px solid ${i === activeIdx ? theme.hex : 'transparent'}`,
                      background: i === activeIdx ? `${theme.hex}15` : 'rgba(23,18,15,0.03)',
                      cursor: 'default',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 6,
                        objectFit: 'cover',
                        flexShrink: 0,
                        opacity: i === activeIdx ? 1 : 0.7,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#17120f',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: theme.hex,
                          margin: '1px 0 0',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {p.price}
                      </p>
                    </div>
                  </button>
                ))}

                {/* WhatsApp CTA */}
                <div
                  style={{
                    marginTop: 'auto',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '0.6rem',
                    background: 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#25d366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#17120f', margin: 0 }}>
                      Pedí por WhatsApp
                    </p>
                    <p style={{ fontSize: 8, color: '#7d5d48', margin: 0 }}>Respuesta inmediata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra inferior de progreso de dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
                padding: '0.5rem',
                borderTop: '1px solid rgba(23,18,15,0.06)',
              }}
            >
              {demoProducts.map((_, i) => (
                <button
                  key={i}
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: i === activeIdx ? theme.hex : 'rgba(23,18,15,0.15)',
                    border: 'none',
                    cursor: 'default',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero principal ───────────────────────────────────────────────────────────

export default function Hero() {
  const wordRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const wordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoBrushRefs = useRef<SVGPathElement[]>([]);

  const [wordIndex, setWordIndex] = useState(0);

  // ── Animación de entrada ──────────────────────────────────────────────────
  useEffect(() => {
    const els = [
      navRef.current,
      badgeRef.current,
      titleRef.current,
      subRef.current,
      btnsRef.current,
      trustRef.current,
    ].filter(Boolean);

    gsap.set(els, { opacity: 0, y: 24 });
    gsap.set(demoRef.current, { opacity: 0, y: 48, scale: 0.97 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to(
        logoBrushRefs.current,
        { strokeDashoffset: 0, duration: 0.25, stagger: 0.15, ease: 'power2.out' },
        '-=0.2'
      )
      .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.3')
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35')
      .to(btnsRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to(trustRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
      .to(
        demoRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, []);

  // ── Texto rotativo con flip 3D ────────────────────────────────────────────
  useEffect(() => {
    wordIntervalRef.current = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        rotateX: -90,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setWordIndex((p) => (p + 1) % words.length);
          gsap.fromTo(
            wordRef.current,
            { rotateX: 90, opacity: 0 },
            { rotateX: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    }, 2500);

    return () => {
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      style={{ background: '#f7f4ef', minHeight: '100vh' }}
      className="relative overflow-hidden"
    >
      {/* Detalles decorativos de fondo — usando el morado como acento, no como fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(203,183,255,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 10% 20%, rgba(255,107,61,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10 h-20"
      >
        <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <img
            src={ICON}
            alt="TiendiZi"
            className="w-12 h-16 sm:w-20 sm:h-[100px] object-contain"
          />
          <div>
            <p className="text-lg sm:text-2xl font-black tracking-[-0.04em] flex items-center">
              <span className="relative inline-flex items-center justify-center isolate">
                {/* 3 Diagonal Brush Strokes */}
                <svg
                  className="absolute inset-0 -z-10 mx-auto w-[150%] h-[160%] -translate-x-3 -translate-y-2"
                  viewBox="0 0 100 48"
                  fill="none"
                  stroke="#fca326"
                  strokeWidth="14"
                  strokeLinecap="round"
                >
                  <path
                    ref={(el) => {
                      if (el) logoBrushRefs.current[1] = el;
                    }}
                    className="opacity-95"
                    d="M92,24 L10,24"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                  />
                  <path
                    ref={(el) => {
                      if (el) logoBrushRefs.current[2] = el;
                    }}
                    className="opacity-90"
                    d="M8,38 L95,34"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                  />
                </svg>
                <p className="relative z-10 text-[#15110e] px-1">
                  <span className="text-purple-600">TiendiZi</span>
                </p>
              </span>
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#plataforma"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Funciones
          </a>
          <a
            href="#diseno"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Diseños
          </a>
          <a
            href="#precios"
            className="text-sm font-semibold text-[#5f554f] hover:text-[#17120f] transition-colors"
          >
            Precios
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            to="/login"
            className="hidden text-sm font-bold text-[#17120f] sm:block hover:opacity-70 transition-opacity"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex h-9 sm:h-11 items-center gap-1 sm:gap-2 rounded-full bg-[#181311] px-3 sm:px-5 text-[11px] sm:text-sm font-bold uppercase tracking-[0.05em] sm:tracking-[0.12em] text-white hover:bg-[#2c241f] transition-colors whitespace-nowrap"
          >
            Crear tienda
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </nav>

      {/* ── Copy central ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-10 text-center sm:px-8 lg:px-10 relative">
        {/* Badge */}


        {/* Título */}
        <h1
          ref={titleRef}
          className="mt-7 text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.92] tracking-[-0.06em] text-[#15110e]"
        >
          {/* Mobile: dos líneas. sm+: misma línea */}
          <span className="flex flex-col items-center sm:inline-flex sm:flex-row sm:whitespace-nowrap sm:items-center sm:justify-center gap-y-1 sm:gap-y-0">
            Tu tienda online
            <span className="sm:ml-3" style={{ perspective: '600px', display: 'inline-block' }}>
              <span
                ref={wordRef}
                style={{
                  color: '#ff6b3d',
                  display: 'inline-block',
                  transformStyle: 'preserve-3d',
                  minWidth: '3ch',
                }}
              >
                {words[wordIndex]}
              </span>
            </span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          ref={subRef}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#64584f] sm:text-xl"
        >
          Creá tu tienda en minutos, recibí pedidos por WhatsApp y vendé{' '}
          <span className="relative inline-block whitespace-nowrap text-[#15110e] font-semibold">
            sin pagar comisiones
            {/* Wavy underline */}
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2 text-[#df06d1]"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <path d="M2,13 Q16,2 32,12 T64,12 T98,12" />
            </svg>
          </span>
          . Diseño profesional desde el primer día.
        </p>

        {/* Static Quote Bubble */}
        {/* <div
          className="mx-auto mt-6 flex items-start justify-center gap-2.5 max-w-sm"
          style={{ transform: 'rotate(-1deg)' }}
        >
          <img
            src="https://ui-avatars.com/api/?name=Martin+C&background=181311&color=fff&rounded=true&size=128"
            alt="User"
            className="w-8 h-8 rounded-full border-[2px] border-white shadow-sm shadow-[#181311]/10"
          />
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-[0_4px_12px_-4px_rgba(23,18,15,0.1)] border border-[#181311]/5">
            <p className="font-handdrawn text-lg text-[#15110e] leading-none mb-1 text-left">
              "¡Es lo más sencillo que hay!"
            </p>
            <p className="text-[10px] text-[#64584f] font-bold tracking-wider text-right">
              - Martín C.
            </p>
          </div>
        </div> */}

        {/* Botones */}
        <div
          ref={btnsRef}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row relative z-20"
        >
          <Link
            to="/register"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#181311] px-9 text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-[#2c241f] transition-colors shadow-[0_8px_24px_rgba(23,18,15,0.18)] relative"
          >
            Crear mi tienda gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#diseno"
            className="inline-flex h-14 items-center justify-center rounded-full border border-[#20150d]/12 bg-white px-9 text-sm font-semibold text-[#1c1613] hover:bg-[#f0ebe4] transition-colors"
          >
            Ver diseños
          </a>

          {/* Arrow & Hand-drawn Note */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[75%] md:translate-x-[90%] md:right-auto md:left-1/2 ml-36 pointer-events-none hidden lg:flex flex-col items-start"
            style={{ transform: 'rotate(4deg)' }}
          >
            <svg
              className="w-14 h-14 text-[#ff6b3d] -rotate-12 absolute -left-12 top-2"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15,90 Q40,40 85,25" />
              <path d="M65,25 L85,25 L75,45" />
            </svg>
            <div className="font-handdrawn text-2xl text-[#64584f] whitespace-nowrap pl-6 pt-10 rotate-6">
              0% Comisiones, <span className="text-[#181311] font-bold">100% tuyo!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seccion de la demo*/}
      <div
        ref={demoRef}
        className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Background Glow / Difuminado */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-[1200px] aspect-[2/1] pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(124, 107, 255, 0.18) 0%, rgba(255, 107, 61, 0.08) 40%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Label */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-[#23180f]/8" />

          <div className="h-px flex-1 bg-[#23180f]/8" />
        </div>

        <DemoWindow />

        {/* Nota debajo */}
        <p className="mt-4 text-center text-[11px] text-[#b0a49c]">
          Así se ve tu tienda. Podés personalizar colores, logo y productos.
        </p>
      </div>
    </section>
  );
}
