/* eslint-disable react/prop-types */
import type React from 'react';

export function IconInput({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ElementType;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
          error ? 'text-red-400' : 'text-gray-300'
        }`}
      />
      {children}
    </div>
  );
}
