import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { TiendaData } from '../../../templates/types';

export interface ThemeFormValues {
  colorAcento: string;
  modoOscuro: boolean;
  navbarStyle: 'STICKY' | 'TRANSPARENT' | 'FLOATING';
  heroCtaTexto: string;
  heroTitulo: string;
  heroSubtitulo: string;
  seccionesVisibles: Record<string, boolean>;
  cardMostrarPrecio: boolean;
  cardMostrarBadge: boolean;
}

export const DEFAULT_SECTION_VISIBILITY = {
  hero: true,
  footer: true,
  navbar: true,
  galeria: true,
  productos: true,
  contacto: true,
} as const;

export interface ShopEditorData extends TiendaData {
  temaConfig?: ThemeFormValues;
}

export const getInitialThemeValues = (tienda?: ShopEditorData): ThemeFormValues => ({
  colorAcento: tienda?.temaConfig?.colorAcento || '#3B82F6',
  modoOscuro: tienda?.temaConfig?.modoOscuro ?? true,
  navbarStyle: tienda?.temaConfig?.navbarStyle || 'TRANSPARENT',
  heroCtaTexto: tienda?.temaConfig?.heroCtaTexto || 'Comprar ahora',
  heroTitulo: tienda?.temaConfig?.heroTitulo || tienda?.titulo || '',
  heroSubtitulo: tienda?.temaConfig?.heroSubtitulo || tienda?.descripcion || '',
  seccionesVisibles: tienda?.temaConfig?.seccionesVisibles || DEFAULT_SECTION_VISIBILITY,
  cardMostrarPrecio: tienda?.temaConfig?.cardMostrarPrecio ?? true,
  cardMostrarBadge: tienda?.temaConfig?.cardMostrarBadge ?? true,
});

export const getInitialTiendaData = (tienda?: ShopEditorData): TiendaData => ({
  titulo: tienda?.titulo ?? '',
  descripcion: tienda?.descripcion ?? '',
  carrusel: tienda?.carrusel ?? [],
});

interface IdentitySectionProps {
  data: TiendaData;
  onChange: (patch: Partial<TiendaData>) => void;
}

export const IdentitySection = ({ data, onChange }: IdentitySectionProps) => (
  <div>
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Identidad</h2>
      <p className="text-xs text-gray-400 mt-1">El nombre e información principal de tu tienda.</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-6 px-6 py-5">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la tienda</label>
          <input
            type="text"
            className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors"
            placeholder="Ej. Mi Tienda"
            value={data.titulo}
            onChange={(e) => onChange({ titulo: e.target.value })}
          />
        </div>
      </div>
      <div className="px-6 py-5">
        <label className="block text-xs font-medium text-gray-500 mb-1">Subtítulo / descripción</label>
        <textarea
          rows={2}
          className="w-full text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-300 border-b border-transparent focus:border-gray-200 pb-0.5 transition-colors resize-none"
          placeholder="Una frase que describa tu tienda…"
          value={data.descripcion}
          onChange={(e) => onChange({ descripcion: e.target.value })}
        />
      </div>
    </div>
  </div>
);

interface AppearanceSectionProps {
  register: UseFormRegister<ThemeFormValues>;
  temaData: ThemeFormValues;
  setValue: UseFormSetValue<ThemeFormValues>;
}

export const AppearanceSection = ({ register, temaData, setValue }: AppearanceSectionProps) => (
  <div>
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Apariencia</h2>
      <p className="text-xs text-gray-400 mt-1">Define los colores, el estilo de navegación y el modo visual.</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Color de acento</p>
          <p className="text-xs text-gray-400 mt-0.5">Botones y elementos destacados</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-black/10 cursor-pointer"
            style={{ backgroundColor: temaData.colorAcento }}
          />
          <input
            type="color"
            className="sr-only"
            id="accent-color"
            value={temaData.colorAcento}
            onChange={(e) => setValue('colorAcento', e.target.value)}
          />
          <label
            htmlFor="accent-color"
            className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
          >
            {temaData.colorAcento?.toUpperCase()}
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Modo oscuro</p>
          <p className="text-xs text-gray-400 mt-0.5">Fondo oscuro en la plantilla</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('modoOscuro')} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
        </label>
      </div>

      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Estilo del menú</p>
          <p className="text-xs text-gray-400 mt-0.5">Cómo se comporta la barra de navegación</p>
        </div>
        <select
          {...register('navbarStyle')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 cursor-pointer"
        >
          <option value="STICKY">Fijo</option>
          <option value="TRANSPARENT">Transparente</option>
          <option value="FLOATING">Flotante</option>
        </select>
      </div>

      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Texto del botón principal</p>
          <p className="text-xs text-gray-400 mt-0.5">El call-to-action del hero</p>
        </div>
        <input
          {...register('heroCtaTexto')}
          type="text"
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 w-36 text-gray-700"
          placeholder="Explorar"
        />
      </div>
    </div>
  </div>
);

interface VisibilitySectionProps {
  temaData: ThemeFormValues;
  setValue: UseFormSetValue<ThemeFormValues>;
}

const VISIBLE_SECTION_OPTIONS = [
  { key: 'hero', label: 'Hero', desc: 'Banner de entrada con imagen y título' },
  { key: 'navbar', label: 'Navegación', desc: 'Menú superior y logo' },
  { key: 'productos', label: 'Productos', desc: 'Grilla de productos a la venta' },
  { key: 'galeria', label: 'Galería', desc: 'Muestra tus imágenes' },
  { key: 'contacto', label: 'Contacto', desc: 'Formulario o info de contacto' },
  { key: 'footer', label: 'Footer', desc: 'Pie de página' },
] as const;

export const VisibilitySection = ({ temaData, setValue }: VisibilitySectionProps) => (
  <div>
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Visibilidad de secciones</h2>
      <p className="text-xs text-gray-400 mt-1">Activa o desactiva las secciones de tu sitio.</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      {VISIBLE_SECTION_OPTIONS.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center gap-4 px-6 py-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={temaData.seccionesVisibles?.[key] ?? true}
              onChange={(e) =>
                setValue('seccionesVisibles', {
                  ...temaData.seccionesVisibles,
                  [key]: e.target.checked,
                })
              }
            />
            <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
          </label>
        </div>
      ))}
    </div>
  </div>
);

interface ProductCardSettingsSectionProps {
  register: UseFormRegister<ThemeFormValues>;
}

export const ProductCardSettingsSection = ({ register }: ProductCardSettingsSectionProps) => (
  <div>
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Tarjetas de Producto</h2>
      <p className="text-xs text-gray-400 mt-1">Configura qué info se muestra en cada producto.</p>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Mostrar precio</p>
          <p className="text-xs text-gray-400">Visible sobre la imagen del producto</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('cardMostrarPrecio')} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
        </label>
      </div>
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Mostrar etiquetas</p>
          <p className="text-xs text-gray-400">Badges de categoría o estado</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('cardMostrarBadge')} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
        </label>
      </div>
    </div>
  </div>
);
