import { MI } from './MaterialIcon';
import { STATUS_META } from './constants';

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: '#0042',
    client: 'María González',
    product: 'Torta de chocolate',
    time: 'hace 5 min',
    status: 'new' as const,
    total: 3500,
  },
  {
    id: '#0041',
    client: 'Rodrigo Paz',
    product: 'Alfajores x12',
    time: 'hace 22 min',
    status: 'pending' as const,
    total: 1800,
  },
  {
    id: '#0040',
    client: 'Lucía Torres',
    product: 'Cheesecake frutilla',
    time: 'hace 1 hora',
    status: 'done' as const,
    total: 2800,
  },
];

// ── Badge Component ────────────────────────────────────────────────────────
const Badge = ({ status }: { status: 'new' | 'pending' | 'done' }) => {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${m.bg} ${m.text}`}
    >
      {m.label}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
interface HomeSectionProps {
  accent: string;
}

const HomeSection = ({ accent }: HomeSectionProps) => {
  const stats = [
    {
      icon: 'payments',
      label: 'Ventas hoy',
      value: '$8.500',
      sub: '+12% vs ayer',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: 'visibility',
      label: 'Visitas hoy',
      value: '134',
      sub: '+5 última hora',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: 'shopping_bag',
      label: 'Pedidos',
      value: '7',
      sub: '2 sin responder',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: 'inventory_2',
      label: 'Productos',
      value: '6',
      sub: '1 sin stock',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">Miércoles, 11 de marzo</p>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">¡Hola, Caro! 👋</h1>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-px active:scale-95"
          style={{ backgroundColor: accent, boxShadow: `0 4px 14px ${accent}40` }}
        >
          <MI name="add" className="!text-base" />
          Nuevo producto
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}
            >
              <MI name={s.icon} className="!text-xl" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs font-semibold text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Últimos pedidos</h2>
          <button className="text-xs font-bold" style={{ color: accent }}>
            Ver todos →
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_ORDERS.slice(0, 3).map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="size-9 rounded-xl flex items-center justify-center bg-slate-100 shrink-0">
                <MI name="person" className="text-slate-400 !text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{o.client}</p>
                <p className="text-xs text-slate-400 truncate">
                  {o.product} · {o.time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-slate-800">
                  ${o.total.toLocaleString()}
                </span>
                <Badge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share link card */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
              Tu link de tienda
            </p>
            <p className="text-lg font-black">vitrina.ar/caro-pasteleria</p>
            <p className="text-white/60 text-xs mt-1">Compartilo y empezá a recibir pedidos</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
              <MI name="content_copy" className="!text-base" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
              <MI name="share" className="!text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
