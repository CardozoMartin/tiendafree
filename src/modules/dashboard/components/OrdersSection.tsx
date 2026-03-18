import { useState } from 'react';
import { STATUS_META } from '../constant/constants';
import MI from './MaterialIcon';
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
  {
    id: '#0039',
    client: 'Julián Méndez',
    product: 'Brownie x6',
    time: 'hace 2 horas',
    status: 'done' as const,
    total: 1200,
  },
  {
    id: '#0038',
    client: 'Ana Soria',
    product: 'Macaron surtido',
    time: 'ayer',
    status: 'done' as const,
    total: 2200,
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
const OrdersSection = ({ accent }: { accent: string }) => {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'new', label: 'Nuevos' },
    { id: 'pending', label: 'En camino' },
    { id: 'done', label: 'Entregados' },
  ];
  const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-slate-900">Pedidos</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all"
            style={
              filter === f.id
                ? { backgroundColor: accent, color: 'white' }
                : { backgroundColor: '#f1f5f9', color: '#64748b' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 font-black text-sm">
                  {o.client
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{o.client}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{o.product}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{o.time}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-base font-black text-slate-900">
                  ${o.total.toLocaleString()}
                </span>
                <Badge status={o.status} />
              </div>
            </div>
            {o.status === 'new' && (
              <div className="mt-4 flex gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white hover:bg-green-600 transition-colors">
                  <MI name="check" className="!text-sm" /> Confirmar
                </button>
                <a
                  href="https://wa.me/5491100000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-colors"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MI name="chat" className="!text-sm" /> WhatsApp
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
