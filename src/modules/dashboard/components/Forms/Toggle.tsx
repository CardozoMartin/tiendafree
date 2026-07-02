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
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${
        checked ? 'bg-gray-900' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
          checked ? 'left-8' : 'left-1'
        }`}
      />
    </button>
  );
}
