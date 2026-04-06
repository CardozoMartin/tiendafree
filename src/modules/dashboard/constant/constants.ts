// ── Navigation Items ──────────────────────────────────────────────────────
export interface NavSubItem {
  id: string;
  icon: string;
  label: string;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  submenu?: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'store',
    icon: 'palette',
    label: 'Mi Tienda',
    submenu: [
      { id: 'store-templates', icon: 'image', label: 'Plantillas' },
      { id: 'store-methods', icon: 'payments', label: 'Pagos y Envíos' },
      { id: 'store-edit', icon: 'edit_square', label: 'Editar Página' },
      { id: 'store-website', icon: 'language', label: 'Sitio Web' },
    ],
  },
  { id: 'home', icon: 'home', label: 'Inicio' },
  { id: 'products', icon: 'inventory_2', label: 'Productos' },
  { id: 'orders', icon: 'receipt_long', label: 'Pedidos' },
  { id: 'reviews', icon: 'rate_review', label: 'Reseñas' },
  { id: 'cm-ai', icon: 'auto_awesome', label: 'CM Virtual (IA)' },
  { id: 'banner-creator', icon: 'wallpaper', label: 'Creador Banners' },
  { id: 'settings', icon: 'settings', label: 'Config' },
];

// ── Status Metadata ────────────────────────────────────────────────────────
export const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  PENDIENTE: { label: 'Pendiente', bg: 'bg-amber-100', text: 'text-amber-700' },
  CONFIRMADO: { label: 'Confirmado', bg: 'bg-blue-100', text: 'text-blue-700' },
  EN_CAMINO: { label: 'En camino', bg: 'bg-violet-100', text: 'text-violet-700' },
  ENTREGADO: { label: 'Entregado', bg: 'bg-green-100', text: 'text-green-700' },
  CANCELADO: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-700' },
};

// ── Fonts and Colors ──────────────────────────────────────────────────────
export const FONTS = [
  'Plus Jakarta Sans',
  'Playfair Display',
  'DM Serif Display',
  'Nunito',
  'Bebas Neue',
];
export const ACCENT_COLORS = ['#6344ee', '#e84393', '#f97316', '#16a34a', '#0ea5e9', '#dc2626'];
