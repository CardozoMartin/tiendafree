import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getCarruselAdminFn,
  postAddShopCarouselImageFn,
  deleteShopCarouselImageFn,
} from '../../api/carrusel.api';
import { putUpdateShopVisualFn } from '../../api/shop.api';
import { comprimirImagen } from '../../utils/comprimirImagen';

// ── Hooks internos ────────────────────────────────────────────────────────────

function useHeroTextos(temaConfig: any) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    heroTitulo:    temaConfig?.heroTitulo    ?? '',
    heroSubtitulo: temaConfig?.heroSubtitulo ?? '',
    heroCtaTexto:  temaConfig?.heroCtaTexto  ?? '',
  });

  // Sincronizar si temaConfig cambia desde afuera
  useEffect(() => {
    setForm({
      heroTitulo:    temaConfig?.heroTitulo    ?? '',
      heroSubtitulo: temaConfig?.heroSubtitulo ?? '',
      heroCtaTexto:  temaConfig?.heroCtaTexto  ?? '',
    });
  }, [temaConfig?.heroTitulo, temaConfig?.heroSubtitulo, temaConfig?.heroCtaTexto]);

  const mutation = useMutation({
    mutationFn: putUpdateShopVisualFn,
    onSuccess: () => {
      toast.success('Hero actualizado');
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: () => toast.error('Error al guardar'),
  });

  return { form, setForm, mutation };
}

function useHeroImagen() {
  const queryClient = useQueryClient();

  const { data: secciones = [] } = useQuery({
    queryKey: ['carrusel-admin'],
    queryFn: getCarruselAdminFn,
  });

  const uploadMutation = useMutation({
    mutationFn: postAddShopCarouselImageFn,
    onSuccess: () => {
      toast.success('Imagen subida');
      queryClient.invalidateQueries({ queryKey: ['carrusel-admin'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: () => toast.error('Error al subir imagen'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShopCarouselImageFn,
    onSuccess: () => {
      toast.success('Imagen eliminada');
      queryClient.invalidateQueries({ queryKey: ['carrusel-admin'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: () => toast.error('Error al eliminar'),
  });

  // La imagen principal del hero es el primer slide activo
  const imagenPrincipal = secciones.find(s => s.activa) ?? secciones[0] ?? null;

  return { secciones, imagenPrincipal, uploadMutation, deleteMutation };
}

// ── Subcomponente: editor de textos del Hero ──────────────────────────────────

function HeroTextosEditor({ temaConfig }: { temaConfig: any }) {
  const { form, setForm, mutation } = useHeroTextos(temaConfig);
  const [dirty, setDirty] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setDirty(true);
  };

  const handleGuardar = () => {
    mutation.mutate(form as any);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {/* Título */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Título principal
          </label>
          <input
            type="text"
            maxLength={200}
            value={form.heroTitulo}
            onChange={e => handleChange('heroTitulo', e.target.value)}
            placeholder="Ej: CapZone"
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 bg-white"
          />
          <p className="text-[10px] text-gray-400 mt-1">Aparece como el título grande en el Hero</p>
        </div>

        {/* Subtítulo */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Subtítulo <span className="text-gray-400 font-normal">(en cursiva)</span>
          </label>
          <input
            type="text"
            maxLength={300}
            value={form.heroSubtitulo}
            onChange={e => handleChange('heroSubtitulo', e.target.value)}
            placeholder="Ej: Gorras y accesorios urbanos"
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 bg-white"
          />
        </div>

        {/* CTA */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Texto del botón
          </label>
          <input
            type="text"
            maxLength={100}
            value={form.heroCtaTexto}
            onChange={e => handleChange('heroCtaTexto', e.target.value)}
            placeholder="Ej: Ver colección"
            className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 bg-white"
          />
        </div>
      </div>

      {dirty && (
        <button
          onClick={handleGuardar}
          disabled={mutation.isPending}
          className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? 'Guardando...' : 'Guardar textos'}
        </button>
      )}
    </div>
  );
}

// ── Subcomponente: imagen circular del Hero ───────────────────────────────────

function HeroImagenEditor() {
  const { secciones, imagenPrincipal, uploadMutation, deleteMutation } = useHeroImagen();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    if (!original) return;

    // Comprimimos automáticamente (redimensiona + baja calidad)
    const file = await comprimirImagen(original);

    // Preview local
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    const fd = new FormData();
    fd.append('carruselImagenes', file);
    fd.append('orden', '0');
    fd.append('tipo', 'HERO_FIJO');
    fd.append('etiqueta', 'Hero principal');
    uploadMutation.mutate(fd, {
      onSuccess: () => setPreview(null),
    });
  };

  const imagenActual = preview || imagenPrincipal?.url || null;

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0 bg-gray-50">
          {imagenActual ? (
            <img src={imagenActual} alt="Hero" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {uploadMutation.isPending && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-xs text-gray-500">Imagen circular del Hero. Recomendado: cuadrada, mínimo 600×600px.</p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:border-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {imagenActual ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {/* Lista de todas las imágenes del hero */}
      {secciones.length > 1 && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Todas las imágenes</p>
          <div className="flex gap-2 flex-wrap">
            {secciones.map(s => (
              <div key={s.id} className="relative group">
                <img
                  src={s.url}
                  alt=""
                  className={`w-14 h-14 rounded-lg object-cover border-2 transition-all ${
                    s.activa ? 'border-gray-800' : 'border-gray-200 opacity-50'
                  }`}
                />
                <button
                  onClick={() => { if (confirm('¿Eliminar esta imagen?')) deleteMutation.mutate(s.id); }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] items-center justify-center hidden group-hover:flex"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal exportado ────────────────────────────────────────────

export default function HeroEditor({ temaConfig }: { temaConfig: any }) {
  return (
    <div className="space-y-6">
      {/* Sección textos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Textos del Hero</p>
            <p className="text-[11px] text-gray-400">Título, subtítulo y botón de acción</p>
          </div>
        </div>
        <HeroTextosEditor temaConfig={temaConfig} />
      </div>

      {/* Sección imagen */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Imagen circular</p>
            <p className="text-[11px] text-gray-400">Aparece a la derecha del texto en el Hero</p>
          </div>
        </div>
        <HeroImagenEditor />
      </div>

      {/* Preview hint */}
      <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 rounded-xl">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-[11px] text-blue-700">
          Los cambios se ven en tiempo real en tu tienda. Para ver el resultado final hacé clic en <strong>Sitio Web</strong>.
        </p>
      </div>
    </div>
  );
}
