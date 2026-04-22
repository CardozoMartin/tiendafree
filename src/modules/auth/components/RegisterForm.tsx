import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import type { AxiosError } from 'axios';
import type { IErrorResponse } from '../../../types/api.type';
import type { RegisterFormValues } from '../../../types/IUser.type';
import { useAuthRegister } from '../hooks/useAuth';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);


const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Manejo del formulario con RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
    },
  });

  const { mutate: registarUser, isPending, isError, error } = useAuthRegister();

  //Handler para enviar el formulario
  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    registarUser(data);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 min-h-screen px-6 py-8 sm:px-12 md:px-16 lg:px-24 bg-transparent">
      <div className="w-full max-w-[440px]">
        {/* Heading */}
        <div className="mb-8 lg:mb-10 text-center lg:text-left">
          <p className="text-sm font-bold text-[#6344ee] uppercase tracking-wider mb-3">Empezá gratis</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 leading-tight">
            Crea tu cuenta
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 font-medium">
            Unite a la comunidad de TiendiZi y empezá a vender hoy mismo.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {isError && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600 flex items-center gap-2">
              <MaterialIcon name="report" className="!text-lg" />
              {(error as AxiosError<IErrorResponse>)?.response?.data?.mensaje ??
                'Ocurrió un error al registrarte. Reintentá luego.'}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-sm font-bold text-slate-700 ml-1">
                Nombre
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6344ee] transition-transform group-focus-within:scale-110">
                  <MaterialIcon name="person" className="!text-xl" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Juan"
                  className={`w-full pl-12 pr-4 py-3 rounded-[16px] border bg-white focus:ring-4 focus:ring-[#6344ee]/10 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-sm font-medium ${
                    errors.nombre ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'
                  }`}
                  {...register('nombre', { required: 'Obligatorio' })}
                />
              </div>
            </div>

            {/* Apellido */}
            <div className="flex flex-col gap-2">
              <label htmlFor="apellido" className="text-sm font-bold text-slate-700 ml-1">
                Apellido
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6344ee] transition-transform group-focus-within:scale-110">
                  <MaterialIcon name="person" className="!text-xl" />
                </div>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Pérez"
                  className={`w-full pl-12 pr-4 py-3 rounded-[16px] border bg-white focus:ring-4 focus:ring-[#6344ee]/10 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-sm font-medium ${
                    errors.apellido ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'
                  }`}
                  {...register('apellido', { required: 'Obligatorio' })}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6344ee] transition-transform group-focus-within:scale-110">
                <MaterialIcon name="mail" className="!text-xl" />
              </div>
              <input
                id="email"
                type="email"
                inputMode="email"
                placeholder="ejemplo@correo.com"
                className={`w-full pl-12 pr-4 py-3.5 rounded-[16px] border bg-white focus:ring-4 focus:ring-[#6344ee]/10 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base font-medium ${
                  errors.email ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'
                }`}
                {...register('email', {
                  required: 'El email es obligatorio.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresá un email válido.',
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</span>
            )}
          </div>

          {/* Telefono */}
          <div className="flex flex-col gap-2">
            <label htmlFor="telefono" className="text-sm font-bold text-slate-700 ml-1">
              Teléfono
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6344ee] transition-transform group-focus-within:scale-110">
                <MaterialIcon name="call" className="!text-xl" />
              </div>
              <input
                id="telefono"
                type="tel"
                placeholder="11 2345 6789"
                className={`w-full pl-12 pr-4 py-3.5 rounded-[16px] border bg-white focus:ring-4 focus:ring-[#6344ee]/10 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base font-medium ${
                  errors.telefono ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'
                }`}
                {...register('telefono', { required: 'El teléfono es obligatorio.' })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6344ee] transition-transform group-focus-within:scale-110">
                <MaterialIcon name="lock" className="!text-xl" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 rounded-[16px] border bg-white focus:ring-4 focus:ring-[#6344ee]/10 focus:border-[#6344ee] outline-none transition-all text-slate-900 text-base font-medium ${
                  errors.password ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'
                }`}
                {...register('password', {
                  required: 'La contraseña es obligatoria.',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-slate-400 hover:text-[#6344ee] transition-colors rounded-full hover:bg-slate-100"
              >
                <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="!text-xl" />
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#6344ee] hover:bg-[#5538d6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold rounded-[18px] transition-all shadow-[0_10px_25px_rgba(99,68,238,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] text-base mt-4"
          >
            {isPending ? 'Creando cuenta...' : 'Comenzar ahora'}
          </button>

          <p className="text-center text-sm font-bold text-slate-500 mt-6">
            ¿Ya tenés una cuenta?{' '}
            <a href="/login" className="text-[#6344ee] hover:underline">
              Iniciá sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
