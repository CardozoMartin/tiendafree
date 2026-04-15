const Gallery = ({
  imgs,
  editMode,
  onChange,
  accent,
}: {
  imgs?: string[];
  editMode?: boolean;
  onChange?: (imgs: string[]) => void;
  accent?: string;
}) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1562619371-b67725b6fde2?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1633983482450-bfb7b566fe6a?w=400&h=600&fit=crop',
    'https://plus.unsplash.com/premium_photo-1671209879721-3082e78307e3?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=600&fit=crop',
  ];

  const galleryItems = imgs && imgs.length > 0 ? imgs : editMode ? [] : defaultImages;

  const handleRemove = (index: number) => {
    if (!onChange) return;
    const ne = [...galleryItems];
    ne.splice(index, 1);
    onChange(ne);
  };

  const handleAdd = () => {
    if (!onChange) return;
    const url = window.prompt('Pega la URL de la imagen para la galería:');
    if (url) onChange([...galleryItems, url]);
  };

  return (
    <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>
          Galería
        </span>
        <h2 className="text-3xl font-black mt-2" style={{ color: accent }}>
          Inspiración sin límites
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Una colección visual de nuestros looks favoritos, creados con nuestros productos.
        </p>
      </div>
      {(galleryItems.length > 0 || editMode) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {galleryItems.map((src, i) => (
            <div key={i} className="relative group/gallery">
              <img
                src={src}
                alt={`look-${i}`}
                className={`w-full h-80 object-cover rounded-2xl ${
                  !editMode
                    ? 'hover:-translate-y-1 transition-transform duration-300 cursor-pointer'
                    : ''
                }`}
              />
              {editMode && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/gallery:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <button
                    onClick={() => handleRemove(i)}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
          {editMode && (
            <div
              onClick={handleAdd}
              className="w-full h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center hover:opacity-80 cursor-pointer transition-opacity"
              style={{ backgroundColor: `${accent}1A`, borderColor: accent, color: accent }}
            >
              <span className="text-3xl mb-2">+</span>
              <span className="text-sm font-semibold">Agregar imagen</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
export default Gallery;
