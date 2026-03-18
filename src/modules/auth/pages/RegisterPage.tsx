import RegisterForm from "../components/RegisterForm";


// ── Right Panel (solo desktop) ─────────────────────────────────────────────
const RightPanel = () => (
  <div className="hidden lg:flex w-1/2 relative bg-[#6344ee]/10 overflow-hidden items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-br from-[#6344ee]/5 via-transparent to-[#6344ee]/20" />

    <div className="relative z-10 w-full max-w-xl px-12">
      <div className="bg-white p-2 rounded-2xl shadow-2xl rotate-3">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Wp2IMtcnMVKqJaICJ3_QTvrC21MO8q_ASNGLHXLZ12eEx_S8o1BZihLmAhuowFdgeevex_Y_Da1XO0ud-hGwJ9VV_jznzAULY5rIx4-JbAEMj7uf2nJ4wp0Mw4MT59m9HMnCDchwOVeUnXgA1F-WYjDjlakuP1Q4_VBwmejrWRKQ0HAKNKlhGZ50Ym-lix2pztCw0hE7HhopQjzUOTLYDF2B9znKsAk11ZMqScLdusjN0pVyQW5BM-Xz7UoDJNRFHdqq09RwDjAR"
          alt="Beautiful modern minimalist local boutique interior with plants"
          className="rounded-xl w-full h-[500px] object-cover"
        />
      </div>
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Muestra tu local al mundo</h2>
        <p className="text-lg text-slate-600">
          La plataforma digital diseñada para que el comercio local brille más que nunca.
        </p>
      </div>
    </div>

    <div className="absolute top-20 right-20 w-16 h-16 bg-[#6344ee] rounded-full blur-3xl opacity-20" />
    <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#6344ee] rounded-full blur-[80px] opacity-10" />
  </div>
);
// ── Main component ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex flex-row min-h-screen bg-[#f6f6f8] text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Form ocupa toda la pantalla en mobile, mitad en desktop */}
        <RegisterForm />

        {/* Panel derecho solo desktop */}
        <RightPanel />
      </div>
    </>
  );
}
