import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useMisProductos } from '../hooks/useProduct';
import { postGeneratePostFn } from '../api/ai.api';
import MI from './MaterialIcon';

interface CmAiSectionProps {
  accent: string;
  tienda: any;
}

export default function CmAiSection({ accent, tienda }: CmAiSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [redSocial, setRedSocial] = useState('Instagram');
  const [tono, setTono] = useState('Profesional y Persuasivo');
  const [generatedPost, setGeneratedPost] = useState('');
  const [copied, setCopied] = useState(false);

  // Traer productos para alimentar el select
  const { data: qProductos, isLoading: isProductosLoading } = useMisProductos({ limite: 100 });

  const productos = qProductos?.datos || [];

  // Mutación a Groq
  const { mutate: generate, isPending } = useMutation({
    mutationFn: postGeneratePostFn,
    onSuccess: (res) => {
      if (res.success && res.data) {
        setGeneratedPost(res.data);
      }
    },
    onError: (err: any) => {
      alert('Ocurrió un error generando el post: ' + (err.response?.data?.message || err.message));
    }
  });

  const handleGenerate = () => {
    if (!selectedProductId) return;
    setGeneratedPost('');
    setCopied(false);
    generate({
      productoId: selectedProductId,
      tiendaId: tienda?.id,
      redSocial,
      tono
    });
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}1A`, color: accent }}>
            <MI name="auto_awesome" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Community Manager (IA)</h1>
        </div>
        <p className="text-sm text-zinc-500 max-w-2xl">
          Selecciona uno de tus productos y deja que nuestra Inteligencia Artificial escriba un copy atractivo, optimizado y listo para publicar en tus redes sociales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Controles */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <MI name="settings" className="!text-[18px] text-zinc-400" /> Parámetros del Post
            </h3>
            
            <div className="space-y-5">
              {/* Producto */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Seleccionar Producto
                </label>
                {isProductosLoading ? (
                  <div className="animate-pulse h-10 bg-zinc-100 rounded-lg w-full"></div>
                ) : (
                  <select 
                    className="w-full text-sm p-3 rounded-lg border border-zinc-200 outline-none focus:ring-2 bg-zinc-50 text-zinc-800 transition-shadow appearance-none"
                    style={{ borderColor: accent }}
                    value={selectedProductId || ''}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  >
                    <option value="" disabled>-- Elige un producto --</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Red Social */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setRedSocial('Instagram')}
                  className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${redSocial === 'Instagram' ? 'bg-gradient-to-tr from-yellow-50 via-pink-50 to-purple-50 ring-2' : 'bg-transparent border-zinc-200 hover:bg-zinc-50'}`}
                  style={redSocial === 'Instagram' ? { borderColor: accent } : {}}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-6 h-6 opacity-90" alt="Instagram"/>
                  <span className={`text-xs font-semibold ${redSocial === 'Instagram' ? 'text-zinc-900' : 'text-zinc-500'}`}>Instagram</span>
                </div>
                <div 
                  onClick={() => setRedSocial('Facebook')}
                  className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${redSocial === 'Facebook' ? 'bg-blue-50 ring-2' : 'bg-transparent border-zinc-200 hover:bg-zinc-50'}`}
                  style={redSocial === 'Facebook' ? { borderColor: accent } : {}}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-6 h-6 opacity-90" alt="Facebook"/>
                  <span className={`text-xs font-semibold ${redSocial === 'Facebook' ? 'text-zinc-900' : 'text-zinc-500'}`}>Facebook</span>
                </div>
              </div>

              {/* Tono */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Tono del mensaje
                </label>
                <select 
                  className="w-full text-sm p-3 rounded-lg border border-zinc-200 outline-none focus:ring-2 bg-zinc-50 text-zinc-800 transition-shadow appearance-none"
                  value={tono}
                  onChange={(e) => setTono(e.target.value)}
                >
                  <option value="Profesional y Persuasivo">Profesional y Persuasivo</option>
                  <option value="Amigable y Cercano">Amigable y Cercano</option>
                  <option value="Gracioso y Descontracturado">Gracioso y Descontracturado (Meme)</option>
                  <option value="Urgencia (Oferta Remate)">Urgencia (Oferta Remate, FOMO)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isPending || !selectedProductId}
                className="w-full mt-4 flex items-center justify-center gap-2 p-3.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
                style={{ backgroundColor: accent }}
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Generando...
                  </>
                ) : (
                  <>
                    <MI name="magic_button" className="!text-[18px]"/> Generar Publicación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lado Resultado */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-zinc-200 h-full flex flex-col overflow-hidden shadow-sm">
            <div className="bg-zinc-50 px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
               <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                 <MI name="edit_document" className="!text-[18px] text-zinc-400" /> Resultado Generado
               </h3>
               {generatedPost && (
                 <button 
                   onClick={handleCopy}
                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                   style={copied ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: `${accent}1A`, color: accent }}
                 >
                   <MI name={copied ? "check" : "content_copy"} className="!text-[14px]" />
                   {copied ? '¡Copiado!' : 'Copiar texto'}
                 </button>
               )}
            </div>
            
            <div className="p-6 flex-1 bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')] bg-zinc-50/50">
              {isPending ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-3 min-h-[300px]">
                  <div className="relative flex justify-center items-center">
                     <div className="absolute animate-ping w-12 h-12 rounded-full opacity-20" style={{ backgroundColor: accent }}></div>
                     <MI name="auto_awesome" className="text-4xl animate-pulse" style={{ color: accent }} />
                  </div>
                  <p className="text-sm font-medium animate-pulse">La IA está escribiendo tu post...</p>
                </div>
              ) : generatedPost ? (
                <textarea 
                   readOnly
                   value={generatedPost}
                   className="w-full h-full min-h-[300px] outline-none bg-transparent resize-none text-[15px] leading-relaxed text-zinc-800 CustomScrollbar"
                   style={{ whiteSpace: 'pre-wrap' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-3 min-h-[300px]">
                  <MI name="edit_note" className="text-5xl" />
                  <p className="text-sm font-medium">Acá aparecerá el texto de tu publicación.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
