import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FEATURE_DATA = [
  { id: 1, title: 'Gestión 1-Tap', desc: 'Gestiona tu stock en tiempo real desde tu móvil. Cero fricción.' },
  { id: 2, title: 'Pedidos en WhatsApp', desc: 'Convierte chats en ventas. Recibe los pedidos ordenados directamente en tu WhatsApp.' },
  { id: 3, title: '0% Comisiones', desc: 'Lo que vendes es tuyo. No retenemos tu dinero ni cobramos por venta.' }
];

export const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  return (
    <section ref={containerRef} className="relative bg-tiendzi-bg py-32" id="features">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
        
        {/* Left column (Scrollable titles) */}
        <div className="flex flex-col justify-center py-[20vh] gap-32">
          {FEATURE_DATA.map((feature, i) => {
            // Cada item tiene un rango de actividad en el scrollYProgress
            const start = i * 0.33;
            const end = (i + 1) * 0.33;
            const isActive = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.3, 1, 1, 0.3]);
            
            return (
              <motion.div key={feature.id} style={{ opacity: isActive }} className="flex flex-col gap-4">
                <span className="text-tiendzi-accent font-bold tracking-widest text-sm uppercase">0{feature.id}</span>
                <h3 className="text-4xl md:text-5xl font-black text-white">{feature.title}</h3>
                <p className="text-xl text-tiendzi-muted">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Right column (Sticky Image/UI mockups) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-1/2 -translate-y-1/2 h-[600px] w-full bg-tiendzi-card rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl p-8">
            
            {/* Inner dynamic mockup container based on scroll */}
            <motion.div className="w-full h-full relative" style={{ perspective: 1000 }}>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#1E1F2A] to-[#12131A] rounded-2xl border border-white/10 flex flex-col overflow-hidden"
                style={{ 
                  rotateX: useTransform(scrollYProgress, [0, 1], [5, -5]),
                  rotateY: useTransform(scrollYProgress, [0, 1], [-5, 5]),
                }}
              >
                {/* Mock UI Header */}
                <div className="h-16 border-b border-white/5 flex items-center px-6 gap-4">
                   <div className="flex gap-1.5">
                     <div className="size-3 rounded-full bg-red-500/50" />
                     <div className="size-3 rounded-full bg-amber-500/50" />
                     <div className="size-3 rounded-full bg-green-500/50" />
                   </div>
                   <div className="h-4 w-32 bg-white/5 rounded-full ml-4" />
                </div>
                
                {/* Dynamically sliding content inside mockup */}
                <div className="relative flex-1 overflow-hidden p-6">
                  <motion.div 
                    className="absolute inset-0 p-6 flex flex-col gap-4"
                    style={{ y: useTransform(scrollYProgress, [0, 0.4, 0.8], ['0%', '-100%', '-200%']) }}
                  >
                    {/* View 1 */}
                    <div className="h-full w-full bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                      <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                      <div className="h-32 w-full bg-tiendzi-accent/20 rounded-lg border border-tiendzi-accent/30 flex items-center justify-center">
                        <span className="text-tiendzi-accent text-lg font-bold">+ Agregar Producto</span>
                      </div>
                      <div className="flex-1 rounded-lg bg-white/5 border border-white/5" />
                    </div>

                    {/* View 2 */}
                    <div className="h-full w-full bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-4 pt-10">
                       <div className="w-3/4 p-4 rounded-xl rounded-tl-none bg-[#25D366]/20 border border-[#25D366]/30 self-start">
                         <div className="h-3 w-1/2 bg-white/20 rounded mb-2" />
                         <div className="h-3 w-3/4 bg-white/10 rounded" />
                       </div>
                       <div className="w-3/4 p-4 rounded-xl rounded-tr-none bg-tiendzi-accent/20 border border-tiendzi-accent/30 self-end text-right">
                         <div className="h-3 w-1/2 bg-white/20 rounded mb-2 ml-auto" />
                         <div className="h-3 w-1/3 bg-white/10 rounded ml-auto" />
                       </div>
                    </div>

                    {/* View 3 */}
                    <div className="h-full w-full bg-white/5 rounded-xl border border-white/5 flex items-center justify-center p-6">
                       <div className="w-48 h-48 rounded-full border-[8px] border-tiendzi-accent border-r-transparent animate-spin-slow flex items-center justify-center">
                         <span className="text-3xl font-black text-white">$ 0</span>
                       </div>
                    </div>
                  </motion.div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
