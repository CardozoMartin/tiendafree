import * as htmlToImage from 'html-to-image';
import { useCallback, useRef, useState } from 'react';
import MI from './MaterialIcon';
import { BANNER_CONFIGS, BANNER_LIST, type ElementPosition } from './bannerConfigs';

interface BannerCreatorSectionProps {
  accent: string;
  tienda: any;
}

// OUTPUT: 1200 × 628 px
const OUTPUT_W = 1200;
const OUTPUT_H = 628;

export default function BannerCreatorSection({ accent, tienda }: BannerCreatorSectionProps) {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const [selectedBannerId, setSelectedBannerId] = useState<string>('banner1');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPriceOld, setProductPriceOld] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [ctaText, setCtaText] = useState('¡Super Oferta!');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [showStoreName, setShowStoreName] = useState(true);
  const [showDesc, setShowDesc] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener configuración del banner seleccionado
  const currentBanner = BANNER_CONFIGS[selectedBannerId] || BANNER_CONFIGS.banner1;

  // Helper: convertir ElementPosition a estilos CSS
  const getPositionStyle = (pos: ElementPosition) => ({
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    ...(pos.fontSize && { fontSize: `${pos.fontSize}px` }),
    ...(pos.width && { width: `${pos.width}%` }),
    ...(pos.maxWidth && { maxWidth: pos.maxWidth }),
    ...(pos.textAlign && { textAlign: pos.textAlign }),
    ...(pos.color && { color: pos.color }),
  });

  // ── Upload imagen producto ─────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProductImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Export 1200×628 ────────────────────────────────────────────────────────
  // Escala el canvas visual al tamaño de salida exacto antes de capturar.
  const handleDownload = useCallback(async () => {
    if (!bannerRef.current) return;
    setIsExporting(true);
    try {
      const scale = OUTPUT_W / bannerRef.current.offsetWidth;

      const dataUrl = await htmlToImage.toPng(bannerRef.current, {
        cacheBust: true,
        skipFonts: true,
        width: OUTPUT_W,
        height: OUTPUT_H,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${bannerRef.current.offsetWidth}px`,
          height: `${bannerRef.current.offsetHeight}px`,
        },
      });

      const link = document.createElement('a');
      const slug = productName ? productName.toLowerCase().replace(/\s+/g, '-') : 'promo';
      link.download = `banner-${slug}-1200x628.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exportando:', err);
      alert('Hubo un problema al exportar la imagen.');
    } finally {
      setIsExporting(false);
    }
  }, [bannerRef, productName]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <MI name="wallpaper" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Creador de Banners</h1>
        </div>
        <p className="text-sm text-zinc-500">
          Completá los datos, previsualizá y descargá tu banner en 1200×628 px.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ══════════════════════════════════════════════════════════════════
            PANEL DE CONTROLES
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col gap-6">
            {/* Seleccionar Banner */}
            <section>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                0. Selecciona un Banner
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BANNER_LIST.map((banner) => (
                  <button
                    key={banner.id}
                    onClick={() => setSelectedBannerId(banner.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedBannerId === banner.id
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <p className="text-xs font-semibold text-zinc-700 leading-tight">
                      {banner.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">{banner.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* 1. Producto */}
            <section>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                1. Producto
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:ring-2 transition-shadow"
                  style={{ '--tw-ring-color': accent } as any}
                />

                {/* Descripción corta — se muestra en el banner si showDesc=true */}
                <textarea
                  placeholder="Descripción corta (ej: Inalámbrico · Surround 7.1)"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  rows={2}
                  maxLength={90}
                  className="w-full text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:ring-2 transition-shadow resize-none"
                  style={{ '--tw-ring-color': accent } as any}
                />

                {/* Precios */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Precio oferta ($)"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:ring-2"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                  <input
                    type="text"
                    placeholder="Precio anterior ($)"
                    value={productPriceOld}
                    onChange={(e) => setProductPriceOld(e.target.value)}
                    className="text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:ring-2"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                </div>

                {/* Upload imagen producto */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-sm p-3 rounded-lg border border-dashed border-zinc-300 cursor-pointer hover:bg-zinc-50 text-center text-zinc-500 flex items-center justify-center gap-2 transition-colors"
                >
                  <MI name="add_photo_alternate" className="text-zinc-400" />
                  {productImage ? 'Cambiar imagen del producto' : 'Subir imagen del producto'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </section>

            {/* 2. Personalización */}
            <section>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                2. Personalización
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Texto CTA (ej: ¡Solo hoy!)"
                  maxLength={25}
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:ring-2"
                  style={{ '--tw-ring-color': accent } as any}
                />

                {/* Color de acento: badge CTA + precio */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50">
                  <label className="text-sm text-zinc-600 flex-1">Color de acento</label>
                  <span className="text-xs text-zinc-400 font-mono">{accentColor}</span>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                  />
                </div>

                {/* Visibilidad de elementos */}
                <div className="flex flex-col gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={showStoreName}
                      onChange={(e) => setShowStoreName(e.target.checked)}
                      style={{ accentColor: accent }}
                    />
                    Mostrar nombre de tienda
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={showDesc}
                      onChange={(e) => setShowDesc(e.target.checked)}
                      style={{ accentColor: accent }}
                    />
                    Mostrar descripción
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Info output */}
          <div
            className="rounded-xl p-4 border text-sm flex items-center gap-3"
            style={{ borderColor: `${accent}40`, backgroundColor: `${accent}08` }}
          >
            <MI name="info" className="text-zinc-400 shrink-0" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              La imagen se exporta en <strong className="text-zinc-700">1200 × 628 px</strong>.
              Ideal para Facebook Ads, LinkedIn y posts con link.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PREVIEW + CANVAS
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Botón descargar */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98] shadow-md"
              style={{ backgroundColor: accent }}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <MI name="file_download" className="!text-[18px]" />
                  Descargar 1200×628
                </>
              )}
            </button>
          </div>

          {/* ── Wrapper del canvas ──
              La proporción exacta del output: 1200/628 ≈ 1.91:1
              El canvas visual es más chico en pantalla pero se exporta
              escalado a 1200×628 exactos. */}
          <div
            className="bg-zinc-900 rounded-2xl w-full overflow-hidden shadow-2xl"
            style={{ aspectRatio: `${OUTPUT_W} / ${OUTPUT_H}` }}
          >
            {/* ══════════════════════════════════════════════════════════════
                CANVAS — este div es capturado y exportado como PNG
                No agregues padding acá: distorsiona el export.
            ══════════════════════════════════════════════════════════════ */}
            <div
              ref={bannerRef}
              className="w-full h-full relative overflow-hidden"
              style={{
                backgroundImage: `url(${currentBanner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay de contraste — subí opacity si el texto no se lee bien */}
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* ══════════════════════════════════════════════════════════
                  🔵 ZONA TOP — Nombre tienda + Badge CTA
              ══════════════════════════════════════════════════════════ */}
              <div
                className="absolute z-20"
                style={getPositionStyle(currentBanner.layout.storeName)}
              >
                {/* Nombre de tienda */}
                {showStoreName && (
                  <span
                    className="text-xs font-black uppercase tracking-[0.25em]"
                    style={{
                      ...getPositionStyle(currentBanner.layout.storeName),
                      position: 'static',
                      textShadow: '0 1px 8px rgba(0,0,0,0.9)',
                    }}
                  >
                    {tienda?.nombre || 'MI TIENDA'}
                  </span>
                )}
              </div>

              {/* Badge CTA */}
              <div
                className="absolute z-20"
                style={getPositionStyle(currentBanner.layout.ctaBadge)}
              >
                <span
                  className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg"
                  style={{
                    backgroundColor: accentColor,
                    color: '#000',
                    fontSize: `${currentBanner.layout.ctaBadge.fontSize}px`,
                  }}
                >
                  {ctaText || '¡Oferta!'}
                </span>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  🟠 ZONA PRODUCTO — Imagen del producto
                  Ajustá estos valores para posicionar sobre el podio:
                    bottom → qué tan alto sobre el borde inferior
                    left   → distancia del borde izquierdo
                    width  → tamaño de la imagen
                  El podio del fondo está en el tercio inferior-izquierdo.
              ══════════════════════════════════════════════════════════ */}
              {/* ══════════════════════════════════════════════════════════
                  🟠 ZONA PRODUCTO — Imagen del producto
              ══════════════════════════════════════════════════════════ */}
              <div
                className="absolute z-10"
                style={{
                  left: `${currentBanner.layout.productImage.x}%`,
                  top: `${currentBanner.layout.productImage.y}%`,
                  width: `${currentBanner.layout.productImage.width || 36}%`,
                  maxHeight: '85%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Producto"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.55))',
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-white/50 mb-4">
                    <MI name="add_photo_alternate" className="!text-3xl mb-1" />
                    <span className="text-[10px] font-medium">Foto producto</span>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════
                  🟣 ZONA TEXTO — Nombre + descripción
                  Ajustá estos valores:
                    top   → posición vertical del bloque (% desde arriba)
                    right → distancia del borde derecho
                    width → ancho disponible para el texto
                  Con el fondo actual la zona derecha (morada) es la ideal
                  para texto porque tiene buen contraste y está limpia.
              ══════════════════════════════════════════════════════════ */}
              {/* ══════════════════════════════════════════════════════════
                  🟣 ZONA TEXTO — Nombre + descripción
              ══════════════════════════════════════════════════════════ */}
              <div
                className="absolute z-20 flex flex-col gap-2"
                style={{
                  left: `${currentBanner.layout.productName.x}%`,
                  top: `${currentBanner.layout.productName.y}%`,
                  width: `${currentBanner.layout.productName.width || 52}%`,
                  maxWidth: currentBanner.layout.productName.maxWidth || '600px',
                }}
              >
                {/* Nombre del producto */}
                <h2
                  style={{
                    fontSize: `${currentBanner.layout.productName.fontSize || 28}px`,
                    color: currentBanner.layout.productName.color || '#ffffff',
                    textShadow: '0 2px 14px rgba(0,0,0,0.95)',
                    lineHeight: 1.15,
                    fontWeight: 900,
                    wordBreak: 'break-word',
                  }}
                >
                  {productName || 'Nombre del Producto'}
                </h2>

                {/* Descripción */}
                {showDesc && productDesc && (
                  <p
                    style={{
                      fontSize: `${currentBanner.layout.productDesc.fontSize || 13}px`,
                      color: currentBanner.layout.productDesc.color || 'rgba(255,255,255,0.85)',
                      textShadow: '0 1px 6px rgba(0,0,0,0.85)',
                      lineHeight: 1.4,
                    }}
                  >
                    {productDesc}
                  </p>
                )}

                {/* ══════════════════════════════════════════════════════
                    🔴 ZONA PRECIO
                ══════════════════════════════════════════════════════ */}
                {(productPrice || productPriceOld) && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {productPriceOld && (
                      <span
                        style={{
                          fontSize: `${currentBanner.layout.priceContainer.fontSize ? currentBanner.layout.priceContainer.fontSize * 0.6 : 12}px`,
                          color: `${currentBanner.layout.priceContainer.color || '#FFD700'}80`,
                          textDecoration: 'line-through',
                          fontWeight: 600,
                        }}
                      >
                        ${productPriceOld}
                      </span>
                    )}

                    {productPrice && (
                      <div
                        className="inline-flex items-center px-4 py-2 rounded-lg shadow-xl"
                        style={{ backgroundColor: accentColor }}
                      >
                        <span
                          style={{
                            fontSize: `${currentBanner.layout.priceContainer.fontSize || 26}px`,
                            fontWeight: 900,
                            color: '#000',
                          }}
                        >
                          ${productPrice}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* ══════════════ FIN CANVAS ══════════════ */}
          </div>

          <p className="mt-3 text-xs text-zinc-400 font-medium text-center">
            Preview proporcional · Export exacto 1200 × 628 px
          </p>
        </div>
      </div>
    </div>
  );
}
