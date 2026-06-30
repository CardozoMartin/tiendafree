import loginTiendizi from '../../../assets/tiendiziLogin.png';
import LoginForm from '../components/LoginForm';

// ── Right Panel (solo desktop) ─────────────────────────────────────────────
const RightPanel = () => (
  <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#fafafa]">
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
        <img
          src={loginTiendizi}
          alt="TiendiZi Shop"
          className="w-full h-full object-cover object-[50%_60%] transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6344ee]/40 via-transparent to-transparent" />

       
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
      {/* overflow-x-hidden en el root para cortar cualquier desborde */}
      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#f7f4ef] text-slate-900">
        <LoginForm />
        <RightPanel />
      </div>
    </>
  );
}
