import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConfirm } from '../../../hooks/useConfirm';
import { useResetPassword } from '../hooks/useAuth';

type RestablecerPasswordFormData = {
  passwordNueva: string;
  confirmarPassword: string;
};

interface ChangePasswordProps {
  /** Token de reset extraído de la URL (ej: useParams()) */
  token?: string;
  /** Callback al enviar el formulario */
  onSubmit?: (data: RestablecerPasswordFormData, token: string) => Promise<void>;
  /** Callback al clickear "Volver al inicio de sesión" */
  onBack?: () => void;
}

// ─── Component ────────────────────────────────────────────

export const ChangePassPage = ({ token, onBack }: ChangePasswordProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenUrl = searchParams.get('token') || token;
  const handleBack = onBack ?? (() => navigate('/login'));

  console.log('Token recibido en ChangePassPage:', tokenUrl);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  //manejo del formulario con RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestablecerPasswordFormData>({
    defaultValues: { passwordNueva: '', confirmarPassword: '' },
  });
  //para mostrar el mensaje antes de enviar la peticion
  const { confirm, ConfirmModal } = useConfirm();

  //Tquery para el manejo de la peticion
  const { mutate: resetPasswordMutate, isPending, isSuccess } = useResetPassword();

  const onFormSubmit = async (data: RestablecerPasswordFormData) => {
    // Validar que el token existe
    if (!tokenUrl) {
      console.error('❌ Token no encontrado en la URL');
      alert('Token inválido o expirado. Por favor solicita un nuevo reset de contraseña.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (data.passwordNueva !== data.confirmarPassword) {
      console.error('❌ Las contraseñas no coinciden');
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (data.passwordNueva.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres');
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const userConfirmed = await confirm({
      titulo: '¿Estas seguro?',
      descripcion: '¿Estás seguro de que deseas cambiar tu contraseña?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Cambiar contraseña',
      variant: 'info',
    });

    if (userConfirmed) {
      console.log('📤 Enviando datos:', { token: tokenUrl, passwordNueva: data.passwordNueva });
      resetPasswordMutate({ token: tokenUrl, ...data });
    }
  };

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
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                {/* Error general de API */}

                {/* Campo: Nueva contraseña */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 ml-1">
                    Nueva contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="w-5 h-5 text-slate-400 group-focus-within:text-[#6344ee] transition-colors"
                        strokeWidth={1.8}
                      />
                    </div>
                    <input
                      {...register('passwordNueva')}
                      type={mostrarPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-4 bg-slate-50 border rounded-[10px] text-slate-900 font-medium text-sm transition-all duration-200 placeholder:text-slate-300 outline-none focus:bg-white focus:ring-2 focus:ring-[#6344ee]/20 ${
                        errors.passwordNueva
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-transparent focus:border-[#6344ee]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6344ee] transition-colors"
                    >
                      {mostrarPassword ? (
                        <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  {errors.passwordNueva && (
                    <p className="text-xs text-red-500 font-medium ml-1">
                      {errors.passwordNueva.message}
                    </p>
                  )}
                </div>

                {/* Campo: Confirmar contraseña */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 ml-1">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="w-5 h-5 text-slate-400 group-focus-within:text-[#6344ee] transition-colors"
                        strokeWidth={1.8}
                      />
                    </div>
                    <input
                      {...register('confirmarPassword')}
                      type={mostrarConfirmar ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-4 bg-slate-50 border rounded-[10px] text-slate-900 font-medium text-sm transition-all duration-200 placeholder:text-slate-300 outline-none focus:bg-white focus:ring-2 focus:ring-[#6344ee]/20 ${
                        errors.confirmarPassword
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-transparent focus:border-[#6344ee]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmar((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6344ee] transition-colors"
                    >
                      {mostrarConfirmar ? (
                        <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  {errors.confirmarPassword && (
                    <p className="text-xs text-red-500 font-medium ml-1">
                      {errors.confirmarPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#6344ee] hover:bg-[#4d2ad3] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 px-6 rounded-[10px] font-bold text-sm active:scale-[0.98] transition-all duration-200 shadow-[0_10px_20px_rgba(99,68,238,0.25)] flex items-center justify-center gap-2 group"
                  >
                    {isPending ? (
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                        />
                      </svg>
                    ) : (
                      <>
                        <span>Restablecer contraseña</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
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
      {ConfirmModal}
    </div>
  );
};
