import MI from '../../MaterialIcon';

// Preview del DISEÑO de navbar (Clásico vs Pill), distinto del comportamiento.

type NavVariante = 'CLASICO' | 'PILL';

const META: Record<NavVariante, { label: string; desc: string }> = {
  CLASICO: { label: 'Clásico', desc: 'Logo a la izquierda, links planos, buscador, carrito y botón de login. Directo y familiar.' },
  PILL:    { label: 'Pill', desc: 'Los links se agrupan en una píldora central con fondo, y la acción principal es un botón con degradado. Moderno y prolijo.' },
};

function MockClasico() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
        <div className="h-3 w-16 rounded bg-slate-800" />
        <div className="flex items-center gap-4">
          <div className="h-2 w-10 rounded bg-slate-400" />
          <div className="h-2 w-10 rounded bg-slate-400" />
          <div className="h-2 w-10 rounded bg-slate-400" />
          <div className="h-6 w-16 rounded-full bg-indigo-500" />
        </div>
      </div>
      <div className="h-24 bg-gradient-to-br from-slate-50 to-slate-100" />
    </div>
  );
}

function MockPill() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="h-3 w-16 rounded bg-zinc-900" />
        {/* Píldora central */}
        <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-full px-1 py-1">
          <div className="h-6 px-3 rounded-full bg-white border border-zinc-200 flex items-center">
            <div className="h-1.5 w-8 rounded bg-zinc-700" />
          </div>
          <div className="h-6 px-3 rounded-full flex items-center">
            <div className="h-1.5 w-8 rounded bg-zinc-400" />
          </div>
          <div className="h-6 px-3 rounded-full flex items-center">
            <div className="h-1.5 w-8 rounded bg-zinc-400" />
          </div>
        </div>
        {/* Botón gradiente */}
        <div className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #09090b, #71717a)' }}>
          <div className="h-1.5 w-10 rounded bg-white/80" />
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <MI name="arrow_forward" className="!text-[11px] text-zinc-700" />
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-br from-slate-50 to-slate-100" />
    </div>
  );
}

interface Props {
  diseno: NavVariante;
  onClose: () => void;
}

export default function NavbarDisenoPreviewModal({ diseno, onClose }: Props) {
  const meta = META[diseno];
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Vista previa</p>
            <h3 className="text-lg font-black text-slate-900">Navbar {meta.label.toLowerCase()}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <MI name="close" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-5">{meta.desc}</p>
          {diseno === 'CLASICO' ? <MockClasico /> : <MockPill />}
          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Es una representación. En tu tienda se aplica con tu logo, colores y menú reales.
          </p>
        </div>
      </div>
    </div>
  );
}
