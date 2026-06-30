import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, TrendingUp, ShoppingCart, DollarSign, type LucideIcon } from 'lucide-react';
import { getAnalyticsResumenFn } from '../api/shop.api';

interface Props {
  accent: string;
}

function fmtMoney(v: number) {
  return `$${v.toLocaleString('es-AR')}`;
}

function fmtFechaCorta(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

// ── Gráfico de picos (área + línea) en SVG ──
function LineChart({ data, accent }: { data: { label: string; value: number }[]; accent: string }) {
  const W = 760, H = 220, pad = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? (W - pad * 2) / (data.length - 1) : 0;
  const x = (i: number) => pad + i * stepX;
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1)} ${H - pad} L ${x(0)} ${H - pad} Z`;

  // etiquetas del eje X: mostramos ~6 para no saturar
  const labelEvery = Math.ceil(data.length / 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* líneas guía horizontales */}
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={pad} y1={pad + t * (H - pad * 2)} x2={W - pad} y2={pad + t * (H - pad * 2)} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke={accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* puntos */}
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.value)} r={d.value > 0 ? 3 : 0} fill="#fff" stroke={accent} strokeWidth={2}>
          <title>{`${d.label}: ${d.value}`}</title>
        </circle>
      ))}
      {/* etiquetas X */}
      {data.map((d, i) => (i % labelEvery === 0 ? (
        <text key={i} x={x(i)} y={H - 8} fontSize={10} fill="#9ca3af" textAnchor="middle">{d.label}</text>
      ) : null))}
    </svg>
  );
}

// ── Gráfico de barras ──
function BarChart({ data, accent, money }: { data: { label: string; value: number }[]; accent: string; money?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (data.length === 0) return <p className="text-sm text-gray-400 py-8 text-center">Sin datos en el período</p>;
  return (
    <div className="flex items-end gap-3 h-48 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
          <span className="text-[10px] text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {money ? fmtMoney(d.value) : d.value}
          </span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${(d.value / max) * 100}%`, background: accent, minHeight: d.value > 0 ? 4 : 0 }}
            title={`${d.label}: ${money ? fmtMoney(d.value) : d.value}`}
          />
          <span className="text-[10px] text-gray-400 mt-1.5 text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const RANGOS = [
  { label: '7 días', dias: 7 },
  { label: '30 días', dias: 30 },
  { label: '90 días', dias: 90 },
];

export default function AnalyticsSection({ accent }: Props) {
  const [dias, setDias] = useState(30);
  const [vistaVentas, setVistaVentas] = useState<'semana' | 'mes'>('semana');

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', dias],
    queryFn: () => getAnalyticsResumenFn(dias),
  });

  const visitasData = useMemo(
    () => (data?.visitasPorDia ?? []).map((v) => ({ label: fmtFechaCorta(v.fecha), value: v.cantidad })),
    [data]
  );

  const ventasData = useMemo(() => {
    const arr = vistaVentas === 'semana' ? data?.ventasSemana : data?.ventasMes;
    return (arr ?? []).slice(-8).map((v) => ({ label: v.periodo.replace(/^\d{4}-/, ''), value: v.ingresos }));
  }, [data, vistaVentas]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const t = data?.totales;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
          <p className="text-sm text-gray-500">El rendimiento de tu tienda de un vistazo</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-full p-1">
          {RANGOS.map((r) => (
            <button
              key={r.dias}
              onClick={() => setDias(r.dias)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={dias === r.dias ? { background: accent, color: '#fff' } : { color: '#6b7280' }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de totales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Visitas totales" value={(t?.visitasTotales ?? 0).toLocaleString('es-AR')} accent={accent} icon={Eye} />
        <StatCard label={`Visitas (${dias}d)`} value={(t?.visitasPeriodo ?? 0).toLocaleString('es-AR')} accent={accent} icon={TrendingUp} />
        <StatCard label="Pedidos" value={(t?.pedidos ?? 0).toLocaleString('es-AR')} accent={accent} icon={ShoppingCart} />
        <StatCard label="Ingresos" value={fmtMoney(t?.ingresos ?? 0)} accent={accent} icon={DollarSign} />
      </div>

      {/* Gráfico de visitas (picos) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Visitas por día</h2>
        <p className="text-xs text-gray-400 mb-2">Últimos {dias} días</p>
        {visitasData.every((d) => d.value === 0) ? (
          <p className="text-sm text-gray-400 py-12 text-center">Todavía no hay visitas registradas en este período.</p>
        ) : (
          <LineChart data={visitasData} accent={accent} />
        )}
      </div>

      {/* Ventas semanal/mensual */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Histórico de ventas</h2>
          <div className="flex gap-1 bg-gray-100 rounded-full p-1">
            {(['semana', 'mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVistaVentas(v)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
                style={vistaVentas === v ? { background: accent, color: '#fff' } : { color: '#6b7280' }}
              >
                {v === 'semana' ? 'Semanal' : 'Mensual'}
              </button>
            ))}
          </div>
        </div>
        <BarChart data={ventasData} accent={accent} money />
      </div>

      {/* Productos más vistos */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Productos más vistos</h2>
        {(data?.productosMasVistos ?? []).length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">Aún no hay datos de productos vistos.</p>
        ) : (
          <div className="space-y-2">
            {data!.productosMasVistos.map((p, i) => {
              const max = Math.max(1, data!.productosMasVistos[0].vistas);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.imagenPrincipalUrl && <img src={p.imagenPrincipalUrl} alt={p.nombre} className="w-full h-full object-contain p-0.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{p.nombre}</p>
                    <div className="h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.vistas / max) * 100}%`, background: accent }} />
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-gray-600 whitespace-nowrap">
                    {p.vistas} <Eye className="w-4 h-4 text-gray-400" />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, icon: Icon }: { label: string; value: string; accent: string; icon: LucideIcon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${accent}15` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={2} />
        </span>
      </div>
      <p className="text-xl font-bold" style={{ color: accent }}>{value}</p>
    </div>
  );
}
