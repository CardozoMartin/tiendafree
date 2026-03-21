import { DEMO_ROUTES } from "../../../../components/Templates";
import moderna from "../../../../assets/img/moderna.png"

const PLANTILLAS = [
  {
    id: 1,
    nombre: 'plantilla_comun',
    label: 'Moderna',
    descripcion: 'Diseño limpio y versátil. Ideal para moda, accesorios y productos generales.',
    preview: moderna, // '/previews/moderna.png' cuando tengas imagen
    activa: true,
  },
  // { id: 2, nombre: 'plantilla_elegante', label: 'Elegante', ... }
];

const Plantillas = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Plantillas</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Elegí el diseño de tu tienda. Podés ver una demo antes de aplicar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLANTILLAS.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border-2 bg-white overflow-hidden transition-all ${
              p.activa ? 'border-violet-500' : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            {/* Preview */}
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {p.preview ? (
                <img src={p.preview} alt={p.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">🖼️</span>
                  <span className="text-xs text-slate-400 font-medium">Preview próximamente</span>
                </div>
              )}
              {p.activa && (
                <span className="absolute top-2 right-2 bg-violet-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Activa
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <div>
                <p className="font-black text-slate-900">{p.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.descripcion}</p>
              </div>
              <button
                onClick={() => window.open(DEMO_ROUTES[p.nombre], '_blank')}
                className="w-full py-2 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-all"
              >
                Ver demo →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plantillas;
