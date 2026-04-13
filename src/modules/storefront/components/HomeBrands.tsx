const BRANDS = ['CAFÉ MARTÍNEZ', 'GRIDO', 'HAVANNA', 'MOSTRASA', 'FREDDO'];

export default function HomeBrands() {
  return (
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
}
