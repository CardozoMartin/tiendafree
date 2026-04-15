import type { Dispatch, SetStateAction } from 'react';

interface CardBackgroundSelectorProps {
  selectedKind: 'preset' | 'color' | 'none';
  onKindChange: Dispatch<SetStateAction<'preset' | 'color' | 'none'>>;
  selectedPreset: number;
  onPresetChange: Dispatch<SetStateAction<number>>;
  presets: { label: string; src: string }[];
  colorValue: string;
  onColorChange: Dispatch<SetStateAction<string>>;
}

export default function CardBackgroundSelector({
  selectedKind,
  onKindChange,
  selectedPreset,
  onPresetChange,
  presets,
  colorValue,
  onColorChange,
}: CardBackgroundSelectorProps) {
  return (
    <section>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
        Fondo de la card
      </label>
      <div className="flex gap-2 mb-4">
        {(
          [
            { key: 'preset', label: 'Fondos' },
            { key: 'color', label: 'Color' },
            { key: 'none', label: 'Sin fondo' },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onKindChange(option.key)}
            className={`rounded-full px-3 py-2 text-[10px] font-black uppercase transition-all ${
              selectedKind === option.key
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selectedKind === 'preset' && (
        <div className="grid grid-cols-3 gap-2">
          {presets.map((bg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPresetChange(idx)}
              className={`relative h-16 rounded-3xl border-2 transition-all overflow-hidden ${
                selectedPreset === idx ? 'border-slate-900 shadow-lg' : 'border-slate-200'
              }`}
              style={{
                backgroundImage: `url(${bg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              title={bg.label}
            >
              <span className="sr-only">{bg.label}</span>
              {selectedPreset === idx && (
                <span className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-900">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {selectedKind === 'color' && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg border border-slate-200"
              style={{ backgroundColor: colorValue }}
            />
            <input
              type="color"
              value={colorValue}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
            />
          </div>
          <span className="text-[10px] text-slate-500">
            Selecciona un color para el fondo completo de la card.
          </span>
        </div>
      )}
      {selectedKind === 'none' && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-4 text-[10px] text-slate-500">
          El fondo de la card quedará transparente / sin imagen.
        </div>
      )}
    </section>
  );
}
