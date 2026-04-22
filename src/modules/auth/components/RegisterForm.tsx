import { useForm, type SubmitHandler } from 'react-hook-form';

import Input from '@/components/inputs/inputs';
import type { AxiosError } from 'axios';
import type { IErrorResponse } from '../../../types/api.type';
import type { RegisterFormValues } from '../../../types/IUser.type';
import { useAuthRegister } from '../hooks/useAuth';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const RegisterForm = () => {
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
          <p className="text-sm font-bold text-[#6344ee] uppercase tracking-wider mb-3">
            Empezá gratis
          </p>
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
            <Input
              label="Nombre"
              name="nombre"
              type="text"
              placeholder="Juan"
              register={register}
              errors={errors}
              icon={<MaterialIcon name="person" className="!text-xl" />}
              validacion={{
                required: 'Obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                message: 'El nombre es obligatorio',
              }}
            />

            {/* Apellido */}
            <Input
              label="Apellido"
              name="apellido"
              type="text"
              placeholder="Pérez"
              register={register}
              errors={errors}
              icon={<MaterialIcon name="person" className="!text-xl" />}
              validacion={{
                required: 'Obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                message: 'El apellido es obligatorio',
              }}
            />
          </div>

          {/* Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            register={register}
            errors={errors}
            icon={<MaterialIcon name="mail" className="!text-xl" />}
            validacion={{
              required: 'El email es obligatorio.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresá un email válido.',
              },
            }}
          />

          {/* Telefono */}
          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            placeholder="11 2345 6789"
            register={register}
            errors={errors}
            icon={<MaterialIcon name="call" className="!text-xl" />}
            validacion={{ required: 'El teléfono es obligatorio.' }}
          />

          {/* Password */}
          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            errors={errors}
            icon={<MaterialIcon name="lock" className="!text-xl" />}
            validacion={{
              required: 'La contraseña es obligatoria.',
              minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#181311] hover:bg-purple-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold rounded-[18px] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.18)] flex items-center justify-center gap-2 active:scale-[0.98] text-base mt-4"
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
