import { useEffect, useState } from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';

export function Toggle({
  name,
  watch,
  setValue,
}: {
  name: 'disponible' | 'destacado';
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register?: UseFormRegister<any>;
}) {
  const value = watch(name);
  const [checked, setChecked] = useState<boolean>(!!value);

  useEffect(() => {
    setChecked(!!value);
  }, [value]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !checked;
    setChecked(next);
    setValue(name, next, { shouldDirty: true });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={`relative w-14 h-8 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${
        checked ? 'bg-gray-800 border-gray-800' : 'bg-slate-200 border-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[1.5rem]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
