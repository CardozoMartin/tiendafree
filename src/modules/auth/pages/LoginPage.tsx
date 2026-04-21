import LoginForm from "../components/LoginForm";
import loginTiendizi from '../../../assets/tiendiziLogin.png'

// ── Right Panel (solo desktop) ─────────────────────────────────────────────
const RightPanel = () => (
  <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#fafafa]">
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
        <img
          src={loginTiendizi}
          alt="TiendiZi Shop"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6344ee]/40 via-transparent to-transparent" />

        <div className="absolute bottom-10 left-10 right-10 p-8 rounded-2xl border border-white/20 backdrop-blur-md bg-white/10">
          <h2 className="text-white text-2xl font-extrabold mb-2">Impulsá tu comercio local</h2>
          <p className="text-white/90 text-sm font-medium">La plataforma definitiva para vender más y mejor en tu barrio.</p>
        </div>
      </div>
    </div>

    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6344ee] rounded-full blur-[120px] opacity-20" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6344ee] rounded-full blur-[120px] opacity-10" />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* overflow-x-hidden en el root para cortar cualquier desborde */}
      <div
        className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#f6f6f8] text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <LoginForm />
        <RightPanel />
      </div>
    </>
  );
}