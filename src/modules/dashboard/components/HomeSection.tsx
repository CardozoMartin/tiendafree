import { useMemo } from 'react';
import { MI } from '../components/MaterialIcon';
import { STATUS_META } from '../constant/constants';
import { useOrders } from '../hooks/useOrders';
import { useMisProductos } from '../hooks/useProduct';
import { useMyShop } from '../hooks/useShop';
import { useAuthSessionStore } from '../../../modules/auth/store/useAuthSession';

const Badge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return '¡Buenos días';
  if (h < 19) return '¡Buenas tardes';
  return '¡Buenas noches';
};

const todayLabel = () =>
  new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

interface HomeSectionProps {
  accent: string;
  onNavigate?: (section: string) => void;
}

const HomeSection = ({ accent, onNavigate }: HomeSectionProps) => {
  const { user } = useAuthSessionStore();
  const { data: myShop } = useMyShop();

  const { data: todosRes } = useOrders({ tiendaId: myShop?.id, limite: 5, pagina: 1 });
  const { data: pendientesRes } = useOrders({ tiendaId: myShop?.id, estado: 'PENDIENTE', limite: 50, pagina: 1 });
  const { data: productosRes } = useMisProductos({ limite: 200, pagina: 1 });

  const ultimosPedidos: any[] = todosRes?.datos ?? [];
  const pendientes: number = pendientesRes?.datos?.length ?? 0;
  const totalPedidos: number = todosRes?.paginacion?.total ?? 0;

  const productos: any[] = productosRes?.datos ?? [];
  const totalProductos = productos.length;
  const sinStock = productos.filter((p: any) => p.stock !== null && p.stock !== undefined && p.stock <= 0).length;

  const ventasHoy = useMemo(() => {
    const hoy = new Date().toDateString();
    return ultimosPedidos
      .filter((o: any) => new Date(o.creadoEn).toDateString() === hoy && o.estado !== 'CANCELADO')
      .reduce((sum: number, o: any) => sum + Number(o.total), 0);
  }, [ultimosPedidos]);

  const shopUrl = myShop?.slug ? `${window.location.origin}/tienda/${myShop.slug}` : null;

  const stats = [
    {
      icon: 'payments',
      label: 'Ventas hoy',
      value: `$${ventasHoy.toLocaleString('es-AR')}`,
      sub: ventasHoy === 0 ? 'Sin ventas aún hoy' : 'Pedidos no cancelados',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: 'shopping_bag',
      label: 'Pedidos totales',
      value: String(totalPedidos),
      sub: pendientes > 0 ? `${pendientes} pendiente${pendientes > 1 ? 's' : ''}` : 'Todo al día',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: 'inventory_2',
      label: 'Productos',
      value: String(totalProductos),
      sub: sinStock > 0 ? `${sinStock} sin stock` : 'Todos con stock',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: 'store',
      label: 'Estado tienda',
      value: myShop ? (myShop.activa ? 'Activa' : 'Inactiva') : '—',
      sub: myShop?.nombre ?? 'Sin tienda aún',
      color: myShop?.activa ? 'text-green-600' : 'text-slate-400',
      bg: myShop?.activa ? 'bg-green-50' : 'bg-slate-50',
    },
  ];

  const copyLink = () => {
    if (shopUrl) {
      navigator.clipboard.writeText(shopUrl);
    }
  };

  const nombre = user?.nombre?.split(' ')[0] ?? 'ahí';

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium capitalize">{todayLabel()}</p>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">{greeting()}, {nombre}!</h1>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-px active:scale-95"
            style={{ backgroundColor: accent, boxShadow: `0 4px 14px ${accent}40` }}
          >
            <MI name="add" className="!text-base" />
            Nuevo producto
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <MI name={s.icon} className="!text-xl" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs font-semibold text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Últimos pedidos + Link card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Últimos pedidos */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Últimos pedidos</h2>
            {onNavigate && (
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-bold"
                style={{ color: accent }}
              >
                Ver todos →
              </button>
            )}
          </div>

          {ultimosPedidos.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              Todavía no recibiste ningún pedido.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {ultimosPedidos.map((o: any) => (
                <div
                  key={o.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="size-9 rounded-xl flex items-center justify-center bg-slate-100 shrink-0 text-xs font-black text-slate-400">
                    #{o.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{o.compradorNombre}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {o._count?.items ?? o.items?.length ?? 0} producto(s) · {new Date(o.creadoEn).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-slate-800">
                      ${Number(o.total).toLocaleString('es-AR')}
                    </span>
                    <Badge status={o.estado} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link card */}
        <div
          className="rounded-2xl p-6 text-white flex flex-col justify-between min-h-[180px]"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
              Tu link de tienda
            </p>
            {shopUrl ? (
              <p className="text-base font-black leading-snug break-all">
                {shopUrl.replace('http://', '').replace('https://', '')}
              </p>
            ) : (
              <p className="text-white/60 text-sm">Todavía no tenés una tienda activa</p>
            )}
            <p className="text-white/60 text-xs mt-2">Compartilo y empezá a recibir pedidos</p>
          </div>
          {shopUrl && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={copyLink}
                title="Copiar link"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <MI name="content_copy" className="!text-base" />
              </button>
              <a
                href={shopUrl}
                target="_blank"
                rel="noreferrer"
                title="Abrir tienda"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <MI name="open_in_new" className="!text-base" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {sinStock > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <MI name="warning" className="!text-xl text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              {sinStock} producto{sinStock > 1 ? 's' : ''} sin stock
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Actualizá el stock para seguir vendiendo.</p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 shrink-0"
            >
              Ver productos →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSection;
