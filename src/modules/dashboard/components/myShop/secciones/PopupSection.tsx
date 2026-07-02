import PopupManager from '../../popups/PopupManager';

interface Props {
  onVolver: () => void;
}

// Envuelve el PopupManager existente con el header de sección del hub "Editar Sitio".
export default function PopupSection({ onVolver }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onVolver}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Secciones
        </button>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-black text-slate-900">Popups</h1>
      </div>

      <div className="pb-20">
        <PopupManager />
      </div>
    </div>
  );
}
