import { useState } from 'react';

import { ACCENT_COLORS, FONTS } from './constants';
import MI from './MaterialIcon';

const StoreSection = ({
  accent,
  setAccent,
}: {
  accent: string;
  setAccent: (color: string) => void;
}) => {
  const [font, setFont] = useState('Plus Jakarta Sans');
  const [storeName, setStoreName] = useState('Caro Pastelería');
  const [desc, setDesc] = useState(
    'Tortas artesanales y postres para todos tus momentos especiales 🎂'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Mi Tienda</h1>

      {/* Preview card */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="h-24 relative" style={{ backgroundColor: accent }}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute -bottom-8 left-6 size-16 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl">
            🎂
          </div>
        </div>
        <div className="pt-12 pb-5 px-6 bg-white">
          <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: font }}>
            {storeName}
          </h3>
          <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: font }}>
            {desc}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <MI name="location_on" className="text-slate-300 !text-sm" />
            <span className="text-xs text-slate-400">Palermo, CABA</span>
            <span className="mx-2 text-slate-200">·</span>
            <MI name="star" className="text-amber-400 !text-sm" />
            <span className="text-xs font-bold text-slate-600">4.9</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">Identidad</h3>
          <div>
            <label className="text-xs font-bold text-slate-500">Nombre de la tienda</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">Descripción</label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">
            Color principal
          </h3>
          <div className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className="size-10 rounded-xl transition-all hover:scale-110"
                style={{
                  backgroundColor: c,
                  boxShadow: accent === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">Tipografía</h3>
          <div className="grid grid-cols-1 gap-2">
            {FONTS.map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all"
                style={
                  font === f
                    ? { borderColor: accent, backgroundColor: `${accent}10`, color: accent }
                    : { borderColor: '#e2e8f0', color: '#64748b' }
                }
              >
                <span style={{ fontFamily: f }}>{f}</span>
                {font === f && (
                  <MI name="check_circle" className="!text-base" style={{ color: accent }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-all hover:-translate-y-px active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ backgroundColor: saved ? '#16a34a' : accent, boxShadow: `0 4px 14px ${accent}40` }}
      >
        {saved ? (
          <>
            <MI name="check" className="!text-base" /> ¡Guardado!
          </>
        ) : (
          'Guardar cambios'
        )}
      </button>
    </div>
  );
};

export default StoreSection;
