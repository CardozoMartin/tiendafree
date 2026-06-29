import { useEffect, useRef, useState } from 'react';
import { useAboutUs, useUpdateAboutUs, useUploadAboutUsImage } from '../../hooks/useShop';

const AboutUsEditor = () => {
  const { data: aboutUs, isLoading } = useAboutUs();
  const updateAboutUs = useUpdateAboutUs();
  const uploadImage = useUploadAboutUsImage();
  
  const [localData, setLocalData] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    imagenUrl: '',
  });

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aboutUs) {
      setLocalData({
        titulo: aboutUs.titulo || '',
        descripcion: aboutUs.descripcion || '',
        direccion: aboutUs.direccion || '',
        imagenUrl: aboutUs.imagenUrl || '',
      });
    }
  }, [aboutUs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateAboutUs.mutate({
      titulo: localData.titulo,
      descripcion: localData.descripcion,
      direccion: localData.direccion,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage.mutateAsync(file);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (isLoading) return <div className="p-6 text-center text-sm text-gray-500">Cargando info...</div>;

  return (
    <div className="mt-10">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Sobre Nosotros
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Contá la historia de tu negocio y mostrá tu local.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        {/* Título */}
        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-gray-500 mb-1">Título de la sección</label>
          <input
            type="text"
            name="titulo"
            className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors"
            placeholder="Ej: Nuestra Historia"
            value={localData.titulo}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-gray-500 mb-1">Historia / Quiénes somos</label>
          <textarea
            rows={4}
            name="descripcion"
            className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors resize-none"
            placeholder="Contanos sobre tu emprendimiento..."
            value={localData.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Dirección */}
        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-gray-500 mb-1">Dirección del local</label>
          <input
            type="text"
            name="direccion"
            className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors"
            placeholder="Ej: Av. Principal 123, Tucumán"
            value={localData.direccion}
            onChange={handleChange}
          />
        </div>

        {/* Imagen */}
        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-gray-500 mb-3">Foto del local o equipo</label>
          <div className="flex items-center gap-4">
            <div
              className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex-shrink-0 cursor-pointer hover:border-gray-400 transition-all group"
              onClick={() => fileRef.current?.click()}
            >
              {localData.imagenUrl ? (
                <>
                  <img src={localData.imagenUrl} alt="About Us" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  </div>
                </>
              ) : uploadImage.isPending ? (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-gray-400 group-hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  <span className="text-[10px] font-bold uppercase">Subir</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-gray-500">Recomendamos una foto horizontal (16:9) de buena calidad.</p>
              {localData.imagenUrl && (
                <p className="text-[10px] text-gray-400">Hacé clic en la imagen para cambiarla.</p>
              )}
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        {/* Botón Guardar Section */}
        <div className="px-6 py-4 bg-gray-50/30 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateAboutUs.isPending}
            className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition-all"
          >
            {updateAboutUs.isPending ? 'Guardando...' : 'Guardar sección Sobre Nosotros'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsEditor;
