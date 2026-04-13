import { useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Step {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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

// ── Shared Icon ────────────────────────────────────────────────────────────
const MI = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ── Data ───────────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    num: '1',
    icon: 'person_add',
    title: 'Crea tu cuenta',
    desc: 'Regístrate en segundos con tu email. Sin tarjetas de crédito ni trámites complejos.',
  },
  {
    num: '2',
    icon: 'palette',
    title: 'Personaliza el diseño',
    desc: 'Elige una de nuestras plantillas y ajústala a los colores y logo de tu marca.',
  },
  {
    num: '3',
    icon: 'inventory_2',
    title: 'Sube tus productos',
    desc: 'Carga fotos, descripciones y precios. ¡Y listo! Ya estás vendiendo online.',
  },
];

const FEATURES: Feature[] = [
  {
    icon: 'credit_card',
    title: 'Métodos de Pago',
    desc: 'Integra Mercado Pago, transferencias o efectivo. Cobra como quieras.',
  },
  {
    icon: 'local_shipping',
    title: 'Envíos Flexibles',
    desc: 'Acuerda entregas personalizadas o usa integraciones con correos locales.',
  },
  {
    icon: 'grid_view',
    title: 'Plantillas Editables',
    desc: 'Diseños modernos que se adaptan a celulares y tablets automáticamente.',
  },
  {
    icon: 'campaign',
    title: 'Banners y Personalización',
    desc: 'Crea promociones visuales impactantes y destaca tus productos estrella.',
  },
];

// ── Hero Section ───────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative overflow-hidden bg-[#f0effe] pt-8 pb-16 lg:pb-24">
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute -top-20 -right-20 h-[420px] w-[420px] rounded-full bg-[#6c47ff]/10 blur-[80px]" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-300/15 blur-[60px]" />
    </div>

    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── Copy ── */}
        <div
          className="order-2 flex flex-col gap-6 lg:order-1"
          style={{ animation: 'fadeUp 0.65s ease both' }}
        >
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6c47ff] shadow-sm">
              <span className="size-1.5 rounded-full bg-[#6c47ff] animate-pulse" />
              100% GRATIS PARA SIEMPRE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-[3.6rem]">
            Crea tu tienda
            <br />
            online{' '}
            <em className="not-italic text-[#6c47ff]" style={{ fontStyle: 'italic' }}>
              GRATIS
            </em>{' '}
            en
            <br />
            minutos
          </h1>

          <p className="max-w-[480px] text-[15px] leading-relaxed text-slate-600">
            Sube tus productos, elige tus medios de pago y envío, y empieza a vender hoy mismo. Sin
            costos ocultos ni comisiones por venta.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#6c47ff] px-7 text-sm font-bold text-white shadow-lg shadow-[#6c47ff]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#6c47ff]/40 active:scale-95">
              Empezar ahora
              <MI
                name="arrow_forward"
                className="!text-[16px] transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <button className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-7 text-sm font-bold text-slate-700 transition-all hover:border-[#6c47ff]/40 hover:bg-[#6c47ff]/5 active:scale-95">
              Ver ejemplos
            </button>
          </div>
        </div>

        {/* ── Product Image ── */}
        <div
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
          style={{ animation: 'fadeUp 0.65s ease 0.15s both' }}
        >
          <div className="relative w-full max-w-[520px]">
            {/* Glow behind image */}
            <div className="absolute inset-10 rounded-3xl bg-[#6c47ff]/15 blur-3xl -z-10" />
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVteJ3zEDQEN5zmQ2qhJpoxsLneHJfe8Jn8DS00-42RE8f5oVTr0Qo-nDxPsI31LRNB_8vJCa4L58Y8Xcg7QRILf8L6q3_GPTJ0F-eYDs8qrtjhkZVDdWMyaltiXmeXwhSNot3Y_PM89AkU_HdD4cTeEw-juiK-ppPhC3l7D9cOIWktfCLO8SglxJ2bocINmg2hZ68BjKa5bm1e7Wapj2I1gYBFAfMQoeUPtvMMcIcn1MC8RKutFbEMaz_hZNMdD37aSA3XC26lEFT"
                alt="Tiendzi dashboard preview"
                className="h-full w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Steps Section ──────────────────────────────────────────────────────────
const Steps = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div
          className={`mb-14 text-center transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Empieza a vender en 3 pasos
          </h2>
          <p className="mt-3 text-slate-500 text-sm">
            Nunca fue tan fácil digitalizar tu catálogo y llegar a nuevos clientes.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`flex flex-col items-center gap-5 rounded-3xl border border-slate-100 bg-[#f8f7ff] p-8 text-center transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 130}ms` }}
            >
              {/* Icon circle */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebe8ff]">
                <MI name={step.icon} className="text-[#6c47ff] !text-3xl" />
              </div>

              {/* Step number + title */}
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6c47ff]">
                  {step.num}.
                </p>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              </div>

              <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Features Section ───────────────────────────────────────────────────────
const FeaturesSection = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="bg-[#f8f7ff] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left copy */}
          <div
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Todo lo que
              <br />
              necesitas para
              <br />
              crecer
            </h2>
            <p className="mt-5 max-w-[400px] text-[15px] leading-relaxed text-slate-500">
              Tiendzi te ofrece las herramientas profesionales de los gigantes del e-commerce,
              totalmente integradas y fáciles de usar.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#6c47ff] hover:gap-2.5 transition-all"
            >
              Descubre todas las funciones <MI name="arrow_forward" className="!text-base" />
            </a>
          </div>

          {/* Right feature grid */}
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ebe8ff]">
                  <MI name={f.icon} className="text-[#6c47ff] !text-xl" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Testimonial ────────────────────────────────────────────────────────────
const Testimonial = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <div
          className={`overflow-hidden rounded-3xl bg-[#6c47ff] px-8 py-12 text-center sm:px-14 sm:py-16 transition-all duration-700 ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Quote mark */}
          <div className="mb-6 flex justify-center">
            <span className="text-5xl font-black leading-none text-white/30 select-none">"</span>
          </div>

          <blockquote className="text-xl font-semibold leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
            "Tiendzi me ayudó a digitalizar mi negocio de forma simple y gratuita. En menos de una
            tarde ya tenía mi catálogo online recibiendo pedidos por WhatsApp."
          </blockquote>

          {/* Author */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
              <MI name="person" className="text-white !text-2xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Lucía Fernández</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                Fundadora de Ecomoda
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── CTA Final ──────────────────────────────────────────────────────────────
const CTAFinal = () => {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="bg-[#f8f7ff] py-20 lg:py-28">
      <div
        className={`mx-auto max-w-xl px-5 text-center transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          ¿Listo para vender?
        </h2>
        <p className="mt-4 text-slate-500">
          Únete a miles de emprendedores que ya están transformando su negocio con Tiendzi.
        </p>
        <div className="mt-8">
          <button className="inline-flex h-13 items-center gap-2 rounded-full bg-[#6c47ff] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#6c47ff]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#6c47ff]/40 active:scale-95">
            Crear mi tienda GRATIS
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Footer ─────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6c47ff] text-white">
                <MI name="storefront" className="!text-[16px]" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">TIENDZI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              La plataforma más simple para vender online sin comisiones.
            </p>
            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              {['language', 'share', 'alternate_email'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all hover:bg-[#6c47ff] hover:text-white"
                >
                  <MI name={icon} className="!text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {['Features', 'Templates', 'Pricing'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#6c47ff] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {['Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#6c47ff] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
              Suscríbete a nuestro newsletter
            </h4>
            <div className="flex overflow-hidden rounded-full border border-slate-200 bg-white focus-within:border-[#6c47ff]/60 focus-within:ring-2 focus-within:ring-[#6c47ff]/10 transition-all">
              <input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6c47ff] text-white transition-all hover:bg-[#5735e0] m-0.5">
                <MI name="send" className="!text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>© 2024 TIENDZI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// ── Main Export ────────────────────────────────────────────────────────────
export default function TiendziLanding() {
  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 1, 'wght' 500;
          vertical-align: middle;
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      <div
        className="overflow-x-hidden text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Hero />
        <Steps />
        <FeaturesSection />
        <Testimonial />
        <CTAFinal />
        <Footer />
      </div>
    </>
  );
}
