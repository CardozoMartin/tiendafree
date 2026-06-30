import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const StickyTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate opacities for 3 text blocks
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.6], [0, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);

  const scale1 = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const scale2 = useTransform(scrollYProgress, [0.3, 0.6], [0.9, 1.1]);
  const scale3 = useTransform(scrollYProgress, [0.6, 1], [0.9, 1]);

  // Background light
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.05, 0.1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-tiendzi-bg">
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'transparent' }}
      >
        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-tiendzi-accent/10 transition-colors duration-500" />
        
        <div className="relative z-10 w-full max-w-5xl px-6 text-center">
          <motion.h2 
            style={{ opacity: opacity1, scale: scale1 }} 
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Tu cliente ya no es <br className="hidden md:block"/> sólo tu vecino.
          </motion.h2>

          <motion.h2 
            style={{ opacity: opacity2, scale: scale2 }} 
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Es cualquiera con <br className="hidden md:block"/> una pantalla.
          </motion.h2>

          <motion.h2 
            style={{ opacity: opacity3, scale: scale3 }} 
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-5xl md:text-7xl font-black text-tiendzi-accent tracking-tighter"
          >
            Llega a ellos.
          </motion.h2>
        </div>
      </motion.div>
    </section>
  );
};
