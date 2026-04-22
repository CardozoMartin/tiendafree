import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputsProps {
  label: string;
  type: string;
  placeholder: string;
  register: any;
  errors: any;
  name: string;
  icon: React.ReactNode;
  validacion?: object;
}

const Input = ({
  label,
  type,
  placeholder,
  register,
  errors,
  name,
  icon,
  validacion,
}: InputsProps) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const tieneError = !!errors[name];
  const esPassword = type === 'password';
  const tipoFinal = esPassword && mostrarPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-slate-700 ml-0.5">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span
            className={`transition-colors ${tieneError ? 'text-red-400' : 'text-[#6344ee]/70'}`}
          >
            {icon}
          </span>
        </div>
        <input
          id={name}
          type={tipoFinal}
          placeholder={placeholder}
          className={`w-full h-12 pl-11 pr-11 rounded-2xl border-[1.5px] bg-[#f7f4ef]/80 text-slate-900 text-[15px] font-medium placeholder:text-black placeholder:font-normal
            outline-none transition-all duration-200
            focus:bg-white focus:border-[#6344ee] focus:shadow-[0_0_0_4px_rgba(99,68,238,0.09)]
            ${
              tieneError
                ? 'border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
                : 'border-black/30 hover:border-black/50'
            }`}
          {...register(name, validacion)}
        />
        {esPassword && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {mostrarPassword ? (
              <EyeOff size={17} strokeWidth={2.2} />
            ) : (
              <Eye size={17} strokeWidth={2.2} />
            )}
          </button>
        )}
      </div>
      {tieneError && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-500 font-semibold ml-0.5 mt-0.5">
          <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Input;
