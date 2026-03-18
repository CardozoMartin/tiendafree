import { useState } from 'react';
import MI from './MaterialIcon';


const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Torta de chocolate',
    price: 3500,
    stock: 8,
    category: 'Tortas',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
    active: true,
  },
  {
    id: 2,
    name: 'Alfajores x12',
    price: 1800,
    stock: 24,
    category: 'Golosinas',
    img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80',
    active: true,
  },
  {
    id: 3,
    name: 'Cheesecake frutilla',
    price: 2800,
    stock: 5,
    category: 'Tortas',
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80',
    active: false,
  },
  {
    id: 4,
    name: 'Brownie x6',
    price: 1200,
    stock: 15,
    category: 'Postres',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80',
    active: true,
  },
  {
    id: 5,
    name: 'Macaron surtido',
    price: 2200,
    stock: 0,
    category: 'Golosinas',
    img: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=300&q=80',
    active: true,
  },
  {
    id: 6,
    name: 'Tiramisú individual',
    price: 950,
    stock: 10,
    category: 'Postres',
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80',
    active: true,
  },
];
const ProductsSection = ({ accent }: { accent: string }) => {
  const [filter, setFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const categories = ['Todos', 'Tortas', 'Golosinas', 'Postres'];
  const filtered =
    filter === 'Todos' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === filter);

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

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all"
            style={
              filter === c
                ? { backgroundColor: accent, color: 'white' }
                : { backgroundColor: '#f1f5f9', color: '#64748b' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {!p.active && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-500 bg-white rounded-full px-3 py-1 shadow">
                    Pausado
                  </span>
                </div>
              )}
              {p.stock === 0 && p.active && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                  Sin stock
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{p.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-black" style={{ color: accent }}>
                  ${p.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">{p.stock} u.</span>
              </div>
            </div>
            {/* Quick actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-md text-slate-600 hover:text-blue-600 transition-colors">
                <MI name="edit" className="!text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
