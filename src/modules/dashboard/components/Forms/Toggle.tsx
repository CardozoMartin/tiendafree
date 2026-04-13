import type { UseFormRegister } from 'react-hook-form';

export function Toggle({
  name,
  register,
}: {
  name: 'disponible' | 'destacado';
  register: UseFormRegister<any>;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" {...register(name)} className="sr-only peer" />
      <div className="relative w-14 h-8 rounded-full bg-slate-200 border border-slate-300 transition-colors duration-200 peer-checked:border-slate-500">
        <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-300 shadow-sm transition-transform duration-200 transform peer-checked:translate-x-[1.25rem] peer-checked:border-slate-500">
          <span className="text-slate-400 peer-checked:text-slate-700">✔</span>
        </span>
      </div>
    </label>
  );
}
