import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import { useRef, useState } from 'react';
import { useAddShopCarouselImage, useDeleteShopCarouselImage } from '../../hooks/useCarrusel';

const ImageHeroHandlers = ({
  data,
  onChangeData,
}: {
  data: any;
  onChangeData: (patch: any) => void;
}) => {
  const { mutate: deleteCarouselImage } = useDeleteShopCarouselImage();
  const { mutateAsync: addCarouselImage, isPending: isAdding } = useAddShopCarouselImage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({
    titulo: '',
    subtitulo: '',
    orden: '0',
    file: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { confirm, ConfirmModal } = useConfirm();

  const handleDeleteCarouselImage = async (imageId: number) => {
    const userConfirmed = await confirm({
      titulo: '¿Estas seguro?',
      descripcion: '¿Estás seguro de que deseas eliminar la imagen?',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Eliminar imagen',
      variant: 'danger',
    });

    if (userConfirmed) {
      deleteCarouselImage(imageId);
    }
  };

  const handleChangeUrl = (idx: number, newUrl: string) => {
    const newCarrusel = [...(data.carrusel || [])];
    newCarrusel[idx] = { ...newCarrusel[idx], url: newUrl };
    onChangeData({ carrusel: newCarrusel });
  };

  const handleAddSubmit = async () => {
    if (!newImage.file) return;

    const formData = new FormData();
    formData.append('carruselImagenes', newImage.file);
    formData.append('titulo', newImage.titulo);
    formData.append('subtitulo', newImage.subtitulo);
    formData.append('orden', newImage.orden);

    try {
      await addCarouselImage(formData);
      setShowAddForm(false);
      setNewImage({ titulo: '', subtitulo: '', orden: '0', file: null });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Imágenes del Hero
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Imágenes que aparecen en el carousel principal.
        </p>
      </div>
      {ConfirmModal}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="divide-y divide-gray-50">
          {((data?.carrusel || []) as any[]).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 px-6 py-3.5 group">
              <img
                src={item.url}
                alt=""
                className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0"
              />
              <input
                type="text"
                className="flex-1 text-xs text-gray-500 outline-none bg-transparent border-b border-transparent focus:border-gray-300 pb-0.5 truncate transition-colors"
                value={item.url}
                onChange={(e) => handleChangeUrl(idx, e.target.value)}
              />
              <button
                onClick={() => handleDeleteCarouselImage(item.id)}
                className="p-1.5 text-red-500 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Eliminar imagen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="px-6 py-5 border-t border-gray-50 bg-gray-50/30 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Título de la imagen"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900 transition-colors"
                  value={newImage.titulo}
                  onChange={(e) => setNewImage({ ...newImage, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  placeholder="Subtítulo opcional"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900 transition-colors"
                  value={newImage.subtitulo}
                  onChange={(e) => setNewImage({ ...newImage, subtitulo: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900 transition-colors"
                  value={newImage.orden}
                  onChange={(e) => setNewImage({ ...newImage, orden: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Imagen
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between overflow-hidden"
                >
                  <span className="text-gray-400 truncate">
                    {newImage.file ? newImage.file.name : 'Seleccionar archivo...'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewImage({ ...newImage, file });
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={isAdding || !newImage.file}
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-all"
              >
                {isAdding ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Guardar imagen'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-50">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-gray-100 border border-dashed border-gray-200 group-hover:border-gray-400 flex items-center justify-center transition-all text-sm">
                +
              </span>
              Añadir imagen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageHeroHandlers;
