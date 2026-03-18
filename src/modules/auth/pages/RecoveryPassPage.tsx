import { ArrowLeft, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/ForgotPasswordForm';


export const RecoveryPassPage = () => {
  return (
    // Fondo con gradiente radial igual al HTML original
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f6f6f8] px-6 py-12 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-[#6344ee]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[5%] w-80 h-80 bg-[#6344ee]/5 rounded-full blur-3xl" />
      </div>

      <main className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tighter text-[#6344ee]">Vitrina</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f1ecfa] mb-6">
              <KeyRound className="w-7 h-7 text-[#6344ee]" strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Ingresá tu email y te enviaremos las instrucciones para restablecerla.
            </p>
          </div>

          {/* Form */}
          <ForgotPasswordForm></ForgotPasswordForm>

          {/* Divider + volver */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6344ee] hover:text-[#4d2ad3] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio de sesión</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © 2024 Vitrina Local SaaS Hub. Todos los derechos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
};
