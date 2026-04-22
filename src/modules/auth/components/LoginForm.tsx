import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useAuthLogin } from "../hooks/useAuth";
import type { IErrorResponse } from "../../../types/api.type";
import type { AxiosError } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: "", password: "" },
  });

  const { mutate: loginMutate, isPending, isError, error } = useAuthLogin();

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 min-h-screen lg:min-h-0 px-6 py-10 sm:px-12 md:px-16 lg:px-24 bg-white lg:rounded-[40px] lg:shadow-[0_30px_80px_rgba(99,68,238,0.12)]">
      <div className="w-full max-w-[400px]">

        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <span className="inline-block text-xs font-bold text-[#6344ee] uppercase tracking-[0.15em] mb-3 px-3 py-1 bg-[#6344ee]/8 rounded-full">
            Bienvenido de nuevo
          </span>
          <h1 className="text-[2rem] sm:text-[2.25rem] font-black text-slate-900 leading-[1.15] tracking-tight mt-2">
            Iniciá sesión en{" "}
            <span className="text-[#6344ee]">TiendiZi</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Accedé a tu cuenta para gestionar tu tienda, tus pedidos y tus ganancias.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-slate-700 ml-0.5">
              Email
            </label>
            <div className="relative">
              {/* Icon container — perfectly centered */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail
                  size={17}
                  className={`transition-colors ${errors.email ? "text-red-400" : "text-[#6344ee]/70"}`}
                  strokeWidth={2.2}
                />
              </div>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="ejemplo@correo.com"
                className={`w-full h-12 pl-11 pr-4 rounded-2xl border-[1.5px] bg-slate-50/80 text-slate-900 text-[15px] font-medium placeholder:text-slate-400 placeholder:font-normal
                  outline-none transition-all duration-200
                  focus:bg-white focus:border-[#6344ee] focus:shadow-[0_0_0_4px_rgba(99,68,238,0.09)]
                  ${errors.email
                    ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
                {...register("email", {
                  required: "El email es obligatorio.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresá un email válido.",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-[12px] text-red-500 font-semibold ml-0.5 mt-0.5">
                <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-0.5">
              <label htmlFor="password" className="text-[13px] font-semibold text-slate-700">
                Contraseña
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-[12px] font-semibold text-[#6344ee] hover:text-[#4f35c8] transition-colors underline underline-offset-2 decoration-[#6344ee]/30"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              {/* Lock icon — perfectly centered */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock
                  size={17}
                  className={`transition-colors ${errors.password ? "text-red-400" : "text-[#6344ee]/70"}`}
                  strokeWidth={2.2}
                />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full h-12 pl-11 pr-12 rounded-2xl border-[1.5px] bg-slate-50/80 text-slate-900 text-[15px] font-medium placeholder:text-slate-400 placeholder:font-normal
                  outline-none transition-all duration-200
                  focus:bg-white focus:border-[#6344ee] focus:shadow-[0_0_0_4px_rgba(99,68,238,0.09)]
                  ${errors.password
                    ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
                {...register("password", {
                  required: "La contraseña es obligatoria.",
                  minLength: { value: 6, message: "Mínimo 6 caracteres." },
                })}
              />
              {/* Toggle visibility — perfectly centered on the right */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#6344ee] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword
                  ? <EyeOff size={17} strokeWidth={2.2} />
                  : <Eye size={17} strokeWidth={2.2} />
                }
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-[12px] text-red-500 font-semibold ml-0.5 mt-0.5">
                <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {isError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              <AlertTriangle size={16} strokeWidth={2.2} className="shrink-0 mt-0.5" />
              <span>
                {(error as AxiosError<IErrorResponse>)?.response?.data?.mensaje ??
                  "Credenciales incorrectas. Revisá tu email y contraseña."}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[52px] mt-2 bg-[#6344ee] hover:bg-[#5538d6] active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-[15px] font-bold tracking-wide rounded-2xl
              transition-all duration-200
              shadow-[0_8px_24px_rgba(99,68,238,0.28)] hover:shadow-[0_12px_28px_rgba(99,68,238,0.36)]
              flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                <span>Accediendo...</span>
              </>
            ) : (
              <>
                <span>Ingresar a mi cuenta</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Footer link */}
          <p className="text-center text-[13px] text-slate-500 mt-5">
            ¿No tenés una cuenta?{" "}
            <Link
              to="/register"
              className="font-bold text-[#6344ee] hover:text-[#4f35c8] transition-colors underline underline-offset-2 decoration-[#6344ee]/30"
            >
              Registrate gratis
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default LoginForm;