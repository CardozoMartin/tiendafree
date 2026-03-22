import type { TemplateSectionEditorProps } from '../editorRegistry';

const PinkHeroSectionEditor = ({
  data,
  editMode,
  onChange,
  onSave,
  onCancel,
}: TemplateSectionEditorProps) => {
  const images = (data.carrusel ?? []).map((item) => item.url).filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-rose-50 min-h-[70vh] flex items-center">
      <div className="max-w-6xl w-full mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-10 items-center py-14">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest text-rose-500 uppercase mb-4">
            Pink template
          </span>

          {editMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={data.titulo ?? ''}
                onChange={(e) => onChange({ titulo: e.target.value })}
                className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-3xl md:text-4xl font-black text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Titulo principal"
              />

              <textarea
                value={data.descripcion ?? ''}
                onChange={(e) => onChange({ descripcion: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Subtitulo"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onSave}
                  className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
                >
                  Guardar
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 text-sm font-semibold hover:bg-rose-100"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-black text-rose-900 leading-tight">
                {data.titulo || 'Tu titulo de tienda'}
              </h1>
              <p className="mt-6 text-slate-500 text-base max-w-md leading-relaxed">
                {data.descripcion || 'Agrega una descripcion para destacar tu propuesta de valor.'}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(images.length > 0 ? images.slice(0, 6) : [
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop',
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=800&fit=crop',
          ]).map((src, idx) => (
            <img
              key={`${src}-${idx}`}
              src={src}
              alt={`pink-${idx}`}
              className="w-full h-40 object-cover rounded-2xl shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PinkHeroSectionEditor;