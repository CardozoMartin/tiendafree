// ── Shared Icon ────────────────────────────────────────────────────────────
const MI = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ── Hero Section ───────────────────────────────────────────────────────────
export default function HomeHero() {
  return (
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
}
