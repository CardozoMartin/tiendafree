const Banner = ({ accent }: { accent?: string }) => (
  <section className="py-20 px-6 md:px-16 text-center" style={{ backgroundColor: accent || '#881337' }}>
    <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
      Oferta especial
    </span>
    <h2 className="text-4xl font-black text-white mt-3 max-w-lg mx-auto leading-tight">
      20% OFF en tu primera compra
    </h2>
    <p className="text-rose-300 text-sm mt-4 max-w-md mx-auto">
      Suscribite a nuestro newsletter y recibí tu descuento exclusivo directo en tu email.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md mx-auto">
      <input
        type="email"
        placeholder="tu@email.com"
        className="w-full px-5 py-3 rounded-full text-sm outline-none bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/60"
      />
      <button className="whitespace-nowrap px-7 py-3 bg-white font-bold rounded-full text-sm hover:bg-gray-50 transition-colors"
              style={{ color: accent || '#9f1239' }}>
        Quiero el descuento
      </button>
    </div>
  </section>
);
export default Banner;
