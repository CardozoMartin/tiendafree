import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, FileText, Globe, Package, Palette, Sparkles, CheckCircle2, ShoppingCart, Download, LayoutDashboard, PenTool } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Imágenes reales de las plantillas de TiendaFree
import modernaTemplate from '@/assets/img/moderna.png';
import pinkTemplate from '@/assets/img/pink.png';
import templateJoya from '@/assets/img/plantillaJoya.png';
import plantillaRopa from '@/assets/img/plantillaRopa.png';
import templateGorra from '@/assets/img/plantillagorra.png';

// ─── Datos de Funciones ────────────────────────────────────────────────────────
const features = [
  {
    id: 'organize',
    title: 'Organiza tus Productos',
    desc: 'Sube tu inventario fácilmente, aplica variantes y gestiona stock sin complicaciones. Mantén todo bajo control desde un solo panel.',
    icon: Package,
    color: '#ff6b3d', // Naranja
  },
  {
    id: 'sell',
    title: 'Vende por internet',
    desc: 'Llega a clientes de todo el país integrando envíos y múltiples medios de pago. Tu tienda trabajando para ti 24/7.',
    icon: Globe,
    color: '#7c6bff', // Morado
  },
  {
    id: 'catalog',
    title: 'Genera catálogos en PDF',
    desc: 'Crea catálogos profesionales listos para enviar por WhatsApp a tus clientes o mayoristas en un par de clics.',
    icon: FileText,
    color: '#28c840', // Verde
  },
  {
    id: 'customize',
    title: 'Personaliza tu sitio',
    desc: 'Modifica colores, fuentes y estilos visuales para que tu tienda hable verdaderamente el lenguaje de tu marca.',
    icon: Palette,
    color: '#eb5fa0', // Rosa
  },
];

// ─── Componentes de Mockups Visuales ───────────────────────────────────────────

const MockupOrganize = () => (
  <div className="flex flex-col h-full bg-[#f7f4ef] rounded-lg overflow-hidden border border-zinc-200 shadow-sm relative">
    <div className="border-b border-zinc-200 bg-white p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Package size={16} className="text-zinc-600" />
        <span className="text-sm font-bold text-[#17120f]">Inventario</span>
      </div>
      <div className="bg-[#ff6b3d] text-white text-[10px] font-bold px-2 py-1 rounded-full">+ Nuevo</div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-3 rounded-lg flex items-center justify-between border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md bg-zinc-100 border border-zinc-200`} />
            <div>
              <p className="text-[13px] font-bold text-[#17120f]">Producto Premium {i}</p>
              <p className="text-[11px] text-zinc-500">SKU-00{i} • Ropa</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-black text-[#17120f]">$2,400</p>
            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">12 en stock</p>
          </div>
        </div>
      ))}
    </div>
    {/* Decoración orgánica */}
    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ff6b3d] opacity-10 rounded-full blur-3xl pointer-events-none" />
  </div>
);

const MockupSell = () => (
  <div className="flex flex-col h-full bg-[#181311] rounded-lg overflow-hidden relative shadow-md">
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div className="w-16 h-4 bg-white/20 rounded-full" />
      <div className="flex gap-2">
        <div className="w-4 h-4 rounded-full bg-white/20" />
        <div className="w-4 h-4 rounded-full bg-[#7c6bff]" />
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#7c6bff]/20 text-[#7c6bff] rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">¡Pago Exitoso!</h3>
      <p className="text-sm text-white/60 max-w-[200px]">El cliente ha completado su compra de forma segura.</p>
      
      <div className="w-full mt-6 bg-white/5 border border-white/10 rounded-xl p-4 text-left">
         <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Total ventas hoy</span>
            <span className="font-bold text-[#7c6bff]">+42%</span>
         </div>
         <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#7c6bff] w-[80%]" />
         </div>
      </div>
    </div>
  </div>
);

const MockupCatalog = () => (
  <div className="flex flex-col h-full bg-zinc-100 rounded-lg overflow-hidden shadow-inner p-4 relative">
    <div className="absolute top-0 right-0 p-4 drop-shadow-md z-10 animate-bounce" style={{ animationDuration: '3s' }}>
      <div className="bg-[#28c840] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
         <FileText size={12} /> PDF LISTO
      </div>
    </div>
    
    <div className="flex-1 bg-white shadow-md rounded border border-zinc-200 overflow-hidden flex flex-col aspect-[1/1.414] mx-auto w-full max-w-[85%] relative origin-top transform scale-[0.9]">
      <div className="bg-[#181311] py-4 text-center">
        <p className="text-white font-black tracking-widest text-lg">CATÁLOGO</p>
        <p className="text-white/60 text-[10px] uppercase">Otoño / Invierno</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="w-full aspect-[4/5] bg-zinc-100 rounded" />
            <p className="text-[9px] font-bold text-[#17120f] mt-1 line-clamp-1">Item {i}</p>
            <p className="text-[10px] font-black text-[#28c840]">$1,200</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MockupCustomize = () => (
  <div className="flex h-full bg-[#f7f4ef] rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
    <div className="w-20 sm:w-24 bg-white border-r border-zinc-200 p-3 flex flex-col gap-4">
      <div className="w-full aspect-square rounded bg-[#eb5fa0]/10 flex flex-col items-center justify-center gap-1 text-[#eb5fa0]">
         <Palette size={16} />
         <span className="text-[8px] font-bold">Colores</span>
      </div>
      <div className="flex flex-col gap-2">
         {['#ff6b3d', '#7c6bff', '#28c840', '#181311'].map(c => (
            <div key={c} className="w-6 h-6 rounded-full mx-auto shadow-sm ring-1 ring-black/5" style={{ background: c }} />
         ))}
      </div>
    </div>
    <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[160px] bg-white p-3 rounded-xl shadow-lg border border-zinc-100 transform rotate-[-2deg]">
         <div className="w-8 h-8 rounded-full bg-[#eb5fa0] mb-3" />
         <div className="w-full h-3 bg-zinc-100 rounded mb-2" />
         <div className="w-2/3 h-3 bg-zinc-100 rounded mb-4" />
         <div className="w-full h-8 rounded-lg bg-zinc-900 mx-auto" />
      </div>
    </div>
  </div>
);

// ─── Componente Principal ──────────────────────────────────────────────────────

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveTab((prev) => (prev + 1) % features.length);
      }
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]); // Restart timer if unpaused

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // Restart timer when manually clicked
    startTimer();
  };

  const activeFeature = features[activeTab];

  const getMockup = (id: string) => {
    switch(id) {
       case 'organize': return <MockupOrganize />;
       case 'sell': return <MockupSell />;
       case 'catalog': return <MockupCatalog />;
       case 'customize': return <MockupCustomize />;
       default: return null;
    }
  }

  return (
    <section className="bg-white py-24 sm:py-32 px-6 lg:px-10 overflow-hidden relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Encabezado general centrado o a la izquierda */}
        <div className="mb-14 sm:mb-20 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[#181311]/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#17120f]">
            <Sparkles size={14} className="text-[#ff6b3d]" />
            Todo lo que necesitas
          </p>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-0.04em] text-[#17120f]">
            El mejor software para escalar tu marca.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center relative isolate">
          
          {/* Background Glow Central */}
          <div
            className="hidden lg:block absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-[800px] aspect-square pointer-events-none -z-10 transition-colors duration-1000 ease-in-out opacity-[0.12]"
            style={{
              background: `radial-gradient(circle at center, ${activeFeature.color} 0%, rgba(255, 255, 255, 0) 70%)`,
              filter: 'blur(60px)',
            }}
          />
          
          {/* Background Glow Secundario (Inferior Derecho de la Demo) */}
          <div
            className="absolute bottom-[-15%] right-[-10%] w-[500px] sm:w-[700px] aspect-square pointer-events-none -z-10 transition-colors duration-1000 ease-in-out opacity-[0.15]"
            style={{
              background: `radial-gradient(circle at center, ${activeFeature.color} 0%, rgba(255, 255, 255, 0) 70%)`,
              filter: 'blur(70px)',
            }}
          />

          {/* Lado izquierdo: Lista de Features */}
          <div className="flex flex-col gap-2 relative z-10" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {features.map((feature, index) => {
              const isActive = activeTab === index;

              return (
                <div 
                  key={feature.id}
                  onClick={() => handleTabClick(index)}
                  className={`group relative flex flex-col gap-2 py-4 sm:py-5 cursor-pointer transition-all duration-300 border-b border-zinc-100 last:border-none`}
                >
                  <div className="flex items-center">
                    <h3 
                      className={`text-2xl sm:text-[1.75rem] font-black tracking-[-0.03em] transition-colors`}
                      style={{ color: isActive ? feature.color : '#8f837d' }}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  {/* Descripción expansible y barra de carga */}
                  <div 
                    className={`grid transition-all duration-500 ease-in-out`}
                    style={{ 
                       gridTemplateRows: isActive ? '1fr' : '0fr',
                       opacity: isActive ? 1 : 0.5
                    }}
                  >
                    <div className="overflow-hidden flex flex-col">
                      <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#605650] pt-2 pb-4">
                        {feature.desc}
                      </p>
                      
                      {/* Barra de Progreso CSS Animada */}
                      {isActive && (
                         <div className="w-full h-1 bg-[#181311]/5 rounded-full mt-auto overflow-hidden">
                            <div 
                               className="h-full rounded-full"
                               style={{ 
                                  backgroundColor: feature.color,
                                  animation: `feature-progress 5s linear forwards`,
                                  animationPlayState: isPaused ? 'paused' : 'running'
                               }}
                            />
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lado derecho: Ventana Simulada */}
          <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/3.5] bg-[#181311] rounded-[2rem] shadow-[0_20px_60px_rgba(24,19,17,0.15)] ring-1 ring-black/5 flex flex-col overflow-hidden">
            
            {/* Barra superior estilo MacOS */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 shrink-0 bg-[#221a16]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                 <div className="px-3 py-1 bg-white/10 rounded-md flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white/50">{activeFeature.title}</span>
                 </div>
              </div>
            </div>

            {/* Contenido animado de la ventana */}
            <div className="relative flex-1 bg-[#ececf1] overflow-hidden p-6 sm:p-10 flex items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full max-h-[400px] max-w-[480px] drop-shadow-xl"
                >
                  {getMockup(activeFeature.id)}
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
}
