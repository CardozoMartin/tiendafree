import type { AxiosError } from 'axios';
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { IErrorResponse } from '../../../types/api.type';
import { useAuthLogin } from '../hooks/useAuth';
import Input from '@/components/inputs/inputs';
import Tittle from '@/components/common/Tittle';
import TextAnimated from '@/components/inputs/TextAnimated';

interface LoginRequest {
  email: string;
  password: string;
}
const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);
const LoginForm = () => {


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const { mutate: loginMutate, isPending, isError, error } = useAuthLogin();

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2 min-h-screen lg:min-h-0 px-6 py-10 sm:px-12 md:px-16 lg:px-24 bg-transparent">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <span className="inline-block text-xs font-bold text-[#6344ee] uppercase tracking-[0.15em] mb-3 px-3 py-1 bg-[#6344ee]/8 rounded-full">
            Bienvenido de nuevo
          </span>
          <h1 className="text-[2rem] sm:text-[2.25rem] font-black text-slate-900 leading-[1.15] tracking-tight mt-2">
            Iniciá sesión en{' '}
            <span className="text-[#6344ee]">
              <Tittle />
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Accedé a tu cuenta para gestionar tu tienda, tus pedidos y tus ganancias.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

          {/* API Error */}
          {isError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              <AlertTriangle size={16} strokeWidth={2.2} className="shrink-0 mt-0.5" />
              <span>
                {(error as AxiosError<IErrorResponse>)?.response?.data?.mensaje ??
                  'Credenciales incorrectas. Revisá tu email y contraseña.'}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[52px] mt-2 bg-[#181311] hover:bg-purple-600 active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-[15px] font-bold tracking-wide rounded-2xl
              transition-all duration-200
              shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]
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
            ¿No tenés una cuenta?{' '}
            <span className='hover:text-purple-400'>

            <TextAnimated
              to="/register"
              label="Registrate gratis"
              svgWidth="w-[150%]"
              svgHeight="h-[180%]"
              svgTranslateX="-translate-x-[15%]"
              svgTranslateY="-translate-y-[20%]"
              linea1="M165,24 L1,25"
              linea2="M165,34 L6,38"
            />
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
