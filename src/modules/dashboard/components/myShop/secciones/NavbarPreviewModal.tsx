type NavbarStyle = 'STICKY' | 'TRANSPARENT' | 'FLOATING';

interface Props {
  styleActual: NavbarStyle;
  onClose: () => void;
  onSelect: (s: NavbarStyle) => void;
}

const BG_HERO = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

function MockSticky() {
  return (
    <div className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="w-14 h-3 bg-gray-800 rounded-sm" />
        <div className="flex gap-2">
          <div className="w-8 h-2 bg-gray-300 rounded" />
          <div className="w-10 h-2 bg-gray-300 rounded" />
          <div className="w-12 h-5 bg-gray-800 rounded-full" />
        </div>
      </div>
      <div className="flex-1 bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center">
        <div className="w-20 h-3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

function MockTransparent() {
  return (
    <div className="w-full h-36 rounded-xl overflow-hidden relative">
      <img src={BG_HERO} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2">
        <div className="w-14 h-3 bg-white/80 rounded-sm" />
        <div className="flex gap-2 items-center">
          <div className="w-8 h-2 bg-white/60 rounded" />
          <div className="w-10 h-2 bg-white/60 rounded" />
          <div className="w-12 h-5 bg-white/30 border border-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function MockFloating() {
  return (
    <div className="w-full h-36 bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl overflow-hidden flex flex-col pt-2 px-2">
      <div className="flex items-center justify-between bg-white/90 backdrop-blur border border-gray-100 shadow-md rounded-2xl px-3 py-2">
        <div className="w-12 h-3 bg-gray-800 rounded-sm" />
        <div className="flex gap-2 items-center">
          <div className="w-7 h-2 bg-gray-300 rounded" />
          <div className="w-9 h-2 bg-gray-300 rounded" />
          <div className="w-11 h-4 bg-gray-800 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-20 h-3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

const OPCIONES: { style: NavbarStyle; label: string; desc: string; Mock: React.FC }[] = [
  { style: 'STICKY',      label: 'Fija',         desc: 'Siempre visible, fondo blanco con borde inferior.',             Mock: MockSticky },
  { style: 'TRANSPARENT', label: 'Transparente', desc: 'Transparente sobre el hero, se vuelve sólida al hacer scroll.', Mock: MockTransparent },
  { style: 'FLOATING',    label: 'Flotante',      desc: 'Despegada de los bordes, con blur y sombra.',                  Mock: MockFloating },
];

export default function NavbarPreviewModal({ styleActual, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Comportamiento del menú</h2>
            <p className="text-xs text-gray-400 mt-0.5">Cómo se mueve la barra de navegación al hacer scroll</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {OPCIONES.map(({ style, label, desc, Mock }) => (
            <div
              key={style}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                styleActual === style ? 'border-gray-900' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <Mock />
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    {styleActual === style && (
                      <span className="text-[10px] font-semibold bg-gray-900 text-white px-1.5 py-0.5 rounded-full">Actual</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => onSelect(style)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    styleActual === style
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {styleActual === style ? 'Seleccionado' : 'Elegir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
