import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
;
import type { RegisterFormValues } from '../../types/IUser.type';
import { useAuthRegister } from '../../hooks/useAuth';



const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  //Manejo del formulario con RHF
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { nombre: '', apellido: '', email: '', password: '', telefono: '' },
  });
  //Hook para enviar el registro
  const { mutate: registarUSer, isPending } = useAuthRegister();

  //Handler para enviar el formulario
  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    await registarUSer(data);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-5 py-10 sm:px-8 sm:py-12 md:px-16 lg:px-24 lg:py-0 bg-white">
      <div className="w-full max-w-[420px]">
        {/* Logo & Heading — visible solo en desktop */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#6344ee] rounded-lg flex items-center justify-center text-white">
              <MaterialIcon name="storefront" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Vitrina</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Crea tu cuenta</h1>
          <p className="text-sm sm:text-base text-slate-500">
            Completa el formulario con tus datos personales.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className={`w-full px-4 py-3 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                errors.nombre
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-slate-200'
              }`}
              {...register('nombre', {
                required: 'El nombre es obligatorio.',
              })}
            />
            {errors.nombre && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <MaterialIcon name="error" className="!text-sm" />
                {errors.nombre.message}
              </span>
            )}
          </div>

          {/* Apellido */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Apellido</label>
            <input
              type="text"
              placeholder="Tu apellido"
              className={`w-full px-4 py-3 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                errors.apellido
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-slate-200'
              }`}
              {...register('apellido', {
                required: 'El apellido es obligatorio.',
              })}
            />
            {errors.apellido && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <MaterialIcon name="error" className="!text-sm" />
                {errors.apellido.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ejemplo@correo.com"
              className={`w-full px-4 py-3 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                errors.email
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-slate-200'
              }`}
              {...register('email', {
                required: 'El email es obligatorio.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresá un email válido.',
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
              <label className="text-sm font-semibold text-slate-700">Contraseña</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                  errors.password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-200'
                }`}
                {...register('password', {
                  required: 'La contraseña es obligatoria.',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                })}
              />
              {/* Touch-friendly toggle — mínimo 44x44px */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <MaterialIcon
                  name={showPassword ? 'visibility_off' : 'visibility'}
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

          {/* Telefono */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Teléfono</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="123456789"
              className={`w-full px-4 py-3 rounded-[10px] border bg-slate-50 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base ${
                errors.telefono
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-slate-200'
              }`}
              {...register('telefono', {
                required: 'El teléfono es obligatorio.',
              })}
            />
            {errors.telefono && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <MaterialIcon name="error" className="!text-sm" />
                {errors.telefono.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-[#6344ee] hover:bg-[#5538d6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-[10px] transition-all shadow-lg shadow-[#6344ee]/20 flex items-center justify-center gap-2 active:scale-[0.98] text-base"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 sm:my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-4 bg-white text-xs font-medium text-slate-400 uppercase tracking-widest">
            O continuar con
          </span>
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full py-3.5 px-4 border border-slate-200 rounded-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-medium text-slate-700 active:scale-[0.98] text-base"
        >
          <GoogleIcon />
          Google
        </button>

        {/* Register link */}
        <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-slate-600">
          ¿No tenés cuenta?{' '}
          <a href="#" className="text-[#6344ee] font-bold hover:underline">
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;