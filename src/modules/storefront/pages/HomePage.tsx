import modernaTemplate from '@/assets/img/moderna.png';
import pinkTemplate from '@/assets/img/pink.png';
import templateGorra from '@/assets/img/plantillagorra.png';
import templateJoya from '@/assets/img/plantillaJoya.png';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  MessageCircleMore,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const words = ['Rapido', 'Facil', 'Gratis', 'Profesional'];

const trustPoints = [
  'Sin comisiones por venta',
  'Catalogo optimizado para movil',
  'Pedidos por WhatsApp',
  'Diseno con identidad propia',
];

const narrative = [
  {
    id: '01',
    title: 'Hero con postura, no un encabezado generico.',
    text: 'Texto potente, composicion editorial y una vista previa que transmite producto premium desde el primer impacto.',
  },
  {
    id: '02',
    title: 'Scroll con escenas distintas y livianas.',
    text: 'En lugar de repetir titulo mas imagen, cada tramo cambia la energia con sticky layouts, paneles y transiciones suaves.',
  },
  {
    id: '03',
    title: 'Prueba de valor y conversion natural.',
    text: 'Promesas concretas, lenguaje claro y CTA visibles para reflejar profesionalismo al cliente sin saturar.',
  },
];

const cards = [
  { image: modernaTemplate, title: 'Editorial', text: 'Aire, tipografia fuerte y sensacion premium.', accent: '#ff6b3d' },
  { image: pinkTemplate, title: 'Expresiva', text: 'Mas energia y personalidad para marcas con estilo.', accent: '#eb5fa0' },
  { image: templateJoya, title: 'Delicada', text: 'Texturas suaves y foco en producto.', accent: '#7c6bff' },
  { image: templateGorra, title: 'Urbana', text: 'Mas directa, mas impacto, mas calle.', accent: '#181311' },
];

const proofItems = [
  { value: '24 hs', label: 'para lanzar una tienda que ya se siente profesional' },
  { value: '0%', label: 'de comision sobre tus ventas' },
  { value: '100%', label: 'pensada primero para celular' },
];

function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span
        className={`inline-flex rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] ${
          light
            ? 'border-white/12 bg-white/5 text-white/60'
            : 'border-[#23190f]/10 bg-white/70 text-[#7b5b44]'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-6 text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl ${
          light ? 'text-white' : 'text-[#16120f]'
        }`}
      >
        {title}
      </h2>
      <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg ${light ? 'text-white/68' : 'text-[#64584f]'}`}>
        {text}
      </p>
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const headerY = useTransform(scrollY, [0, 220], [0, -38]);
  const headerScale = useTransform(scrollY, [0, 220], [1, 0.985]);
  const headerOpacity = useTransform(scrollY, [0, 220], [1, 0.95]);

  // Hero collapse transformations - more "deconstructed" feel
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  
  // Staggered exit for internal elements
  const badgeY = useTransform(scrollY, [0, 150], [0, -50]);
  const badgeOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  
  const titleY = useTransform(scrollY, [50, 250], [0, -80]);
  const titleOpacity = useTransform(scrollY, [50, 200], [1, 0]);
  const titleScale = useTransform(scrollY, [50, 300], [1, 0.9]);
  
  const textY = useTransform(scrollY, [100, 350], [0, -100]);
  const textOpacity = useTransform(scrollY, [100, 300], [1, 0]);
  
  const buttonsY = useTransform(scrollY, [150, 450], [0, -120]);
  const buttonsOpacity = useTransform(scrollY, [150, 400], [1, 0]);
  const buttonsScale = useTransform(scrollY, [150, 450], [1, 0.85]);

  // Second Hero (Tiendzi) Transformations - Spaced out to avoid overlap
  const tiendziOpacity = useTransform(scrollY, [600, 900, 1600, 1900], [0, 1, 1, 0]);
  const tiendziY = useTransform(scrollY, [600, 900, 1600, 1900], [100, 0, 0, -100]);
  const tiendziScale = useTransform(scrollY, [600, 900], [0.9, 1]);

  return (
    <section className="relative overflow-visible pb-0 pt-0">
      <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top_left,_rgba(255,122,62,0.20),_transparent_38%),radial-gradient(circle_at_80%_20%,_rgba(124,107,255,0.15),_transparent_30%),linear-gradient(180deg,_#f8f1e8_0%,_#f4eee8_46%,_#f7f4ef_100%)]" />
      
      <div className="relative">
        {/* FIRST HERO SECTION */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="overflow-hidden rounded-b-[2.75rem] bg-[linear-gradient(180deg,rgba(203,183,255,0.92)_0%,rgba(184,154,255,0.94)_100%)] shadow-[0_18px_50px_rgba(58,37,20,0.06)]"
        >
          <motion.div
            style={{ y: headerY, scale: headerScale, opacity: headerOpacity }}
            className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10"
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#181311] text-white">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-black tracking-[-0.04em] text-[#17120f]">TiendaFree</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[#7d5d48]">Tu negocio con presencia</p>
              </div>
            </Link>

            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#181311] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white"
            >
              Crear tienda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pb-14 pt-12 sm:pb-16 sm:pt-20"
          >
            <div className="mx-auto max-w-6xl px-6 text-center sm:px-8 lg:px-10">
              <motion.div 
                style={{ y: badgeY, opacity: badgeOpacity }}
                className="inline-flex items-center gap-2 rounded-full border border-[#24170d]/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7d5d48] backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-[#ff6b3d]" />
                Disenada para vender mejor
              </motion.div>
              <motion.h1 
                style={{ y: titleY, opacity: titleOpacity, scale: titleScale }}
                className="mt-8 text-4xl font-black leading-[0.9] tracking-[-0.07em] text-[#15110e] sm:text-5xl lg:text-[5.35rem]"
              >
                La plataforma para vender
                <span className="text-[#ff6b3d]"> con presencia, claridad</span>
                <span> y estilo propio.</span>
              </motion.h1>
              <motion.p 
                style={{ y: textY, opacity: textOpacity }}
                className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#5f554f] sm:text-xl"
              >
                TiendaFree convierte tu primera impresion en una ventaja: una home mas limpia,
                mas profesional y mas recordable, inspirada en grandes referentes pero con
                personalidad propia.
              </motion.p>
              <motion.div
                style={{ y: buttonsY, opacity: buttonsOpacity, scale: buttonsScale }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  to="/register"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#181311] px-8 text-sm font-bold uppercase tracking-[0.16em] text-white"
                >
                  Crear mi tienda
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#plataforma"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[#20150d]/10 bg-white/70 px-8 text-sm font-semibold text-[#1c1613]"
                >
                  Ver la propuesta
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* TRUST CARDS (Part of the first section) */}
        <motion.div
          style={{ y: buttonsY, opacity: buttonsOpacity, scale: buttonsScale }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-30 -mt-8 -mb-16 mx-auto flex flex-wrap justify-center gap-3 px-4 max-w-5xl"
        >
          {trustPoints.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-[#23180f]/8 bg-white/90 px-4 py-2.5 shadow-[0_12px_30px_rgba(58,37,20,0.06)] backdrop-blur flex items-center gap-2"
            >
              <div className="size-1.5 rounded-full bg-[#ff6b3d]" />
              <p className="text-[11px] font-bold tracking-tight text-[#17120f] whitespace-nowrap">
                {item}
              </p>
            </article>
          ))}
        </motion.div>
      </div>

      {/* SECOND DYNAMIC HERO (TIENDZI) SECTION - Full Width Immersive Effect */}
      <div className="relative h-[800px] mt-24 overflow-hidden">
        <motion.div
          style={{ 
            opacity: tiendziOpacity, 
            y: tiendziY, 
            scale: tiendziScale,
            position: 'sticky',
            top: 0
          }}
          className="h-[800px] bg-[#181311] flex items-center justify-center text-center px-6 w-full shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          <div className="relative z-20">
            <h2 className="text-white text-3xl font-bold uppercase tracking-[0.3em] mb-4 opacity-30">Tiendzi</h2>
            <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-black text-white leading-[0.9] tracking-[-0.05em]">
              Tu tienda <br/>
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-[#ff6b3d] inline-block min-w-[300px]"
              >
                {words[wordIndex]}
              </motion.span>
            </h1>
            <p className="mt-10 text-white/50 text-xl font-medium tracking-wide">La evolucion de tu negocio empieza aca.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitCard({ card }: { card: any }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-black/5 ${card.color} p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl">
        <img 
          src={card.image} 
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col flex-1">
        <span className="mb-3 inline-block w-fit rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
          {card.tag}
        </span>
        <h3 className="mb-3 text-xl font-bold text-[#16120f]">
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#5f554f]">
          {card.desc}
        </p>
      </div>
    </div>
  );
}

function Capabilities() {
  const { scrollY } = useScroll();
  const sectionOpacity = useTransform(scrollY, [800, 1100], [0, 1]);
  const sectionY = useTransform(scrollY, [800, 1100], [100, 0]);

  const benefitCards = [
    {
      title: 'Tu marca, tus reglas',
      desc: 'Personaliza colores, tipografías y banners. No es solo una tienda, es tu identidad digital reflejada en cada píxel.',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80',
      tag: 'Diseño Pro',
      color: 'bg-purple-50',
    },
    {
      title: 'Ventas por WhatsApp',
      desc: 'Recibe los pedidos listos para procesar. Sin fricciones, directo al grano y con la calidez del trato humano.',
      image: 'https://images.unsplash.com/photo-1520923642038-b4259ace9439?auto=format&fit=crop&q=80',
      tag: 'Conversión',
      color: 'bg-green-50',
    },
    {
      title: 'Control total',
      desc: 'Gestiona stock, categorías y precios desde un panel intuitivo. Pensado para que lo hagas todo desde tu celular.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      tag: 'Gestión',
      color: 'bg-blue-50',
    },
    {
      title: 'Sin Comisiones',
      desc: 'Lo que vendes es 100% para vos. Sin letras chicas ni cargos sorpresa al final del mes. Crecemos con vos.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
      tag: 'Libertad',
      color: 'bg-orange-50',
    },
  ];

  return (
    <section id="plataforma" className="relative z-0 px-6 pb-32 pt-32 lg:px-10">
      <motion.div style={{ opacity: sectionOpacity, y: sectionY }} className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[#23190f]/10 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#7b5b44]">
              ¿Por qué elegir TiendaFree?
            </span>
            <h2 className="mt-6 text-4xl font-black leading-[1.1] tracking-[-0.05em] sm:text-6xl text-[#16120f]">
              Todo lo que necesitás <br/>
              <span className="text-[#ff6b3d]">para escalar tu negocio.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-[#64584f]">
            Diseñamos cada función pensando en la simplicidad y el impacto visual. 
            Menos configuración, más ventas.
          </p>
        </div>

        {/* Reverted to a functional grid with clean cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefitCards.map((card, idx) => (
            <BenefitCard key={idx} card={card} />
          ))}
        </div>

        {/* HOW TO USE WRAPPER */}
        <div className="mt-40 bg-[#181311] rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ff6b3d_0%,_transparent_70%)]" />
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#ff6b3d] font-bold uppercase tracking-[0.3em] text-xs">Paso a paso</span>
              <h2 className="mt-6 text-4xl lg:text-6xl font-black tracking-tight leading-none">
                Tu tienda lista <br/>
                en minutos.
              </h2>
              <p className="mt-8 text-white/60 text-lg leading-relaxed max-w-sm">
                Sin complicaciones técnicas. Seguí estos 3 pasos y empezá a recibir pedidos hoy mismo.
              </p>
              
              <div className="mt-12 space-y-8">
                {[
                  { n: '01', t: 'Regístrate gratis', d: 'Creá tu cuenta con tu email y elegí el nombre de tu marca.' },
                  { n: '02', t: 'Publicá tus productos', d: 'Subí fotos y precios. Nosotros armamos el catálogo por vos.' },
                  { n: '03', t: 'Difundí y vendé', d: 'Compartí el link en tu bio de Instagram o estados de WhatsApp.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <span className="text-2xl font-black text-white/20 group-hover:text-[#ff6b3d] transition-colors">{step.n}</span>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{step.t}</h4>
                      <p className="text-white/40 text-sm">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-[#2a1f1a] to-[#16110e] border border-white/10 p-4 shadow-2xl rotate-3">
                <div className="w-full h-full rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/5 flex items-center justify-center">
                   <div className="text-center">
                      <div className="size-16 bg-[#ff6b3d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#ff6b3d]/20">
                        <Store className="text-white size-8" />
                      </div>
                      <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Preview de tu tienda</p>
                   </div>
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-10 -left-10 bg-[#ff6b3d] p-8 rounded-[2rem] shadow-2xl -rotate-6 hidden lg:block">
                <p className="text-4xl font-black text-white">100%</p>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">Gratis siempre</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Story() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -50]);

  return (
    <section ref={wrapperRef} id="experiencia" className="relative bg-[#181311] px-6 py-24 text-white lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,61,0.17),_transparent_30%),radial-gradient(circle_at_85%_50%,_rgba(124,107,255,0.15),_transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Scroll con intencion"
          title="Una narrativa mas memorable sin animaciones pesadas."
          text="En vez de llenar todo de efectos, conviene apoyar la experiencia en cambios de foco, sticky layouts y transiciones suaves. Eso hace que se vea premium y siga sintiendose liviana."
          light
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="sticky top-28 h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,#2a1f1a_0%,#16110e_100%)] p-6">
              <motion.div style={{ y: panelY }} className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] bg-[#f5ede4] p-5 text-[#17120f]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b5b44]">Hero</p>
                  <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em]">Impacto visual, no ruido.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">Conversion</p>
                  <p className="mt-3 text-2xl font-black leading-tight">CTA visible sin gritar.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 sm:col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">Ritmo</p>
                  <p className="mt-3 max-w-md text-3xl font-black leading-tight tracking-[-0.05em]">
                    Menos bloques repetidos. Mas escenas con proposito.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="space-y-8">
            {narrative.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur"
              >
                <span className="inline-flex rounded-full bg-[#ff6b3d]/14 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffb08f]">
                  Paso {item.id}
                </span>
                <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/68">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Design() {
  return (
    <section id="diseno" className="px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Sistema visual"
          title="Disenos que no dependen de una sola formula."
          text="La homepage tiene que demostrar flexibilidad real. Eso transmite que TiendaFree puede adaptarse a distintos negocios sin perder coherencia de marca."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            className="overflow-hidden rounded-[2.2rem] border border-[#20150d]/8 bg-[#181311] p-5 text-white shadow-[0_30px_80px_rgba(34,20,10,0.18)]"
          >
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col justify-between rounded-[1.7rem] bg-[linear-gradient(180deg,#2b2019_0%,#17120f_100%)] p-7">
                <div>
                  <span className="inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                    Direccion recomendada
                  </span>
                  <h3 className="mt-6 text-4xl font-black leading-[0.92] tracking-[-0.05em]">
                    Calida, editorial y enfocada en negocio real.
                  </h3>
                  <p className="mt-5 text-base leading-8 text-white/68">
                    Menos estetica startup generica. Mas mezcla de sofisticacion, cercania y
                    claridad comercial para que TiendaFree se sienta seria y usable a la vez.
                  </p>
                </div>
                <div className="mt-8 grid gap-3">
                  {[
                    { icon: Palette, text: 'Paleta neutra con acento calido principal' },
                    { icon: Sparkles, text: 'Tipografia con mas presencia y mejor ritmo' },
                    { icon: ShieldCheck, text: 'Senales de confianza visibles, sin saturar' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                        <Icon className="h-4 w-4 text-[#ff6b3d]" />
                        <span className="text-sm text-white/80">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="overflow-hidden rounded-[1.7rem] border border-white/8 bg-white/5"
                  >
                    <div className="aspect-[0.92] overflow-hidden">
                      <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="mb-3 h-1.5 w-16 rounded-full" style={{ backgroundColor: card.accent }} />
                      <h4 className="text-xl font-black tracking-[-0.03em] text-white">{card.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-white/65">{card.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.article>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-[#20150d]/8 bg-white p-8 shadow-[0_18px_50px_rgba(58,37,20,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#7d5d48]">Lo que evita este rediseño</p>
              <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#17120f]">
                Repetir el mismo bloque una y otra vez.
              </h3>
              <p className="mt-4 text-base leading-8 text-[#605650]">
                Cada tramo del scroll cambia la energia: hero, propuesta, narrativa sticky, showcase,
                prueba social y cierre. Eso mejora recuerdo de marca y calidad percibida.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#20150d]/8 bg-[linear-gradient(180deg,#fff7ef_0%,#ffffff_100%)] p-8 shadow-[0_18px_50px_rgba(58,37,20,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#7d5d48]">Enfoque UX/UI</p>
              <p className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#17120f]">
                Menos decoracion gratuita. Mas claridad, mas jerarquia y mejor sensacion de producto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section id="precios" className="px-6 pb-24 pt-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[2rem] border border-[#1e130d]/8 bg-[#181311] p-8 text-white shadow-[0_24px_70px_rgba(27,18,12,0.18)]">
            <span className="inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">
              Profesionalismo percibido
            </span>
            <h2 className="mt-6 text-4xl font-black leading-none tracking-[-0.05em]">
              La confianza tambien se diseña.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/68">
              Shopify y Tiendanube insisten mucho en prueba social y promesas concretas. Tu landing
              tambien tiene que hacerlo, pero con una voz mas propia.
            </p>
            <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff6b3d] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Empezar gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {proofItems.map((item) => (
              <div key={item.label} className="rounded-[2rem] border border-[#20150d]/8 bg-white p-8 shadow-[0_18px_50px_rgba(58,37,20,0.08)]">
                <BadgeCheck className="h-6 w-6 text-[#ff6b3d]" />
                <p className="mt-8 text-5xl font-black tracking-[-0.06em] text-[#17120f]">{item.value}</p>
                <p className="mt-3 text-base leading-8 text-[#5e544e]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2.6rem] border border-[#20150d]/8 bg-[linear-gradient(180deg,#1a1310_0%,#0f0b09_100%)] p-6 text-white shadow-[0_32px_90px_rgba(18,11,7,0.22)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-full bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-white/60">
                Proximo paso
              </span>
              <h2 className="mt-6 text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl">
                Una landing que haga ver a TiendaFree como plataforma, no como experimento.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                Esta primera version ya marca esa direccion: mejor ritmo, mejor percepcion, mejor marca.
              </p>
            </div>
            <div className="grid gap-4 rounded-[2rem] border border-white/8 bg-white/5 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">Plan inicial</p>
                <p className="mt-3 text-5xl font-black tracking-[-0.06em]">$0</p>
                <p className="mt-3 max-w-md text-base leading-8 text-white/65">
                  Sin comision por venta. Sin ruido visual. Sin depender de una plantilla generica.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b3d] px-8 text-sm font-bold uppercase tracking-[0.16em] text-white">
                  Crear tienda gratis
                </Link>
                <a href="#plataforma" className="inline-flex h-14 items-center justify-center rounded-full border border-white/12 px-8 text-sm font-semibold text-white/85">
                  Revisar la propuesta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Footer = () => (
  <footer className="border-t border-[#20150d]/8 bg-[#f7f4ef] px-6 py-10 lg:px-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#675b54] md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-lg font-black tracking-[-0.04em] text-[#17120f]">TiendaFree</p>
        <p className="mt-1">Diseno, claridad y una experiencia mejor para vender online.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <a href="#plataforma" className="hover:text-[#17120f]">Plataforma</a>
        <a href="#experiencia" className="hover:text-[#17120f]">Experiencia</a>
        <a href="#diseno" className="hover:text-[#17120f]">Diseno</a>
      </div>
    </div>
  </footer>
);
function FloatingNav() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 200);
  });

  return (
    <motion.header
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: isScrolled ? '0%' : '-100%', opacity: isScrolled ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[100] px-4 py-4 pointer-events-none"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/40 bg-white/80 px-4 py-3 shadow-[0_16px_40px_rgba(58,37,20,0.12)] backdrop-blur-xl sm:px-6 pointer-events-auto">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#181311] text-white">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-black tracking-[-0.04em] text-[#17120f]">TiendaFree</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[#7d5d48]">Tu negocio con presencia</p>
          </div>
        </Link>
        <Link
          to="/register"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#181311] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#2c241f]"
        >
          Crear tienda
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.header>
  );
}

export default function HomePage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #f7f4ef; font-family: 'Manrope', sans-serif; }
      `}</style>
      <div className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-[#17120f]">
        <FloatingNav />
        <main>
          <Hero />
          <Capabilities />
          <Story />
          <Design />
          <Proof />
        </main>
        <Footer />
      </div>
    </>
  );
}
