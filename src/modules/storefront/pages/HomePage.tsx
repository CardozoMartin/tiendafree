import { useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Feature {
  icon: string;
  bg: string;
  color: string;
  glow: string;
  title: string;
  desc: string;
}
interface Step {
  num: string;
  img: string;
  alt: string;
  title: string;
  desc: string;
}
interface PricingItem {
  text: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const BRANDS: string[] = ['CAFÉ MARTÍNEZ', 'GRIDO', 'HAVANNA', 'MOSTRASA', 'FREDDO'];

const FEATURES: Feature[] = [
  {
    icon: 'store',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
    glow: 'shadow-violet-100',
    title: 'Tienda Gratis',
    desc: 'Publicá productos ilimitados sin costos de mantenimiento ni comisiones por venta.',
  },
  {
    icon: 'chat_bubble',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    glow: 'shadow-emerald-100',
    title: 'WhatsApp Directo',
    desc: 'Recibí consultas y pedidos de tus clientes directamente en tu chat personal.',
  },
  {
    icon: 'inventory_2',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
    glow: 'shadow-amber-100',
    title: 'Gestión Simple',
    desc: 'Administrá inventario, precios y fotos de forma intuitiva desde tu celular.',
  },
];

const STEPS: Step[] = [
  {
    num: '01',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTlfBRQ8f82-EFt0jSFXxvuwRRWVXNA6gww6QePDoL2PTNXfNbrq3rLvYENABwZbF5Le4WWpEexHC6Ir2UyQJNG_Z7TwwpkgdN_WsAuC34-jSr2BGz3yEE_aIlBFN8gXIOGOy9t3zJJoto6kpTli_EUKtNijCaw0qV9Cr2zhI2aWlnSTDWpm7kTlgKSiJa_T5joZ7kMKk5Mr4QsObNIdebG9Za6wypZzkD-btZNB9S2OBkF9IZvdXJKh6R2liqvgOqPX0z4fVNMdHl',
    alt: 'Registrarse en Vitrina',
    title: 'Registrate',
    desc: 'Completá los datos de tu negocio y elegí tu nombre de tienda único.',
  },
  {
    num: '02',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB62wEzinPB8-y_yVALGnU_CAhweff1iP1ICmgKIyv5CEkTdh2LefWMUDd-NEYVqqN5h-KLqdbdXWgpvVBORGZsBA2lSug_U4yBaBZbPuhej4zsFE9xgogejzSj6USayFozIYQ3Mrg-8VCj9F23AD7K0e-fIoKRpQSQlNAOu-7Ig-XiM5y7xtEI6dYqxdbXM8emTB-MGd13648XgrHJ3b0My5c5p7GMV2d_hg0w2zLnIgVUfadosNyEfn8ICeJJ-dqhwbXU3PtF2NS-',
    alt: 'Subir productos',
    title: 'Subí tus productos',
    desc: 'Cargá fotos, descripción y precios. Tan fácil como postear en redes.',
  },
  {
    num: '03',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbXp4BgpZJYrLe3JLUYY23D5vWSSGXPMBB-sCykc5KpqWYRLjEMIumnLkvSQ8ToH8d_GrzD2GFGdwMKBqd8UYlinINp6mGdrwDPMRFD8eWYGZBdAyqFi0UFI7uFZ_YgKIpjWN3FLl6jvnFYQ1-QxE1MlRFBGgm5_pf6hmKJRxS3Vn84t0e6GNn7_EUAiAXkkV-K95RhtAf6JZHI7zG2PEYLC3NZz3lgAsjG63thvJigjkdEmkJ19hTR_78o7Of9fYjKgOeymAglgji',
    alt: 'Vender y conectar',
    title: 'Vendé y Conectá',
    desc: 'Compartí tu link y empezá a recibir pedidos. Los clientes te encuentran por cercanía.',
  },
];

const PRICING_ITEMS: PricingItem[] = [
  { text: 'Productos ilimitados' },
  { text: 'Link personalizado de tienda' },
  { text: 'Botón de pedido por WhatsApp' },
  { text: 'Ubicación en el Marketplace' },
  { text: 'Soporte por comunidad' },
];

const STATS = [
  { value: '12K+', label: 'Tiendas activas' },
  { value: '$0', label: 'Costo mensual' },
  { value: '98%', label: 'Satisfacción' },
];

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Shared ─────────────────────────────────────────────────────────────────
const MI = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ── Header ─────────────────────────────────────────────────────────────────

// ── Hero ───────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Background mesh */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#6344ee]/8 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-300/20 blur-[100px]" />
    </div>

    <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-10 lg:pt-24 lg:pb-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div className="flex flex-col gap-8" style={{ animation: 'fadeUp 0.7s ease both' }}>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6344ee]/20 bg-[#6344ee]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6344ee]">
              <span className="size-1.5 rounded-full bg-[#6344ee] animate-pulse" />
              Impulsá tu comercio en Argentina
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.75rem]">
            Tu negocio local,
            <br />
            ahora{' '}
            <span className="relative">
              <span className="text-[#6344ee]">online y gratis</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path
                  d="M2 9 C60 3, 180 3, 298 9"
                  stroke="#6344ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-[500px] text-lg leading-relaxed text-slate-600">
            Creá tu tienda en minutos, cargá tus productos y empezá a vender. Conectá con clientes
            de tu zona{' '}
            <strong className="font-semibold text-slate-800">sin pagar comisiones</strong>.
          </p>

          {/* Stats bar */}
          <div className="flex gap-6 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-[#6344ee]">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 h-14 rounded-2xl bg-[#6344ee] px-8 text-base font-bold text-white shadow-xl shadow-[#6344ee]/30 transition-all hover:-translate-y-1 hover:shadow-[#6344ee]/40 active:scale-95">
              Crear tienda gratis
              <MI
                name="arrow_forward"
                className="!text-base transition-transform group-hover:translate-x-1"
              />
            </button>
            <button className="inline-flex items-center gap-2 h-14 rounded-2xl border-2 border-slate-200 bg-white px-8 text-base font-bold text-slate-800 transition-all hover:border-[#6344ee]/40 hover:bg-[#6344ee]/3 active:scale-95">
              <MI name="play_circle" className="text-[#6344ee] !text-xl" />
              Ver demo
            </button>
          </div>

          {/* Trust signal */}
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <MI name="verified" className="text-green-500 !text-base" />
            Sin tarjeta de crédito · Sin permanencia · 100% gratis
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative" style={{ animation: 'fadeUp 0.7s ease 0.2s both' }}>
          {/* Glow */}
          <div className="absolute inset-8 rounded-3xl bg-[#6344ee]/20 blur-3xl -z-10" />

          <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-visible p-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVteJ3zEDQEN5zmQ2qhJpoxsLneHJfe8Jn8DS00-42RE8f5oVTr0Qo-nDxPsI31LRNB_8vJCa4L58Y8Xcg7QRILf8L6q3_GPTJ0F-eYDs8qrtjhkZVDdWMyaltiXmeXwhSNot3Y_PM89AkU_HdD4cTeEw-juiK-ppPhC3l7D9cOIWktfCLO8SglxJ2bocINmg2hZ68BjKa5bm1e7Wapj2I1gYBFAfMQoeUPtvMMcIcn1MC8RKutFbEMaz_hZNMdD37aSA3XC26lEFT"
              alt="Dashboard de Vitrina"
              className="w-full rounded-2xl object-cover aspect-[4/3]"
            />

            {/* Floating notification card */}
            <div
              className="absolute -bottom-5 -left-5 rounded-2xl bg-white shadow-xl border border-slate-100 p-4 flex items-center gap-3 hidden md:flex"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <div className="size-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <MI name="shopping_bag" className="!text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">¡Nueva venta!</p>
                <p className="text-xs text-slate-500">hace 2 minutos</p>
              </div>
              <div className="ml-1 size-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            </div>

            {/* Floating users pill */}
            <div className="absolute -top-4 -right-4 rounded-full bg-[#6344ee] text-white text-xs font-bold px-4 py-2 shadow-lg shadow-[#6344ee]/30 hidden md:flex items-center gap-1.5">
              <MI name="group" className="!text-sm" />
              12.4K tiendas
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Brands ─────────────────────────────────────────────────────────────────
const Brands = () => (
  <section className="border-y border-slate-200/70 bg-white py-10">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        Negocios que ya confían en Vitrina
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
        {BRANDS.map((brand) => (
          <div
            key={brand}
            className="font-black text-lg tracking-tight text-slate-300 hover:text-slate-500 transition-colors cursor-default select-none"
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Features ───────────────────────────────────────────────────────────────
const Features = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10" id="explorar">
      <div
        className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <span className="inline-block rounded-full bg-[#6344ee]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6344ee] mb-4">
          Funcionalidades
        </span>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Todo lo que necesitás para crecer
        </h2>
        <p className="mt-3 text-slate-500 max-w-lg mx-auto">
          Herramientas simples pero poderosas, pensadas para el comercio de barrio argentino.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`group relative flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#6344ee]/20 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            {/* Hover gradient bg */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6344ee]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} ${f.color} shadow-lg ${f.glow} transition-transform group-hover:scale-110`}
            >
              <MI name={f.icon} className="!text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#6344ee] hover:gap-2 transition-all mt-auto"
            >
              Saber más <MI name="arrow_forward" className="!text-sm" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── How It Works ───────────────────────────────────────────────────────────
const HowItWorks = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="relative overflow-hidden py-28" id="como-funciona">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f6f6f8] via-[#6344ee]/5 to-[#f6f6f8]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#6344ee]/6 blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-[#6344ee]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6344ee] mb-4">
            Proceso
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Empezás a vender en 3 pasos
          </h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Sin conocimientos técnicos. Sin configuraciones complicadas.
          </p>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-3">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-[88px] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-[#6344ee]/20 z-0" />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`relative flex flex-col items-center text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Step badge */}
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-2 border-[#6344ee]/20 shadow-xl shadow-[#6344ee]/10">
                <span className="text-xl font-black text-[#6344ee]">{step.num}</span>
              </div>

              {/* Image */}
              <div className="mb-6 w-full overflow-hidden rounded-2xl bg-slate-100 aspect-video shadow-lg">
                <img
                  src={step.img}
                  alt={step.alt}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-[240px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA inside section */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <button className="inline-flex items-center gap-2 h-14 rounded-2xl bg-[#6344ee] px-10 text-base font-bold text-white shadow-xl shadow-[#6344ee]/30 transition-all hover:-translate-y-1 active:scale-95">
            Empezá ahora, es gratis
            <MI name="rocket_launch" className="!text-base" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Testimonial / Social Proof ──────────────────────────────────────────────
const Testimonials = () => {
  const { ref, inView } = useInView();
  const testimonials = [
    {
      name: 'Laura M.',
      role: 'Dueña de ropa femenina, Córdoba',
      avatar: 'LM',
      text: 'En menos de 20 minutos tenía mi tienda funcionando. Los pedidos me llegan directo al WhatsApp y mis clientas pueden ver el catálogo completo antes de llamar.',
    },
    {
      name: 'Diego R.',
      role: 'Ferretería barrial, Rosario',
      avatar: 'DR',
      text: 'Antes mandaba fotos por el grupo de WhatsApp. Ahora tengo un link que comparto y los clientes eligen solos. Ahorro tiempo y vendo más.',
    },
    {
      name: 'Caro S.',
      role: 'Pastelería artesanal, CABA',
      avatar: 'CS',
      text: 'Mis pedidos de tortas personalizadas se triplicaron desde que uso Vitrina. El botón de WhatsApp es una genialidad.',
    },
  ];

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          className={`mb-14 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-[#6344ee]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6344ee] mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Lo dicen quienes ya venden
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`flex flex-col gap-5 rounded-3xl border border-slate-100 bg-[#f6f6f8] p-7 transition-all duration-700 hover:shadow-lg ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <MI key={j} name="star" className="text-amber-400 !text-base" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div className="size-10 rounded-full bg-[#6344ee] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Pricing ────────────────────────────────────────────────────────────────
const Pricing = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10" id="precios">
      <div
        className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <span className="inline-block rounded-full bg-[#6344ee]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6344ee] mb-4">
          Precios
        </span>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Sin sorpresas. Sin letras chicas.
        </h2>
        <p className="mt-3 text-slate-500">Un solo plan. Todo incluido. Para siempre gratis.</p>
      </div>

      <div
        className={`mx-auto max-w-md transition-all duration-700 delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200/60">
          {/* Top glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-400 via-[#6344ee] to-violet-500" />

          {/* Header */}
          <div className="relative px-8 py-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6344ee] to-violet-700" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/90 mb-4">
                Plan actual
              </span>
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-6xl font-black text-white leading-none">$0</span>
                <span className="text-white/70 text-lg mb-1">/mes</span>
              </div>
              <p className="text-2xl font-black uppercase text-white tracking-widest">GRATIS</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <ul className="space-y-4 mb-8">
              {PRICING_ITEMS.map((item) => (
                <li key={item.text} className="flex items-center gap-3.5">
                  <div className="size-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MI name="check" className="text-green-600 !text-sm font-bold" />
                  </div>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <button className="w-full rounded-2xl bg-[#6344ee] py-4 text-base font-bold text-white shadow-lg shadow-[#6344ee]/25 transition-all hover:-translate-y-0.5 hover:shadow-[#6344ee]/40 active:scale-[0.98]">
              Empezar ahora — gratis
            </button>

            <p className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <MI name="lock" className="!text-xs" />
              Sin tarjeta · Sin contratos · Sin trampas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── CTA Banner ─────────────────────────────────────────────────────────────
const CTABanner = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div
        className={`relative overflow-hidden rounded-3xl bg-[#6344ee] px-8 py-14 text-center transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/4 translate-y-1/4" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative">
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">
            ¿Esperando qué?
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Tu tienda puede estar online
            <br className="hidden sm:block" /> hoy mismo.
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Unite a más de 12.000 comerciantes que ya digitalizaron su negocio con Vitrina. Gratis,
            siempre.
          </p>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-black text-[#6344ee] shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
            Crear mi tienda gratis
            <MI name="storefront" className="!text-base" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Footer ─────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-slate-200 bg-white py-14">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="size-9 rounded-xl bg-[#6344ee] flex items-center justify-center text-white">
              <MI name="storefront" className="!text-[18px]" />
            </div>
            <span className="text-xl font-black text-slate-900">Vitrina</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
            La plataforma que conecta a los comerciantes locales con sus vecinos. Hecho con ❤️ en
            Argentina.
          </p>
          <div className="flex gap-3">
            {['public', 'share', 'alternate_email'].map((icon) => (
              <a
                key={icon}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-[#6344ee] hover:text-white hover:-translate-y-0.5"
              >
                <MI name={icon} className="!text-base" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Plataforma', items: ['Explorar Tiendas', 'Cómo Funciona', 'Precios', 'Blog'] },
          { title: 'Legal', items: ['Términos y condiciones', 'Privacidad', 'Cookies', 'Ayuda'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-900">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-slate-500 hover:text-[#6344ee] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2024 Vitrina Software S.A. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1">
          <MI name="favorite" className="text-red-400 !text-xs" />
          Hecho en Argentina
        </p>
      </div>
    </div>
  </footer>
);

// ── Main ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 500; }
      `}</style>

      <div
        className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f6f6f8] text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <main className="flex-1">
          <Hero />
          <Brands />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
