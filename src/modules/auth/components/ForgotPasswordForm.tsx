import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRequestPasswordReset } from '../hooks/useAuth';

type RecoveryFormData = {
  email: string;
};
const ForgotPasswordForm = () => {
  //manejo del formulario con RHF
  const {
    register,
    handleSubmit: onSubmitRHF,
    formState: { errors },
  } = useForm<RecoveryFormData>({
    defaultValues: { email: '' },
  });

  //Tquery para el manejo de la peticion
  const { mutate: requestResetMutate, isPending: loading } = useRequestPasswordReset();

  const handleSubmit = (data: RecoveryFormData) => {
    requestResetMutate(data.email);
  };

  return (
    <form onSubmit={onSubmitRHF(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1"
        >
          Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#6344ee] transition-colors" />
          </div>
          <input
            id="email"
            type="email"
            required
            {...register('email', {
              required: 'El email es obligatorio.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Por favor, introduce un email válido.',
              },
            })}
            placeholder="ejemplo@correo.com"
            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl text-slate-900 placeholder:text-slate-400/60 focus:ring-2 focus:ring-[#6344ee]/20 focus:border-[#6344ee] focus:bg-white transition-all duration-200 outline-none font-medium text-sm"
          />
        </div>

        {/* Error message */}
        {errors.email && (
          <p className="text-xs text-red-500 font-medium ml-1 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6344ee] hover:bg-[#4d2ad3] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(99,68,238,0.3)] hover:-translate-y-px active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {loading ? (
          // Spinner
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
            <span>Enviar instrucciones</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
