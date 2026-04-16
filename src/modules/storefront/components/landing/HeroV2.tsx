import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroV2 = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <section className="relative min-h-[100svh] w-full bg-tiendzi-bg flex items-center justify-center overflow-hidden pt-20">
      {/* Noise background overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-tiendzi-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Izquierda: Texto gigante */}
        <motion.div 
          className="lg:col-span-7 flex flex-col items-start gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-tiendzi-accent animate-pulse" />
            <span className="text-xs font-medium text-tiendzi-muted tracking-wide uppercase">Para comercios locales</span>
          </motion.div>

          <motion.h1 variants={item} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight">
            No subas <br className="hidden md:block"/> un producto. <br/>
            <span className="text-tiendzi-accent">Crea una <br className="hidden md:block"/>experiencia.</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg md:text-xl text-tiendzi-muted max-w-lg leading-relaxed">
            La plataforma que te da el poder de una multinacional, diseñada para la velocidad del negocio de barrio. Sin comisiones.
          </motion.p>

          <motion.div variants={item} className="flex items-center gap-4 pt-4">
            <Link to="/register" className="group flex items-center justify-center gap-2 bg-white text-tiendzi-bg px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105">
              Empieza ahora
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Derecha: Objeto 3D / Mockup flotante */}
        <motion.div 
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring' }}
        >
          {/* Abstract floating component representing the local store */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="w-full aspect-[4/5] bg-gradient-to-br from-[#2A2B35] to-[#14151B] rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/80 flex flex-col overflow-hidden relative"
          >
             {/* Mockup UI header */}
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-tiendzi-accent rounded-full" />
                  <div>
                    <div className="h-4 w-24 bg-white/20 rounded-full mb-2" />
                    <div className="h-2 w-16 bg-white/10 rounded-full" />
                  </div>
                </div>
             </div>
             {/* Mockup UI body */}
             <div className="p-6 pb-0 flex-1 flex flex-col gap-4">
                <div className="aspect-video bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800" alt="Local store" className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/5" />
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/5" />
                </div>
             </div>
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#14151B] to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator overlay */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Descubre</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};
