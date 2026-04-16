import modernaTemplate from '@/assets/img/moderna.png';
import pinkTemplate from '@/assets/img/pink.png';
import templateGorra from '@/assets/img/plantillagorra.png';
import templateJoya from '@/assets/img/plantillaJoya.png';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const trustPoints = [
  'Sin comisiones por venta',
  'Catalogo optimizado para movil',
  'Pedidos por WhatsApp',
  'Diseno con identidad propia',
];

const capabilities = [
  {
    icon: Store,
    label: 'Presencia de marca',
    title: 'Tu home deja de parecer una plantilla mas.',
    text: 'Tomamos la claridad de Tiendanube y la sofisticacion de Shopify para llevarla a una estetica mas calida y propia de TiendaFree.',
    tone: 'from-[#ffede3] via-[#fff5ef] to-white',
  },
  {
    icon: MessageCircleMore,
    label: 'Conversion simple',
    title: 'El cliente entiende rapido y avanza mejor.',
    text: 'Bloques con mas aire, menos ruido y llamadas a la accion repartidas con intencion para que la experiencia venda sin sentirse agresiva.',
    tone: 'from-[#fff6d8] via-[#fffbef] to-white',
  },
  {
    icon: ChartNoAxesCombined,
    label: 'Operacion clara',
    title: 'Producto serio, no solo una landing linda.',
    text: 'La narrativa muestra valor real: catalogo, comunicacion, gestion y confianza. Eso eleva la percepcion del producto completo.',
    tone: 'from-[#eaf4ff] via-[#f5faff] to-white',
  },
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

function HeaderBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-b-[2.75rem] border border-[#20150d]/8 bg-[rgba(248,241,232,0.95)] px-6 py-${compact ? '3' : '4'} shadow-[0_18px_50px_rgba(58,37,20,0.06)] backdrop-blur-xl sm:px-8 lg:px-10`}
    >
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#181311] text-white">
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
    </div>
  );
}

function StickyNavbar({ show }: { show: boolean }) {
  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ backdropFilter: 'blur(18px)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="rounded-b-[2.75rem] border border-[#20150d]/8 bg-[rgba(248,241,232,0.95)] shadow-[0_18px_50px_rgba(58,37,20,0.06)]">
          <HeaderBar compact />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-visible pb-0 pt-0">
      <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top_left,_rgba(255,122,62,0.20),_transparent_38%),radial-gradient(circle_at_80%_20%,_rgba(124,107,255,0.15),_transparent_30%),linear-gradient(180deg,_#f8f1e8_0%,_#f4eee8_46%,_#f7f4ef_100%)]" />
      <div className="relative">
        <div className="overflow-hidden rounded-b-[2.75rem] bg-[linear-gradient(180deg,rgba(203,183,255,0.92)_0%,rgba(184,154,255,0.94)_100%)] shadow-[0_18px_50px_rgba(58,37,20,0.06)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pb-14 pt-12 sm:pb-16 sm:pt-20"
          >
            <div className="mx-auto max-w-6xl px-6 text-center sm:px-8 lg:px-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#24170d]/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7d5d48] backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#ff6b3d]" />
                Disenada para vender mejor
              </div>
              <h1 className="mt-8 text-4xl font-black leading-[0.9] tracking-[-0.07em] text-[#15110e] sm:text-5xl lg:text-[5.35rem]">
                La plataforma para vender
                <span className="text-[#ff6b3d]"> con presencia, claridad</span>
                <span> y estilo propio.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#5f554f] sm:text-xl">
                TiendaFree convierte tu primera impresion en una ventaja: una home mas limpia,
                mas profesional y mas recordable, inspirada en grandes referentes pero con
                personalidad propia.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-30 -mt-10 -mb-16 mx-auto grid max-w-6xl gap-3 px-4 sm:px-0 sm:grid-cols-2 xl:grid-cols-4"
        >
          {trustPoints.map((item) => (
            <article
              key={item}
              className="rounded-[1.6rem] border border-[#23180f]/8 bg-white/90 p-4 shadow-[0_16px_35px_rgba(58,37,20,0.08)] backdrop-blur"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7d5d48]">
                TiendaFree
              </p>
              <p className="mt-3 text-base font-black leading-tight tracking-[-0.04em] text-[#17120f]">
                {item}
              </p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="plataforma" className="relative z-0 px-6 pb-24 pt-56 lg:px-10 lg:pt-60">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Que tomamos de la referencia"
          title="Claridad comercial de Tiendanube. Ambicion visual de Shopify. ADN propio para TiendaFree."
          text="La idea no es copiarles la identidad. Es aprender de su estructura, su jerarquia y su capacidad para transmitir confianza, y traducir eso a una landing mucho mas propia."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`rounded-[2rem] border border-[#22170d]/8 bg-gradient-to-br ${item.tone} p-8 shadow-[0_20px_60px_rgba(61,40,26,0.06)]`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181311] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-[#7a5b45]">{item.label}</p>
                <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-[#16120f]">{item.title}</h3>
                <p className="mt-5 text-base leading-8 text-[#5f554f]">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
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

export default function HomePage() {
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyNav(window.scrollY > 180);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #f7f4ef; font-family: 'Manrope', sans-serif; }
      `}</style>
      <div className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-[#17120f]">
        <main>
          <StickyNavbar show={showStickyNav} />
          <StickyNavbar show={showStickyNav} />
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
