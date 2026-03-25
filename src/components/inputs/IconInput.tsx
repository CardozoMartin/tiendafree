import type { InputHTMLAttributes, Ref } from 'react';

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLInputElement>;
  accent?: string;
}

export function IconInput({
  label,
  icon,
  error,
  hint,
  required,
  className,
  ref,
  accent = '#6344ee',
  ...props
}: IconInputProps) {
  return (
    <div className="p-5 flex flex-col gap-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
        {required && (
          <span className="ml-1" style={{ color: accent }}>
            *
          </span>
        )}
      </label>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none !text-[18px]">
          {icon}
        </span>
        <input
          ref={ref}
          required={required}
          className={`
            w-full border bg-white text-slate-800 placeholder-slate-400
            rounded-xl px-4 py-2.5 pl-9 text-sm font-medium
            focus:outline-none focus:ring-2 focus:border-transparent transition
            ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}
            ${className ?? ''}
          `}
          style={!error ? { ['--tw-ring-color' as string]: accent } : undefined}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-red-500 text-xs font-medium">{error}</p>
      ) : (
        hint && <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}
