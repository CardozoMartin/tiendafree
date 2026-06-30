import { AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProductProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  register: any;
  errors: any;
  options: SelectOption[];
  validacion?: object;
  required?: boolean;
  placeholder?: string;
  opcional?: boolean;
}

const SelectProduct = ({
  label,
  name,
  icon,
  register,
  errors,
  options,
  validacion,
  required,
  placeholder,
  opcional,
}: SelectProductProps) => {
  const tieneError = !!errors[name];

  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <label htmlFor={name} className="text-[13px] font-medium text-slate-500 ml-0.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {opcional && <span className="text-[11px] font-normal text-slate-400 ml-1.5">Opcional</span>}
      </label>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3.5 flex items-center z-10">
          <span className={`transition-colors ${tieneError ? 'text-red-400' : 'text-[#6344ee]/70'}`}>
            {icon}
          </span>
        </div>
        <select
          id={name}
          className={`w-full h-12 pl-11 pr-8 rounded-[14px] border-[1.5px] text-[15px]
            bg-zinc-50 text-slate-900 appearance-none cursor-pointer
            outline-none transition-all duration-200
            focus:bg-white focus:border-[#6344ee] focus:shadow-[0_0_0_4px_rgba(99,68,238,0.09)]
            hover:border-black/50
            ${tieneError
              ? 'border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
              : 'border-black/20'
            }`}
          {...register(name, validacion)}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <div className="pointer-events-none absolute right-3.5 flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-slate-400">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
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

export default SelectProduct;