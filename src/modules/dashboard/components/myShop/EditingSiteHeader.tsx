import { ChevronRight } from 'lucide-react';

interface EditingSiteHeaderProps {
  title: string;
  subtitle: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const EditingSiteHeader = ({ title, subtitle, onCancel, onSave, isSaving }: EditingSiteHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-black text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onCancel}
        type="button"
        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-all"
      >
        Descartar
      </button>
      <button
        onClick={onSave}
        type="button"
        disabled={isSaving}
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
      >
        {isSaving ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardando…
          </>
        ) : (
          <>
            Guardar cambios
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  </div>
);

export default EditingSiteHeader;
