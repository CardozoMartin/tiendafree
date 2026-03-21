// ── Navigation Items ──────────────────────────────────────────────────────
export const NAV_ITEMS = [
  {
    id: 'store',
    icon: 'palette',
    label: 'Mi Tienda',
    submenu: [
      { id: 'store-templates', icon: 'image', label: 'Plantillas' },
      { id: 'store-edit', icon: 'edit_square', label: 'Editar Página' },
      { id: 'store-website', icon: 'language', label: 'Sitio Web' },
    ],
  },
  { id: 'home', icon: 'home', label: 'Inicio' },
  { id: 'products', icon: 'inventory_2', label: 'Productos' },
  { id: 'orders', icon: 'receipt_long', label: 'Pedidos' },
  { id: 'settings', icon: 'settings', label: 'Config' },
];

// ── Status Metadata ────────────────────────────────────────────────────────
export const STATUS_META = {
  new: { label: 'Nuevo', bg: 'bg-violet-100', text: 'text-violet-700' },
  pending: { label: 'En camino', bg: 'bg-amber-100', text: 'text-amber-700' },
  done: { label: 'Entregado', bg: 'bg-green-100', text: 'text-green-700' },
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
