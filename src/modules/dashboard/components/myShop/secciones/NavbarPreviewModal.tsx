import MI from '../../MaterialIcon';

// Modal con vista previa de cada estilo de navbar, para que el dueño entienda
// cómo se verá la barra antes de elegirla. Muestra una maqueta representativa
// del navbar sobre una "página" de ejemplo.

type NavStyle = 'STICKY' | 'TRANSPARENT' | 'FLOATING';

const META: Record<NavStyle, { label: string; desc: string }> = {
  STICKY:      { label: 'Fija', desc: 'La barra queda siempre visible arriba, con fondo blanco y un borde inferior. Clásica y clara.' },
  TRANSPARENT: { label: 'Transparente', desc: 'Sobre la portada la barra es transparente y deja ver la imagen. Al bajar se vuelve sólida. Moderna y elegante.' },
  FLOATING:    { label: 'Flotante', desc: 'La barra se despega de los bordes, con esquinas redondeadas y sombra. Se siente ligera y actual.' },
};

// Maqueta de una barra de navegación (logo + links + carrito).
function BarraMock({ variant }: { variant: NavStyle }) {
  const inner = (
    <>
      <div className="h-3 w-16 rounded bg-slate-700" />
      <div className="flex items-center gap-3">
        <div className="h-2 w-8 rounded bg-slate-400" />
        <div className="h-2 w-8 rounded bg-slate-400" />
        <div className="h-2 w-8 rounded bg-slate-400" />
        <div className="w-5 h-5 rounded-full bg-indigo-500" />
      </div>
    </>
  );

  if (variant === 'FLOATING') {
    return (
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/95 shadow-lg border border-gray-100">
        {inner}
      </div>
    );
  }
  if (variant === 'TRANSPARENT') {
    return (
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-transparent">
        <div className="h-3 w-16 rounded bg-white/90" />
        <div className="flex items-center gap-3">
          <div className="h-2 w-8 rounded bg-white/70" />
          <div className="h-2 w-8 rounded bg-white/70" />
          <div className="h-2 w-8 rounded bg-white/70" />
          <div className="w-5 h-5 rounded-full bg-white/90" />
        </div>
      </div>
    );
  }
  // STICKY
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
      {inner}
    </div>
  );
}

// "Página" de fondo para dar contexto a la barra.
function PaginaMock({ variant }: { variant: NavStyle }) {
  const conImagen = variant === 'TRANSPARENT';
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      {/* Hero de ejemplo */}
      {conImagen ? (
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&h=500&w=900&auto=format&fit=crop"
          alt=""
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 mt-8">
          <div className="h-4 w-40 rounded bg-slate-300" />
          <div className="h-2 w-28 rounded bg-slate-300" />
        </div>
      )}
      {/* Grilla de productos de ejemplo */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-square rounded-lg bg-white border border-slate-100" />
        ))}
      </div>
      <BarraMock variant={variant} />
    </div>
  );
}

interface Props {
  estilo: NavStyle;
  onClose: () => void;
}

export default function NavbarPreviewModal({ estilo, onClose }: Props) {
  const meta = META[estilo];
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
            <h3 className="text-lg font-black text-slate-900">Menú {meta.label.toLowerCase()}</h3>
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
          <PaginaMock variant={estilo} />
          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Es una representación. En tu tienda se aplica con tu logo, colores y menú reales.
          </p>
        </div>
      </div>
    </div>
  );
}
