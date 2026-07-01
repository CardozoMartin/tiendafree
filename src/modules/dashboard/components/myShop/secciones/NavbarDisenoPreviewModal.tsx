type NavbarVariante = 'CLASICO' | 'PILL';

interface Props {
  varianteActual: NavbarVariante;
  onClose: () => void;
  onSelect: (v: NavbarVariante) => void;
}

function MockClasico() {
  return (
    <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 rounded-t-xl">
      <div className="flex items-center gap-4">
        <div className="w-16 h-4 bg-gray-800 rounded-sm" />
        <div className="hidden sm:flex gap-3">
          <div className="w-10 h-2.5 bg-gray-300 rounded" />
          <div className="w-14 h-2.5 bg-gray-300 rounded" />
          <div className="w-10 h-2.5 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-6 bg-gray-100 rounded-full border border-gray-200" />
        <div className="w-4 h-4 bg-gray-300 rounded-full" />
        <div className="w-16 h-6 bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}

function MockPill() {
  return (
    <div className="w-full h-14 flex items-center justify-center px-4 rounded-t-xl bg-gray-50">
      <div className="flex items-center gap-2 bg-zinc-50 border border-gray-200 rounded-full px-4 py-1.5 shadow-sm w-full max-w-xs justify-between">
        <div className="w-10 h-3 bg-gray-800 rounded-sm flex-shrink-0" />
        <div className="flex gap-3">
          <div className="w-8 h-2 bg-gray-300 rounded" />
          <div className="w-10 h-2 bg-gray-300 rounded" />
          <div className="w-8 h-2 bg-gray-300 rounded" />
        </div>
        <div className="w-14 h-5 rounded-full" style={{ background: 'linear-gradient(90deg, #6344ee, #e84393)' }} />
      </div>
    </div>
  );
}

const OPCIONES: { variante: NavbarVariante; label: string; desc: string; icon: string; Mock: React.FC }[] = [
  { variante: 'CLASICO', label: 'Clásico', desc: 'Logo a la izquierda, links planos, buscador, carrito y botón de login.', icon: '▬', Mock: MockClasico },
  { variante: 'PILL',    label: 'Pill',    desc: 'Todos los elementos en una píldora central flotante con botón gradiente.', icon: '💊', Mock: MockPill },
];

export default function NavbarDisenoPreviewModal({ varianteActual, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Diseños del menú</h2>
            <p className="text-xs text-gray-400 mt-0.5">Elegí el layout de tu barra de navegación</p>
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
          {OPCIONES.map(({ variante, label, desc, icon, Mock }) => (
            <div
              key={variante}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                varianteActual === variante ? 'border-gray-900' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <Mock />
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    {varianteActual === variante && (
                      <span className="text-[10px] font-semibold bg-gray-900 text-white px-1.5 py-0.5 rounded-full">Actual</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => onSelect(variante)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    varianteActual === variante
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {varianteActual === variante ? 'Seleccionado' : 'Elegir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
