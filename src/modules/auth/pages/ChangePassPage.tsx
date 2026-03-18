import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FormChangePass from '../components/FormChangePass';

type RestablecerPasswordFormData = {
  passwordNueva: string;
  confirmarPassword: string;
};

interface ChangePasswordProps {
  token?: string;
  onSubmit?: (data: RestablecerPasswordFormData, token: string) => Promise<void>;
  onBack?: () => void;
}

// ─── Component ────────────────────────────────────────────

export const ChangePassPage = ({ token, onBack }: ChangePasswordProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenUrl = searchParams.get('token') || token;
  const handleBack = onBack ?? (() => navigate('/login'));
  const [isSuccess, setIsSuccess] = useState(false);


  

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f7f8fc] relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#6344ee]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#6344ee]/5 blur-[120px] rounded-full" />
      </div>

      <main className="w-full max-w-[480px] z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-[#6344ee] font-extrabold text-2xl tracking-tighter">Vitrina</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(99,68,238,0.08)]">
          {!isSuccess ? (
            <>
              {/* Header */}
              <header className="mb-8">
                <h1 className="text-slate-900 font-extrabold text-2xl md:text-3xl tracking-tight mb-2">
                  Crea tu nueva contraseña
                </h1>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Tu seguridad es nuestra prioridad. Elegí una contraseña robusta y difícil de
                  adivinar.
                </p>
              </header>

              {/* Form */}
             <FormChangePass token={tokenUrl} onBack={handleBack} onSuccess={() => setIsSuccess(true)} />
            </>
          ) : (
            <>
              {/* ─── Estado: éxito ────────────────────────────  */}
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-6">
                  <svg
                    className="w-7 h-7 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  ¡Contraseña restablecida!
                </h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                  Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión.
                </p>
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 bg-[#6344ee] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#4d2ad3] transition-colors"
                >
                  Ir al inicio de sesión
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Footer de la card */}
          {!isSuccess && (
            <>
              {/* Badge conexión segura */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#f7f1ff] rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#8b2a5c]" strokeWidth={1.8} />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Conexión Segura
                </span>
              </div>

              {/* Volver */}
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-semibold text-slate-400 hover:text-[#6344ee] transition-colors flex items-center gap-1 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver al inicio de sesión
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest opacity-50">
            © 2024 Vitrina. All rights reserved.
          </p>
        </footer>
      </main>
      
    </div>
  );
};
