import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=400', // Ropa
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=400', // Cafe
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400', // Ceramica
  'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?auto=format&fit=crop&q=80&w=400', // Plantas
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', // Zapatillas
  'https://images.unsplash.com/photo-1607006411000-dcbd99bb155e?auto=format&fit=crop&q=80&w=400', // Velas
];

export const ParallaxWall = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <section ref={containerRef} className="relative bg-tiendzi-bg py-32 overflow-hidden" id="showcase">
      <div className="absolute inset-0 bg-tiendzi-bg z-10 pointer-events-none bg-gradient-to-b from-tiendzi-bg via-transparent to-tiendzi-bg" />
      
      <div className="w-full max-w-7xl mx-auto px-6 relative z-20 text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-black text-white">Negocios reales.</h2>
        <h2 className="text-5xl md:text-6xl font-black text-tiendzi-muted">Historias reales.</h2>
      </div>

      <div className="flex gap-4 w-[120vw] -ml-[10vw] px-4 opacity-80 hover:opacity-100 transition-opacity duration-500 relative z-0">
        <motion.div style={{ y: y1 }} className="flex flex-col gap-4 w-1/3 pt-32">
          <WallImage src={MOCK_IMAGES[0]} stat="+120% ventas" />
          <WallImage src={MOCK_IMAGES[1]} stat="300 pedidos diarios" ratio="aspect-[3/4]" />
        </motion.div>

        <motion.div style={{ y: y2 }} className="flex flex-col gap-4 w-1/3 -mt-32">
          <WallImage src={MOCK_IMAGES[2]} stat="2 locaciones" ratio="aspect-[3/4]" />
          <WallImage src={MOCK_IMAGES[3]} stat="Lanzamiento sold out" />
        </motion.div>

        <motion.div style={{ y: y3 }} className="flex flex-col gap-4 w-1/3 pt-64">
          <WallImage src={MOCK_IMAGES[4]} stat="+80% clientes online" />
          <WallImage src={MOCK_IMAGES[5]} stat="Top sellers" ratio="aspect-[3/4]" />
        </motion.div>
      </div>
    </section>
  );
};

const WallImage = ({ src, stat, ratio = 'aspect-square' }: { src: string, stat: string, ratio?: string }) => (
  <div className={`relative ${ratio} w-full overflow-hidden rounded-2xl group cursor-pointer`}>
    <img 
      src={src} 
      alt="Store product" 
      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
    />
    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
    
    <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
      <span className="bg-tiendzi-accent font-bold text-white px-4 py-2 rounded-full text-sm">
        {stat}
      </span>
    </div>
  </div>
);
