import * as htmlToImage from 'html-to-image';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Italic,
  Layers,
  Minus,
  Move,
  Palette,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// ── Tipos ──────────────────────────────────────────────────────────────────────
type ElementKind = 'text' | 'price' | 'badge' | 'image' | 'shape';

interface CanvasElement {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  width: number;
  height: number;
  // texto / badge
  content?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  bgColor?: string;
  borderRadius?: number;
  // precio
  priceValue?: string;
  priceOld?: string;
  // imagen
  src?: string;
  // shape
  shapeKind?: 'rect' | 'circle' | 'star';
  fillColor?: string;
  // capa
  zIndex: number;
}

type BgKind = 'color' | 'gradient' | 'image';

interface FreeBannerEditorProps {
  tienda: any;
  accent: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

const CANVAS_PRESETS = [
  { label: '16:9 Promo', w: 1200, h: 628 },
  { label: '1:1 Social', w: 1080, h: 1080 },
  { label: '9:16 Story', w: 1080, h: 1920 },
];

const BG_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #1e1b4b 100%)',
  'linear-gradient(135deg, #065f46 0%, #0f172a 100%)',
  'linear-gradient(135deg, #9f1239 0%, #1e1b4b 100%)',
  'linear-gradient(135deg, #f97316 0%, #92400e 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #1e3a5f 100%)',
];

const STICKERS = ['⭐', '🔥', '💥', '✨', '🎯', '🏷️', '💎', '🚀', '💰', '🎁', '👑', '⚡'];

// ── Componente principal ───────────────────────────────────────────────────────
export default function FreeBannerEditor({ tienda, accent }: FreeBannerEditorProps) {
  // canvas config
  const [preset, setPreset] = useState(0);
  const canvasW = CANVAS_PRESETS[preset].w;
  const canvasH = CANVAS_PRESETS[preset].h;

  // background
  const [bgKind, setBgKind] = useState<BgKind>('color');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [bgGradient, setBgGradient] = useState(BG_GRADIENTS[0]);
  const [bgImage, setBgImage] = useState<string | null>(null);

  // elementos
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // sidebar tab
  const [sideTab, setSideTab] = useState<'fondo' | 'elementos' | 'stickers'>('elementos');

  // export
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // drag state
  const dragging = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // resize state
  const resizing = useRef<{
    id: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Calcular scale
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      setScale(containerRef.current.offsetWidth / canvasW);
    }
  }, [canvasW]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ro = useRef<ResizeObserver | null>(null);
  const containerCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ro.current) ro.current.disconnect();
      if (node) {
        containerRef.current = node;
        ro.current = new ResizeObserver(updateScale);
        ro.current.observe(node);
        updateScale();
      }
    },
    [updateScale]
  );

  // ── Selección de elemento ────────────────────────────────────────────────────
  const selected = elements.find((e) => e.id === selectedId) ?? null;

  const updateEl = (id: string, patch: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteEl = (id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
  };

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const onMouseDownEl = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    const el = elements.find((x) => x.id === id)!;
    dragging.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
    };
  };

  const onMouseDownResize = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const el = elements.find((x) => x.id === id)!;
    resizing.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origW: el.width,
      origH: el.height,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) {
      const dx = (e.clientX - dragging.current.startX) / scale;
      const dy = (e.clientY - dragging.current.startY) / scale;
      updateEl(dragging.current.id, {
        x: Math.round(dragging.current.origX + dx),
        y: Math.round(dragging.current.origY + dy),
      });
    }
    if (resizing.current) {
      const dx = (e.clientX - resizing.current.startX) / scale;
      const dy = (e.clientY - resizing.current.startY) / scale;
      updateEl(resizing.current.id, {
        width: Math.max(40, Math.round(resizing.current.origW + dx)),
        height: Math.max(24, Math.round(resizing.current.origH + dy)),
      });
    }
  };

  const onMouseUp = () => {
    dragging.current = null;
    resizing.current = null;
  };

  // ── Agregar elementos ────────────────────────────────────────────────────────
  const addText = () => {
    const el: CanvasElement = {
      id: uid(),
      kind: 'text',
      x: 80,
      y: 80,
      width: 400,
      height: 60,
      content: 'Nombre del producto',
      fontSize: 48,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#ffffff',
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const addPrice = () => {
    const el: CanvasElement = {
      id: uid(),
      kind: 'price',
      x: 80,
      y: 200,
      width: 280,
      height: 80,
      priceValue: '9.990',
      priceOld: '14.990',
      color: '#000000',
      bgColor: '#FFD700',
      borderRadius: 16,
      fontSize: 48,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const addBadge = () => {
    const el: CanvasElement = {
      id: uid(),
      kind: 'badge',
      x: 80,
      y: 340,
      width: 240,
      height: 64,
      content: '¡OFERTA!',
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000000',
      bgColor: '#FFD700',
      borderRadius: 9999,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const addImage = () => {
    imgInputRef.current?.click();
  };

  const onImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const el: CanvasElement = {
        id: uid(),
        kind: 'image',
        x: 200,
        y: 100,
        width: 400,
        height: 400,
        src: reader.result as string,
        zIndex: elements.length + 1,
      };
      setElements((prev) => [...prev, el]);
      setSelectedId(el.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addSticker = (emoji: string) => {
    const el: CanvasElement = {
      id: uid(),
      kind: 'text',
      x: 100,
      y: 100,
      width: 120,
      height: 120,
      content: emoji,
      fontSize: 96,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: 'transparent',
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  const addShape = (shapeKind: 'rect' | 'circle' | 'star') => {
    const el: CanvasElement = {
      id: uid(),
      kind: 'shape',
      x: 200,
      y: 200,
      width: 160,
      height: 160,
      shapeKind,
      fillColor: accent || '#7c3aed',
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  };

  // ── Capas ────────────────────────────────────────────────────────────────────
  const bringForward = (id: string) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    updateEl(id, { zIndex: el.zIndex + 1 });
  };
  const sendBackward = (id: string) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    updateEl(id, { zIndex: Math.max(0, el.zIndex - 1) });
  };

  // ── Background image ─────────────────────────────────────────────────────────
  const onBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setBgImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Render de cada elemento ───────────────────────────────────────────────────
  const renderElement = (el: CanvasElement) => {
    const isSelected = el.id === selectedId;
    const showEditorSelection = isSelected && !isExporting;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.kind === 'text' || el.kind === 'badge' || el.kind === 'price' ? 'auto' : el.height,
      minHeight: el.height,
      zIndex: el.zIndex,
      cursor: 'move',
      boxSizing: 'border-box',
      outline: showEditorSelection ? `${2 / scale}px solid #3b82f6` : 'none',
      outlineOffset: `${2 / scale}px`,
    };

    let inner: React.ReactNode = null;

    if (el.kind === 'text') {
      inner = (
        <span
          style={{
            display: 'block',
            width: '100%',
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
            fontStyle: el.fontStyle,
            textAlign: el.textAlign,
            color: el.color,
            lineHeight: 1.2,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {el.content}
        </span>
      );
    } else if (el.kind === 'badge') {
      inner = (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${el.height * 0.15}px ${el.height * 0.35}px`,
            backgroundColor: el.bgColor,
            color: el.color,
            borderRadius: el.borderRadius,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight,
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {el.content}
        </span>
      );
    } else if (el.kind === 'price') {
      inner = (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: el.fontSize! * 0.3,
            padding: `${el.height * 0.15}px ${el.height * 0.3}px`,
            backgroundColor: el.bgColor,
            borderRadius: el.borderRadius,
          }}
        >
          {el.priceOld && (
            <span
              style={{
                textDecoration: 'line-through',
                color: '#6b7280',
                fontSize: el.fontSize! * 0.55,
                fontWeight: 700,
              }}
            >
              ${el.priceOld}
            </span>
          )}
          <span
            style={{
              color: el.color,
              fontSize: el.fontSize,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ${el.priceValue}
          </span>
        </div>
      );
    } else if (el.kind === 'image') {
      inner = (
        <img
          src={el.src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            display: 'block',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      );
    } else if (el.kind === 'shape') {
      if (el.shapeKind === 'circle') {
        inner = (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: el.fillColor,
            }}
          />
        );
      } else if (el.shapeKind === 'star') {
        inner = (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ display: 'block' }}
          >
            <polygon
              points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
              fill={el.fillColor}
            />
          </svg>
        );
      } else {
        inner = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: el.fillColor,
              borderRadius: 12,
            }}
          />
        );
      }
    }

    return (
      <div
        key={el.id}
        style={baseStyle}
        onMouseDown={(e) => onMouseDownEl(e, el.id)}
      >
        {inner}
        {/* Handle de resize */}
        {showEditorSelection && (
          <div
            onMouseDown={(e) => onMouseDownResize(e, el.id)}
            style={{
              position: 'absolute',
              bottom: -6 / scale,
              right: -6 / scale,
              width: 12 / scale,
              height: 12 / scale,
              backgroundColor: '#3b82f6',
              borderRadius: 2 / scale,
              cursor: 'se-resize',
              zIndex: 9999,
            }}
          />
        )}
      </div>
    );
  };

  // ── Background style ──────────────────────────────────────────────────────────
  const bgStyle: React.CSSProperties = {
    width: canvasW,
    height: canvasH,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: bgKind === 'color' ? bgColor : undefined,
    backgroundImage:
      bgKind === 'gradient'
        ? bgGradient
        : bgKind === 'image' && bgImage
          ? `url(${bgImage})`
          : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    userSelect: 'none',
  };

  // ── Export ────────────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);
    try {
      // Espera a que React aplique el estado para ocultar UI de edición antes de capturar.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        width: canvasW,
        height: canvasH,
      });
      const link = document.createElement('a');
      const storeSlug = (tienda?.nombre || 'tienda')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      link.download = `banner-libre-${storeSlug}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al exportar.');
    } finally {
      setIsExporting(false);
    }
  }, [canvasRef, canvasW, canvasH, tienda?.nombre]);

  // ── Panel de propiedades del elemento seleccionado ────────────────────────────
  const renderPropsPanel = () => {
    if (!selected) {
      return (
        <div className="text-center text-slate-300 text-xs py-12">
          <Move size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">Seleccioná un elemento</p>
          <p className="mt-1 opacity-60">para ver sus propiedades</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {selected.kind === 'text'
              ? 'Texto'
              : selected.kind === 'price'
                ? 'Precio'
                : selected.kind === 'badge'
                  ? 'Badge'
                  : selected.kind === 'image'
                    ? 'Imagen'
                    : 'Forma'}
          </span>
          <button
            onClick={() => deleteEl(selected.id)}
            className="p-1.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Posición */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">X</label>
            <input
              type="number"
              value={selected.x}
              onChange={(e) => updateEl(selected.id, { x: +e.target.value })}
              className="w-full bg-slate-50 rounded-xl p-2 text-xs font-mono outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Y</label>
            <input
              type="number"
              value={selected.y}
              onChange={(e) => updateEl(selected.id, { y: +e.target.value })}
              className="w-full bg-slate-50 rounded-xl p-2 text-xs font-mono outline-none"
            />
          </div>
        </div>

        {/* Ancho */}
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ancho (px)</label>
          <input
            type="number"
            value={selected.width}
            onChange={(e) => updateEl(selected.id, { width: +e.target.value })}
            className="w-full bg-slate-50 rounded-xl p-2 text-xs font-mono outline-none"
          />
        </div>

        {/* Texto / Badge */}
        {(selected.kind === 'text' || selected.kind === 'badge') && (
          <>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contenido</label>
              <textarea
                value={selected.content}
                onChange={(e) => updateEl(selected.id, { content: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 rounded-xl p-2 text-xs outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tamaño fuente</label>
              <input
                type="range"
                min={12}
                max={200}
                value={selected.fontSize}
                onChange={(e) => updateEl(selected.id, { fontSize: +e.target.value })}
                className="w-full"
              />
              <span className="text-[10px] text-slate-400">{selected.fontSize}px</span>
            </div>
            {selected.kind === 'text' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateEl(selected.id, { fontWeight: selected.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`p-2 rounded-xl transition-all ${selected.fontWeight === 'bold' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  <Bold size={14} />
                </button>
                <button
                  onClick={() => updateEl(selected.id, { fontStyle: selected.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`p-2 rounded-xl transition-all ${selected.fontStyle === 'italic' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  <Italic size={14} />
                </button>
                <button onClick={() => updateEl(selected.id, { textAlign: 'left' })} className={`p-2 rounded-xl ${selected.textAlign === 'left' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}><AlignLeft size={14} /></button>
                <button onClick={() => updateEl(selected.id, { textAlign: 'center' })} className={`p-2 rounded-xl ${selected.textAlign === 'center' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}><AlignCenter size={14} /></button>
                <button onClick={() => updateEl(selected.id, { textAlign: 'right' })} className={`p-2 rounded-xl ${selected.textAlign === 'right' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}><AlignRight size={14} /></button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Color texto</span>
              <input type="color" value={selected.color} onChange={(e) => updateEl(selected.id, { color: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
            </div>
            {selected.kind === 'badge' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Color fondo</span>
                  <input type="color" value={selected.bgColor} onChange={(e) => updateEl(selected.id, { bgColor: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Radio borde</label>
                  <input type="range" min={0} max={9999} value={selected.borderRadius} onChange={(e) => updateEl(selected.id, { borderRadius: +e.target.value })} className="w-full" />
                </div>
              </>
            )}
          </>
        )}

        {/* Price */}
        {selected.kind === 'price' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Precio oferta</label>
                <input type="text" value={selected.priceValue} onChange={(e) => updateEl(selected.id, { priceValue: e.target.value })} className="w-full bg-slate-50 rounded-xl p-2 text-xs font-mono outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Precio tachado</label>
                <input type="text" value={selected.priceOld} onChange={(e) => updateEl(selected.id, { priceOld: e.target.value })} className="w-full bg-slate-50 rounded-xl p-2 text-xs font-mono outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Tamaño fuente</label>
              <input type="range" min={20} max={160} value={selected.fontSize} onChange={(e) => updateEl(selected.id, { fontSize: +e.target.value })} className="w-full" />
              <span className="text-[10px] text-slate-400">{selected.fontSize}px</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Color texto</span>
              <input type="color" value={selected.color} onChange={(e) => updateEl(selected.id, { color: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Color fondo</span>
              <input type="color" value={selected.bgColor} onChange={(e) => updateEl(selected.id, { bgColor: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Radio borde</label>
              <input type="range" min={0} max={48} value={selected.borderRadius} onChange={(e) => updateEl(selected.id, { borderRadius: +e.target.value })} className="w-full" />
            </div>
          </>
        )}

        {/* Shape */}
        {selected.kind === 'shape' && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Color relleno</span>
            <input type="color" value={selected.fillColor} onChange={(e) => updateEl(selected.id, { fillColor: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
          </div>
        )}

        {/* Image replace */}
        {selected.kind === 'image' && (
          <button
            onClick={() => imgInputRef.current?.click()}
            className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold border border-dashed border-slate-200 hover:bg-slate-100 transition-all"
          >
            Cambiar imagen
          </button>
        )}

        {/* Capas */}
        <div className="border-t border-slate-100 pt-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Capas</label>
          <div className="flex gap-2">
            <button onClick={() => bringForward(selected.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
              <Plus size={12} /> Al frente
            </button>
            <button onClick={() => sendBackward(selected.id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
              <Minus size={12} /> Atrás
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ── Sidebar izquierdo ── */}
      <div className="lg:col-span-3 space-y-4 sticky top-6">
        {/* Formato */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
            Formato
          </label>
          <div className="space-y-1">
            {CANVAS_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPreset(i)}
                className={`w-full text-left px-3 py-2 rounded-2xl text-xs font-bold transition-all ${preset === i ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {p.label} — {p.w}×{p.h}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar tabs */}
        <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm flex gap-1">
          {(
            [
              { key: 'fondo', icon: <Palette size={13} />, label: 'Fondo' },
              { key: 'elementos', icon: <Type size={13} />, label: 'Elementos' },
              { key: 'stickers', icon: <ImageIcon size={13} />, label: 'Stickers' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSideTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-2xl text-[10px] font-bold transition-all ${sideTab === tab.key ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          {/* TAB FONDO */}
          {sideTab === 'fondo' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                  Tipo de fondo
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['color', 'gradient', 'image'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setBgKind(k)}
                      className={`py-2 rounded-2xl text-[10px] font-bold transition-all ${bgKind === k ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}
                    >
                      {k === 'color' ? 'Color' : k === 'gradient' ? 'Degradé' : 'Imagen'}
                    </button>
                  ))}
                </div>
              </div>
              {bgKind === 'color' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Color</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                </div>
              )}
              {bgKind === 'gradient' && (
                <div className="grid grid-cols-3 gap-2">
                  {BG_GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setBgGradient(g)}
                      className={`h-12 rounded-2xl border-2 transition-all ${bgGradient === g ? 'border-slate-900' : 'border-transparent'}`}
                      style={{ backgroundImage: g }}
                    />
                  ))}
                </div>
              )}
              {bgKind === 'image' && (
                <>
                  <button
                    onClick={() => bgImageInputRef.current?.click()}
                    className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold border border-dashed border-slate-200 hover:bg-slate-100 transition-all"
                  >
                    {bgImage ? 'Cambiar imagen de fondo' : '+ Subir imagen de fondo'}
                  </button>
                  <input type="file" ref={bgImageInputRef} className="hidden" accept="image/*" onChange={onBgImageChange} />
                </>
              )}
            </div>
          )}

          {/* TAB ELEMENTOS */}
          {sideTab === 'elementos' && (
            <div className="space-y-3 animate-in fade-in">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Agregar elementos
              </label>
              {[
                { label: 'Texto', icon: <Type size={16} />, action: addText },
                { label: 'Precio', icon: <span className="text-sm font-black">$</span>, action: addPrice },
                { label: 'Badge / CTA', icon: <span className="text-xs font-black">★</span>, action: addBadge },
                { label: 'Foto de producto', icon: <ImageIcon size={16} />, action: addImage },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-700 transition-all"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Formas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rect', 'circle', 'star'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => addShape(s)}
                      className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-lg transition-all flex items-center justify-center"
                    >
                      {s === 'rect' ? '▬' : s === 'circle' ? '●' : '★'}
                    </button>
                  ))}
                </div>
              </div>
              <input type="file" ref={imgInputRef} className="hidden" accept="image/*" onChange={onImageFileChange} />
            </div>
          )}

          {/* TAB STICKERS */}
          {sideTab === 'stickers' && (
            <div className="animate-in fade-in">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                Decorativos
              </label>
              <div className="grid grid-cols-4 gap-2">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => addSticker(s)}
                    className="h-12 text-2xl rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Canvas central ── */}
      <div className="lg:col-span-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Editor Libre
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedId && (
              <button
                onClick={() => { deleteEl(selectedId); }}
                className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all"
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${exportSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {isExporting ? '...' : exportSuccess ? <CheckCircle2 size={15} /> : <Download size={15} />}
              {isExporting ? 'Exportando' : exportSuccess ? '¡Listo!' : 'Descargar'}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerCallbackRef}
          className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200"
          style={{ position: 'relative' }}
        >
          <div
            style={{
              width: '100%',
              paddingBottom: `${(canvasH / canvasW) * 100}%`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
                width: canvasW,
                height: canvasH,
              }}
            >
              <div
                ref={canvasRef}
                style={bgStyle}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onClick={(e) => {
                  if (e.target === canvasRef.current) setSelectedId(null);
                }}
              >
                {[...elements].sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
              </div>
            </div>
          </div>
        </div>

        {/* Capa info */}
        {elements.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Capas ({elements.length})
              </span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {[...elements].reverse().map((el) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${selectedId === el.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <span className="opacity-50 text-[10px]">z:{el.zIndex}</span>
                  <span className="truncate">
                    {el.kind === 'text' || el.kind === 'badge'
                      ? el.content?.slice(0, 24) || el.kind
                      : el.kind === 'price'
                        ? `$${el.priceValue}`
                        : el.kind === 'image'
                          ? 'Imagen'
                          : `Forma (${el.shapeKind})`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Panel de propiedades ── */}
      <div className="lg:col-span-3 sticky top-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
            Propiedades
          </label>
          {renderPropsPanel()}
        </div>
      </div>
    </div>
  );
}