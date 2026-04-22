import registerTiendizi from '../../../assets/tiendiziregister.png';
import RegisterForm from '../components/RegisterForm';

// ── Right Panel (solo desktop) ─────────────────────────────────────────────
const RightPanel = () => (
  <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#fafafa]">
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
        <img
          src={registerTiendizi}
          alt="TiendiZi Registration"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6344ee]/40 via-transparent to-transparent" />

        {/* Floating cards or elements for "premium" feel */}
        {/* <div className="absolute bottom-10 left-10 right-10 p-8 glass-morphism rounded-2xl border border-white/20 backdrop-blur-md bg-white/10">
          <h2 className="text-white text-2xl font-extrabold mb-2">Unite a la revolución local</h2>
          <p className="text-white/90 text-sm font-medium">
            Miles de comerciantes ya están transformando sus ventas con TiendiZi.
          </p>
        </div> */}
      </div>
    </div>

    {/* Decorative blurs */}
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6344ee] rounded-full blur-[120px] opacity-20" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6344ee] rounded-full blur-[120px] opacity-10" />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  return (
    <>
      <style>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f7f4ef] text-slate-900">
        {/* Form ocupa toda la pantalla en mobile, mitad en desktop */}
        <RegisterForm />

        {/* Panel derecho solo desktop */}
        <RightPanel />
      </div>
    </>
  );
}
