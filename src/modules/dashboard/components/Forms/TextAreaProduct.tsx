import { AlertCircle } from 'lucide-react';

interface TextAreaProductProps {
  label: string;
  placeholder: string;
  register: any;
  errors: any;
  name: string;
  icon: React.ReactNode;
  validacion?: object;
  required?: boolean;
  opcional?: boolean;
  rows?: number;
}

const TextAreaProduct = ({
  label,
  placeholder,
  register,
  errors,
  name,
  icon,
  validacion,
  required,
  opcional,
  rows = 3,
}: TextAreaProductProps) => {
  const tieneError = !!errors[name];

  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <label htmlFor={name} className="text-[13px] font-medium text-slate-500 ml-0.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {opcional && <span className="text-[11px] font-normal text-slate-400 ml-1.5">Opcional</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-3 flex items-start">
          <span className={`transition-colors ${tieneError ? 'text-red-400' : 'text-[#6344ee]/70'}`}>
            {icon}
          </span>
        </div>
        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] text-[15px]
            bg-zinc-50 text-slate-900 placeholder:text-slate-400
            outline-none transition-all duration-200 resize-none
            focus:bg-white focus:border-[#6344ee] focus:shadow-[0_0_0_4px_rgba(99,68,238,0.09)]
            hover:border-black/50
            ${tieneError
              ? 'border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
              : 'border-black/20'
            }`}
          {...register(name, validacion)}
        />
      </div>
      {tieneError && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-400 font-medium ml-0.5 mt-0.5">
          <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default TextAreaProduct;