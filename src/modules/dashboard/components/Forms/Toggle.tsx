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
      className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${
        checked ? 'bg-gray-800' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
