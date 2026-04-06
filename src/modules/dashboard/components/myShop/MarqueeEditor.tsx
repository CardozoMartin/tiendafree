import { useEffect, useState } from 'react';
import { useMarquee, useUpdateMarquee } from '../../hooks/useShop';

const MarqueeEditor = () => {
  const { data: marqueeItems, isLoading } = useMarquee();
  const updateMarquee = useUpdateMarquee();
  
  const [items, setItems] = useState<Array<{ texto: string; orden: number }>>([]);

  useEffect(() => {
    if (marqueeItems) {
      setItems(marqueeItems.map((it: any) => ({ texto: it.texto, orden: it.orden })));
    }
  }, [marqueeItems]);

  const handleAddItem = () => {
    setItems(prev => [...prev, { texto: '', orden: prev.length }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index).map((it, i) => ({ ...it, orden: i })));
  };

  const handleTextChange = (index: number, value: string) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, texto: value } : it));
  };

  const handleSave = () => {
    updateMarquee.mutate(items.filter(it => it.texto.trim() !== ''));
  };

  if (isLoading) return <div className="p-6 text-center text-sm text-gray-500">Cargando marcas...</div>;

  return (
    <div className="mt-10 mb-10">
      <div className="mb-5 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            Carrusel de Marcas / Frases
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Los nombres o frases que aparecen en la cinta superior en movimiento.
          </p>
        </div>
        <button
          onClick={handleAddItem}
          className="text-[10.5px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          + Agregar Frase
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-400 italic">No hay frases personalizadas. Se mostrarán las de defecto.</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-gray-300">#{index + 1}</span>
                </div>
                <input
                  type="text"
                  className="flex-1 text-sm bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Nombre de marca o frase corta..."
                  value={item.texto}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Botón Guardar Section */}
        <div className="px-6 py-4 bg-gray-50/30 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateMarquee.isPending || items.length === 0}
            className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition-all"
          >
            {updateMarquee.isPending ? 'Guardando...' : 'Guardar Marcas'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarqueeEditor;
