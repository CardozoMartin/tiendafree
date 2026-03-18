import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuthLogin } from "../hooks/useAuth";
import type { IErrorResponse } from "../../../types/api.type";
import type { AxiosError } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

const MaterialIcon = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => <span className={`material-symbols-outlined ${className}`}>{name}</span>;

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
  console.log(isError);
  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutate(data); // ← el hook maneja todo
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-5 py-10 sm:px-8 sm:py-12 md:px-16 lg:px-24 lg:py-0 bg-white">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#6344ee] rounded-lg flex items-center justify-center text-white">
              <MaterialIcon name="storefront" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Vitrina
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Por favor, ingresa tus datos para acceder.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ejemplo@correo.com"
              className={`w-full px-4 py-3 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                errors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-slate-200"
              }`}
              {...register("email", {
                required: "El email es obligatorio.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresá un email válido.",
                },
              })}
            />
            {errors.email && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <MaterialIcon name="error" className="!text-sm" />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>
              <Link
                to="/recover-password"
                className="text-xs font-medium text-[#6344ee] hover:underline"
              >
                Olvidé mi contraseña
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    : "border-slate-200"
                }`}
                {...register("password", {
                  required: "La contraseña es obligatoria.",
                  minLength: { value: 6, message: "Mínimo 6 caracteres." },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <MaterialIcon
                  name={showPassword ? "visibility_off" : "visibility"}
                  className="!text-xl"
                />
              </button>
            </div>
            {errors.password && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <MaterialIcon name="error" className="!text-sm" />
                {errors.password.message}
              </span>
            )}
          </div>
          {isError && (
            <div className="rounded-[10px] border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {(error as AxiosError<IErrorResponse>)?.response?.data?.mensaje ??
                "Credenciales incorrectas"}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-[#6344ee] hover:bg-[#5538d6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-[10px] transition-all shadow-lg shadow-[#6344ee]/20 flex items-center justify-center gap-2 active:scale-[0.98] text-base"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-slate-600">
          ¿No tenés cuenta?{" "}
          <a href="#" className="text-[#6344ee] font-bold hover:underline">
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
