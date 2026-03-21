import { useState } from 'react';
import MI from './MaterialIcon';



const ProductsSection = ({ accent }: { accent: string }) => {

  const [showModal, setShowModal] = useState(false);



  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Productos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-px active:scale-95"
          style={{ backgroundColor: accent, boxShadow: `0 4px 14px ${accent}40` }}
        >
          <MI name="add" className="!text-base" />
          Agregar
        </button>
      </div>




      {/* Product grid */}


      {/* Add product modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Nuevo producto</h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <MI name="close" className="!text-base" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image upload */}
              <div className="flex items-center justify-center h-36 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors group">
                <div className="text-center">
                  <MI
                    name="add_photo_alternate"
                    className="text-slate-300 group-hover:text-violet-400 !text-4xl transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-1 font-medium">Subir foto del producto</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Nombre
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  placeholder="Ej: Torta de cumpleaños"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                  placeholder="Contá algo sobre el producto..."
                />
              </div>
              <button
                className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-all hover:-translate-y-px active:scale-[0.98]"
                style={{ backgroundColor: accent, boxShadow: `0 4px 14px ${accent}40` }}
              >
                Guardar producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
