import { useState, useEffect, useRef } from 'react';
import { Megaphone, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMyShop, useUpdateShopVisual } from '../hooks/useShop';
import { postBannerPromoImagenFn } from '../api/shop.api';

interface Props { accent: string; }

export default function BannerPromoSection({ accent }: Props) {
  const { data: tienda } = useMyShop();
  const updateVisual = useUpdateShopVisual();
  const fileRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  const [form, setForm] = useState({
    bannerPromoActivo: false,
    bannerPromoTitulo: '',
    bannerPromoSubtitulo: '',
    bannerPromoCtaTexto: '',
    bannerPromoLinkUrl: '',
    bannerPromoImagenUrl: '',
  });

  useEffect(() => {
    if (!tienda?.temaConfig) return;
    const t: any = tienda.temaConfig;
    setForm({
      bannerPromoActivo: t.bannerPromoActivo ?? false,
      bannerPromoTitulo: t.bannerPromoTitulo ?? '',
      bannerPromoSubtitulo: t.bannerPromoSubtitulo ?? '',
      bannerPromoCtaTexto: t.bannerPromoCtaTexto ?? '',
      bannerPromoLinkUrl: t.bannerPromoLinkUrl ?? '',
      bannerPromoImagenUrl: t.bannerPromoImagenUrl ?? '',
    });
  }, [tienda?.temaConfig]);

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const guardar = () => {
    updateVisual.mutate({
      bannerPromoActivo: form.bannerPromoActivo,
      bannerPromoTitulo: form.bannerPromoTitulo || null,
      bannerPromoSubtitulo: form.bannerPromoSubtitulo || null,
      bannerPromoCtaTexto: form.bannerPromoCtaTexto || null,
      bannerPromoLinkUrl: form.bannerPromoLinkUrl || null,
    } as any);
  };

  const subirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const { bannerPromoImagenUrl } = await postBannerPromoImagenFn(file);
      set('bannerPromoImagenUrl', bannerPromoImagenUrl);
      toast.success('Imagen del banner subida');
    } catch {
      toast.error('No se pudo subir la imagen');
    } finally {
      setSubiendo(false);
    }
  };

  const quitarImagen = () => {
    updateVisual.mutate({ bannerPromoImagenUrl: null } as any);
    set('bannerPromoImagenUrl', '');
  };

  const input = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 transition-colors';
  const label = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6" style={{ color: accent }} /> Banner promocional
        </h1>
        <p className="text-sm text-slate-500">Aparece en tu tienda entre los productos destacados y el catálogo. Ideal para ofertas o anuncios.</p>
      </div>

      {/* Toggle activar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800 text-sm">Mostrar banner en la tienda</p>
          <p className="text-xs text-slate-400">Activalo cuando quieras que se vea</p>
        </div>
        <button
          onClick={() => set('bannerPromoActivo', !form.bannerPromoActivo)}
          className="relative w-12 h-7 rounded-full transition-colors cursor-pointer border-none"
          style={{ background: form.bannerPromoActivo ? accent : '#cbd5e1' }}
        >
          <span className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all" style={{ left: form.bannerPromoActivo ? 26 : 4 }} />
        </button>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className={label}>Vista previa</p>
        <div className="relative overflow-hidden rounded-xl flex items-center" style={{ minHeight: 160, background: form.bannerPromoImagenUrl ? '#111' : accent }}>
          {form.bannerPromoImagenUrl && (
            <>
              <img src={form.bannerPromoImagenUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)' }} />
            </>
          )}
          <div className="relative z-10 px-6 py-6">
            {form.bannerPromoTitulo && <h3 className="text-white font-bold text-xl">{form.bannerPromoTitulo}</h3>}
            {form.bannerPromoSubtitulo && <p className="text-white/85 text-sm mt-1">{form.bannerPromoSubtitulo}</p>}
            {form.bannerPromoCtaTexto && <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-white text-xs font-bold" style={{ color: accent }}>{form.bannerPromoCtaTexto}</span>}
            {!form.bannerPromoTitulo && !form.bannerPromoSubtitulo && <p className="text-white/70 text-sm">Tu banner se verá así</p>}
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        {/* Imagen */}
        <div>
          <label className={label}>Imagen de fondo (opcional)</label>
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} disabled={subiendo} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 disabled:opacity-50">
              <Upload className="w-4 h-4" /> {subiendo ? 'Subiendo...' : form.bannerPromoImagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {form.bannerPromoImagenUrl && (
              <button onClick={quitarImagen} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold cursor-pointer hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Quitar
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={subirImagen} />
          <p className="text-[11px] text-slate-400 mt-1">Recomendado: imagen apaisada (ej. 1200×400 px). Si no subís imagen, se usa el color de acento.</p>
        </div>

        <div>
          <label className={label}>Título</label>
          <input className={input} value={form.bannerPromoTitulo} onChange={(e) => set('bannerPromoTitulo', e.target.value)} placeholder="¡20% OFF en toda la tienda!" />
        </div>
        <div>
          <label className={label}>Subtítulo</label>
          <input className={input} value={form.bannerPromoSubtitulo} onChange={(e) => set('bannerPromoSubtitulo', e.target.value)} placeholder="Solo por tiempo limitado" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Texto del botón (opcional)</label>
            <input className={input} value={form.bannerPromoCtaTexto} onChange={(e) => set('bannerPromoCtaTexto', e.target.value)} placeholder="Ver ofertas" />
          </div>
          <div>
            <label className={label}>Link (opcional)</label>
            <input className={input} value={form.bannerPromoLinkUrl} onChange={(e) => set('bannerPromoLinkUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <button onClick={guardar} disabled={updateVisual.isPending} className="w-full py-3 rounded-xl text-white font-bold text-sm cursor-pointer border-none disabled:opacity-50" style={{ background: accent }}>
          {updateVisual.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
