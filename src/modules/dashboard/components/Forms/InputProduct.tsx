import { AlertCircle } from 'lucide-react';

interface InputProductProps {
  label: string;
  placeholder: string;
  register: any;
  errors: any;
  name: string;
  icon: React.ReactNode;
  validacion?: object;
  required?: boolean;
  type?: string;
  step?: string;
  min?: string;
  opcional?: boolean;
}

const InputProduct = ({
  label,
  placeholder,
  register,
  errors,
  name,
  icon,
  validacion,
  required,
  type = 'text',
  step,
  min,
  opcional,
}: InputProductProps) => {
  const tieneError = !!errors[name];

  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <label htmlFor={name} className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {opcional && <span className="text-[11px] font-normal text-slate-400 ml-1.5 normal-case tracking-normal">Opcional</span>}
      </label>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 flex items-center">
          <span className={`transition-colors ${tieneError ? 'text-red-400' : 'text-slate-400'}`}>
            {icon}
          </span>
        </div>
        <input
          id={name}
          type={type}
          step={step}
          min={min}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-300
            outline-none transition-colors
            ${tieneError
              ? 'border-red-300 focus:border-red-400'
              : 'border-slate-200 focus:border-slate-400'
            }`}
          {...register(name, validacion)}
        />
      </div>
      {tieneError && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-400 font-medium mt-0.5">
          <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default InputProduct;
