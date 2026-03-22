import { DEMO_ROUTES } from '../../../../components/Templates';
import { PLANTILLAS } from '../../constant/plantilla_constants';


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
          <div key={p.id} className="cursor-pointer group">
            {/* Card imagen */}
            <div
              className={`rounded-2xl border-2 overflow-hidden relative aspect-[3/4] bg-slate-100 transition-all ${
                p.activa ? 'border-emerald-400' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {p.preview ? (
                <img src={p.preview} alt={p.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">🖼️</span>
                  <span className="text-xs text-slate-400 font-medium">Preview próximamente</span>
                </div>
              )}

              {/* Checkmark */}
              {p.activa && (
                <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <polyline
                      points="2,7 6,11 12,3"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3">
                <button
                  onClick={() => window.open(DEMO_ROUTES[p.nombre], '_blank')}
                  className="bg-white text-slate-800 text-sm font-bold px-6 py-2.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  Ver tiendas demo
                </button>
                <button
                  onClick={() => {
                    /* abrir características */
                  }}
                  className="bg-emerald-400 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-emerald-500 transition-colors"
                >
                  Ver características
                </button>
              </div>
            </div>

            {/* Info debajo */}
            <div className="pt-2.5 px-0.5 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">{p.label}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{p.categoria}</span>
                </div>
                <span className="text-xs text-slate-400">{p.precio}</span>
              </div>

              {p.activa && (
                <span className="inline-block text-xs px-3 py-1 rounded-full border-2 border-emerald-400 text-slate-700">
                  Diseño actual
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plantillas;
