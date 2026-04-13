import * as htmlToImage from 'html-to-image';
import {
  CheckCircle2,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Layout,
  Palette,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Fondo1 from '../../../assets/Fondos De Cards/Fondo1.jpg';
import Fondo2 from '../../../assets/Fondos De Cards/Fondo2.jpg';
import Fondo3 from '../../../assets/Fondos De Cards/Fondo3.avif';
import Fondo4 from '../../../assets/Fondos De Cards/Fondo4.avif';
import { BANNER_CONFIGS, BANNER_LIST } from './bannerConfigs';
import CardBackgroundSelector from './BannerCreatorSection/CardBackgroundSelector';
import DashboardHelp from './DashboardHelp';
import MI from './MaterialIcon';

const CARD_IMAGE_BACKGROUNDS = [
  { label: 'Fondo 1', src: Fondo1 },
  { label: 'Fondo 2', src: Fondo2 },
  { label: 'Fondo 3', src: Fondo3 },
  { label: 'Fondo 4', src: Fondo4 },
];

interface BannerCreatorSectionProps {
  accent: string;
  tienda: any;
}

export default function BannerCreatorSection({ accent, tienda }: BannerCreatorSectionProps) {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const [category, setCategory] = useState<'BANNER' | 'CARD'>('BANNER');
  const [selectedBannerId, setSelectedBannerId] = useState<string>('banner1');

  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPriceOld, setProductPriceOld] = useState('');

  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
  const [cardBgKind, setCardBgKind] = useState<'preset' | 'color' | 'none'>('preset');
  const [cardBgIdx, setCardBgIdx] = useState(0);
  const [cardBgColor, setCardBgColor] = useState('#ffffff');

  const [ctaText, setCtaText] = useState('¡Super Oferta!');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [showStoreName, setShowStoreName] = useState(true);
  const [storeNameColor, setStoreNameColor] = useState('#ffffff');
  const [showDesc, setShowDesc] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'content' | 'style'>('layout');

  // ── Refs ───────────────────────────────────────────────────────────────────
  // Un único ref para el banner nativo: se escala con CSS transform para el
  // preview pero html-to-image lo captura a su tamaño real → export idéntico.
  const bannerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const currentBanner = BANNER_CONFIGS[selectedBannerId] || BANNER_CONFIGS.banner1;
  const filteredBanners = BANNER_LIST.filter((b) => b.category === category);
  const imageSlots = currentBanner.layout.productImages.length;

  useEffect(() => {
    setStoreNameColor(currentBanner.layout.storeName.color ?? '#ffffff');
  }, [currentBanner.layout.storeName.color]);

  // ── Recalcular scale cuando cambia el contenedor o el banner ──────────────
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth;
        setScale(availableWidth / currentBanner.width);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [currentBanner.width]);

  // ── Sincronizar categoría ──────────────────────────────────────────────────
  useEffect(() => {
    const firstOfCat = BANNER_LIST.find((b) => b.category === category);
    if (firstOfCat) setSelectedBannerId(firstOfCat.id);
  }, [category]);

  // ── Limpiar imágenes que sobran al cambiar plantilla ──────────────────────
  useEffect(() => {
    const needed = currentBanner.layout.productImages.length;
    setImages((prev) => {
      if (prev.length <= needed) return prev;
      const next = [...prev];
      for (let i = needed; i < next.length; i++) next[i] = null;
      return next;
    });
  }, [currentBanner.layout.productImages.length]);

  // ── Upload imágenes ────────────────────────────────────────────────────────
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = reader.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  // ── Export pixel-perfect ──────────────────────────────────────────────────
  // El bannerRef apunta al div con el tamaño REAL (ej. 1200×628px).
  // html-to-image lo captura tal cual → idéntico a lo que se ve en pantalla.
  const handleDownload = useCallback(async () => {
    if (!bannerRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);
    try {
      const dataUrl = await htmlToImage.toPng(bannerRef.current, {
        cacheBust: true,
        skipFonts: false,
        pixelRatio: 1,
        width: currentBanner.width,
        height: currentBanner.height,
      });

      const link = document.createElement('a');
      const slug = productName ? productName.toLowerCase().replace(/\s+/g, '-') : 'diseno';
      link.download = `${category.toLowerCase()}-${slug}.png`;
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error exportando:', err);
      alert('Hubo un problema al exportar la imagen.');
    } finally {
      setIsExporting(false);
    }
  }, [bannerRef, productName, currentBanner, category]);

  // ── Contenido del banner (se usa solo una vez, en bannerRef) ──────────────
  const renderBannerContent = () => (
    <>
      {/* Store Name */}
      {showStoreName && (
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            left: `${currentBanner.layout.storeName.x}%`,
            top: `${currentBanner.layout.storeName.y}%`,
            fontSize: `${currentBanner.layout.storeName.fontSize}px`,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: storeNameColor,
            ...(currentBanner.layout.storeName.shadow && {
              textShadow: currentBanner.layout.storeName.shadow,
            }),
          }}
        >
          {tienda?.nombre || 'MI TIENDA'}
        </div>
      )}

      {/* Badge CTA */}
      {ctaText && category !== 'CARD' && (
        <div
          style={{
            position: 'absolute',
            zIndex: 30,
            left: `${currentBanner.layout.ctaBadge.x}%`,
            top: `${currentBanner.layout.ctaBadge.y}%`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: 9999,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              backgroundColor: accentColor,
              color: '#000',
              fontSize: `${currentBanner.layout.ctaBadge.fontSize}px`,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            {ctaText}
          </span>
        </div>
      )}

      {/* Product Images */}
      {currentBanner.layout.productImages.map((pos, idx) => {
        const img = images[idx];
        if (!img) return null;
        const imageTop = category === 'CARD' ? pos.y + 5 : pos.y;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              zIndex: 10,
              left: `${pos.x}%`,
              top: `${imageTop}%`,
              width: `${pos.width}%`,
              height: category === 'CARD' ? '95%' : '90%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: category === 'CARD' ? 32 : 0,
              padding: category === 'CARD' ? 14 : 0,
              boxSizing: 'border-box',
            }}
          >
            <img
              src={img}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        );
      })}

      {/* Placeholder (solo visible si no hay imagen 0) */}
      {!images[0] && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: `${currentBanner.layout.productImages[0].x}%`,
            top: `${currentBanner.layout.productImages[0].y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        >
          <ImageIcon
            style={{ width: `${64 * (1 / scale)}px`, height: `${64 * (1 / scale)}px` }}
            color="#94a3b8"
          />
          <p
            style={{
              fontSize: `${12 * (1 / scale)}px`,
              fontWeight: 700,
              marginTop: 8,
              color: '#94a3b8',
            }}
          >
            SIN IMAGEN PRINCIPAL
          </p>
        </div>
      )}

      {/* Text group */}
      <div
        style={{
          position: 'absolute',
          zIndex: 20,
          left: `${currentBanner.layout.productName.x}%`,
          top: `${currentBanner.layout.productName.y}%`,
          width: `${currentBanner.layout.productName.width || 50}%`,
          ...(currentBanner.layout.productName.maxWidth && {
            maxWidth: currentBanner.layout.productName.maxWidth,
          }),
          transform:
            currentBanner.layout.productName.textAlign === 'center' ? 'translateX(-50%)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {category !== 'CARD' && (
          <>
            <h2
              style={{
                fontSize: `${currentBanner.layout.productName.fontSize}px`,
                color: currentBanner.layout.productName.color,
                textAlign: currentBanner.layout.productName.textAlign,
                fontWeight: 900,
                lineHeight: 1,
                margin: 0,
                textShadow: currentBanner.layout.productName.shadow || 'none',
              }}
            >
              {productName || 'Nombre del Producto'}
            </h2>

            {showDesc && productDesc && (
              <p
                style={{
                  fontSize: `${currentBanner.layout.productDesc.fontSize}px`,
                  color: currentBanner.layout.productDesc.color,
                  textAlign: currentBanner.layout.productDesc.textAlign,
                  lineHeight: 1.4,
                  opacity: 0.9,
                  margin: '10px 0 0',
                }}
              >
                {productDesc}
              </p>
            )}
          </>
        )}

        {(productPrice || productPriceOld) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 16,
              justifyContent:
                currentBanner.layout.priceContainer.textAlign === 'center'
                  ? 'center'
                  : 'flex-start',
            }}
          >
            {productPriceOld && (
              <span
                style={{
                  textDecoration: 'line-through',
                  fontWeight: 700,
                  opacity: 0.4,
                  color: '#6b7280',
                  fontSize: `${(currentBanner.layout.priceContainer.fontSize ?? 32) * 0.6}px`,
                }}
              >
                ${productPriceOld}
              </span>
            )}
            <div
              style={{
                padding: '8px 20px',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                backgroundColor: accentColor,
                color: '#000',
              }}
            >
              <span
                style={{
                  fontSize: `${currentBanner.layout.priceContainer.fontSize}px`,
                  fontWeight: 900,
                }}
              >
                ${productPrice || '0.00'}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // ── Render principal ───────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 lg:px-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <MI name="auto_awesome" className="!text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Diseño Studio</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Generador de Banners y Cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DashboardHelp activeSection="banner-creator" accent={accent} />
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50
              ${
                exportSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
          >
            {isExporting ? (
              <MI name="sync" className="animate-spin" />
            ) : exportSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? 'Exportando...' : exportSuccess ? '¡Descargado!' : 'Descargar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ══════════════════════════════════════════════════════════════════
            SIDEBAR DE CONTROLES
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          {/* Tabs */}
          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm flex gap-1">
            {(
              [
                { key: 'layout', icon: <Layout size={14} />, label: 'Estilos' },
                { key: 'content', icon: <Type size={14} />, label: 'Texto' },
                { key: 'style', icon: <Palette size={14} />, label: 'Fotos' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm min-h-[500px]">
            {/* ── TAB: LAYOUT ── */}
            {activeTab === 'layout' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                    Tipo de Formato
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['BANNER', 'CARD'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-3 rounded-2xl border-2 font-bold text-xs transition-all ${
                          category === cat
                            ? 'border-slate-900 bg-slate-50 text-slate-900'
                            : 'border-slate-100 text-slate-400'
                        }`}
                      >
                        {cat === 'BANNER' ? 'Promos (16:9)' : 'Social (1:1)'}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                    Plantillas Disponibles
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredBanners.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBannerId(b.id)}
                        className={`group p-4 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${
                          selectedBannerId === b.id
                            ? 'border-slate-900 bg-slate-50 shadow-md'
                            : 'border-slate-50 hover:border-slate-100'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-black text-slate-900">{b.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {b.description}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            selectedBannerId === b.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          <ChevronRight size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── TAB: CONTENT ── */}
            {activeTab === 'content' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                <section className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Ej: Auriculares Pro Max"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-slate-900/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Descripción Corta
                    </label>
                    <textarea
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      placeholder="Breve descripción de impacto..."
                      rows={3}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-slate-900/10 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Precio Oferta
                      </label>
                      <input
                        type="text"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="$0.00"
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-slate-900/10"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Precio Regular
                      </label>
                      <input
                        type="text"
                        value={productPriceOld}
                        onChange={(e) => setProductPriceOld(e.target.value)}
                        placeholder="$0.00"
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-slate-900/10"
                      />
                    </div>
                  </div>
                  {category !== 'CARD' && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Texto del Badge
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="¡LIQUIDACIÓN!"
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black outline-none"
                      />
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ── TAB: STYLE ── */}
            {activeTab === 'style' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                    Fotos de Productos
                  </label>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Este banner admite {imageSlots} imagen{imageSlots === 1 ? '' : 'es'} de
                    producto.
                  </p>
                  <div className="space-y-3">
                    {Array.from({ length: imageSlots }, (_, idx) => {
                      const img = images[idx];
                      return (
                        <div key={idx} className="relative group">
                          {img ? (
                            <div className="relative w-full h-32 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                              <img
                                src={img}
                                className="w-full h-full object-contain bg-slate-50"
                                alt={`Producto ${idx + 1}`}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                <button
                                  onClick={() => fileInputRefs[idx].current?.click()}
                                  className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-all"
                                >
                                  <MI name="cached" />
                                </button>
                                <button
                                  onClick={() => removeImage(idx)}
                                  className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase">
                                Slot {idx + 1}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => fileInputRefs[idx].current?.click()}
                              className="w-full h-24 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-slate-200 hover:bg-slate-50 transition-all gap-1"
                            >
                              <Plus size={20} />
                              <span className="text-[10px] font-bold uppercase">
                                Añadir Foto {idx + 1}
                              </span>
                            </button>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            ref={fileInputRefs[idx]}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(idx, e)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
                {category === 'CARD' && (
                  <CardBackgroundSelector
                    selectedKind={cardBgKind}
                    onKindChange={setCardBgKind}
                    selectedPreset={cardBgIdx}
                    onPresetChange={setCardBgIdx}
                    presets={CARD_IMAGE_BACKGROUNDS}
                    colorValue={cardBgColor}
                    onColorChange={setCardBgColor}
                  />
                )}

                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                    Ajustes Visuales
                  </label>
                  <div className="bg-slate-50 rounded-3xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Color de Acento</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg border border-slate-200"
                          style={{ backgroundColor: accentColor }}
                        />
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Color nombre tienda</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg border border-slate-200"
                          style={{ backgroundColor: storeNameColor }}
                        />
                        <input
                          type="color"
                          value={storeNameColor}
                          onChange={(e) => setStoreNameColor(e.target.value)}
                          className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                    {(
                      [
                        {
                          label: 'Nombre Tienda',
                          checked: showStoreName,
                          onChange: setShowStoreName,
                        },
                        { label: 'Descripción', checked: showDesc, onChange: setShowDesc },
                      ] as const
                    ).map(({ label, checked, onChange }) => (
                      <label
                        key={label}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-600">{label}</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => onChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Tip Pro */}
          <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-blue-900 uppercase tracking-wide">Tip Pro</p>
              <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed mt-0.5">
                Usa imágenes con fondo transparente (PNG) para resultados profesionales.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PREVIEW CANVAS
            Un único div al tamaño real, escalado con CSS transform.
            html-to-image captura bannerRef → export idéntico al preview.
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Vista Previa en Tiempo Real
              </span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {currentBanner.width} × {currentBanner.height} PX
            </span>
          </div>

          {/*
            Wrapper que mide el ancho disponible.
            El padding-bottom reserva el alto proporcional al aspect ratio.
            El div interior con transform: scale(X) escala el banner nativo.
          */}
          <div
            ref={containerRef}
            className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200"
            style={{ position: 'relative' }}
          >
            {/* Reserva de espacio según aspect ratio */}
            <div
              style={{
                width: '100%',
                paddingBottom: `${(currentBanner.height / currentBanner.width) * 100}%`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Wrapper de escala: posición absoluta para no afectar el flujo */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transformOrigin: 'top left',
                  transform: `scale(${scale})`,
                  // El ancho/alto reales del banner, la escala lo encoge
                  width: `${currentBanner.width}px`,
                  height: `${currentBanner.height}px`,
                }}
              >
                {/* ← Este es el div que exporta html-to-image, al tamaño real */}
                <div
                  ref={bannerRef}
                  style={{
                    width: `${currentBanner.width}px`,
                    height: `${currentBanner.height}px`,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor:
                      category === 'CARD'
                        ? cardBgKind === 'color'
                          ? cardBgColor
                          : 'transparent'
                        : currentBanner.backgroundColor || '#f8fafc',
                    backgroundImage:
                      category === 'CARD'
                        ? cardBgKind === 'preset'
                          ? `url(${CARD_IMAGE_BACKGROUNDS[cardBgIdx].src})`
                          : 'none'
                        : currentBanner.image
                          ? `url(${currentBanner.image})`
                          : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {renderBannerContent()}
                </div>
              </div>
            </div>
          </div>

          {/* Quote decorativa */}
          <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm italic">
            <div className="text-slate-300">
              <MI name="format_quote" className="!text-4xl" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              "El diseño es el embajador silencioso de tu marca. Un buen banner no solo informa,
              sino que invita a soñar con el producto."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
