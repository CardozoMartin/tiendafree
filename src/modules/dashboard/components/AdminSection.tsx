import { useState } from 'react';
import { MI } from './MaterialIcon';
import {
  useCategorias, useCrearCategoria, useActualizarCategoria, useEliminarCategoria,
  useTags, useCrearTag, useActualizarTag, useEliminarTag,
  useMetodosPagoAdmin, useCrearMetodoPago, useActualizarMetodoPago, useEliminarMetodoPago,
  useMetodosEntregaAdmin, useCrearMetodoEntrega, useActualizarMetodoEntrega, useEliminarMetodoEntrega,
  usePlantillasAdmin, useCrearPlantilla, useActualizarPlantilla, useEliminarPlantilla,
  useUsuariosAdmin, useCambiarRolUsuario, useCambiarActivoUsuario,
  useAdminDashboard,
} from '../hooks/useAdmin';

// ── Helpers ──────────────────────────────────────────────────────────────────

const Input = ({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-slate-400 bg-white placeholder:text-slate-300 transition-colors"
    />
  </div>
);

const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={() => onChange(!value)}
      className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${value ? 'bg-gray-800' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
    <span className="text-sm text-slate-600">{label}</span>
  </label>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="text-center py-10 text-slate-400 text-sm">{label}</div>
);

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
  </div>
);

// ── Tabla genérica ────────────────────────────────────────────────────────────

interface Col { key: string; label: string; render?: (row: any) => React.ReactNode }

const Table = ({ cols, rows, onEdit, onDelete, deletePending }: {
  cols: Col[]; rows: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  deletePending?: boolean;
}) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          {cols.map(c => (
            <th key={c.key} className="text-left px-5 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">{c.label}</th>
          ))}
          {(onEdit || onDelete) && <th className="px-5 py-3" />}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 bg-white">
        {rows.map((row, i) => (
          <tr key={row.id ?? i} className="hover:bg-slate-50/60 transition-colors">
            {cols.map(c => (
              <td key={c.key} className="px-5 py-3.5 text-slate-700">
                {c.render ? c.render(row) : String(row[c.key] ?? '—')}
              </td>
            ))}
            {(onEdit || onDelete) && (
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                      <MI name="edit" className="!text-base" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} disabled={deletePending} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40">
                      <MI name="delete" className="!text-base" />
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Modal genérico ────────────────────────────────────────────────────────────

const Modal = ({ title, onClose, onConfirm, pending, children }: {
  title: string; onClose: () => void; onConfirm: () => void; pending: boolean; children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
          <MI name="close" className="!text-lg" />
        </button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button onClick={onConfirm} disabled={pending}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-colors disabled:opacity-50">
          {pending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color, bg }: { icon: string; label: string; value: number | string; color: string; bg: string }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
    <div className={`size-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
      <MI name={icon} className={`!text-2xl ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// SUB-SECCIONES
// ══════════════════════════════════════════════════════════════════

// ── Overview ─────────────────────────────────────────────────────

const Overview = () => {
  const { data, isLoading } = useAdminDashboard();
  if (isLoading) return <Spinner />;
  const d = data ?? {};
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon="store" label="Tiendas activas" value={d.tiendasActivas ?? 0} color="text-violet-600" bg="bg-violet-50" />
      <StatCard icon="group" label="Usuarios" value={d.totalUsuarios ?? 0} color="text-blue-600" bg="bg-blue-50" />
      <StatCard icon="inventory_2" label="Productos" value={d.totalProductos ?? 0} color="text-emerald-600" bg="bg-emerald-50" />
      <StatCard icon="receipt_long" label="Pedidos totales" value={d.totalPedidos ?? 0} color="text-amber-600" bg="bg-amber-50" />
    </div>
  );
};

// ── Categorías ───────────────────────────────────────────────────

const Categorias = () => {
  const { data = [], isLoading } = useCategorias();
  const crear = useCrearCategoria();
  const actualizar = useActualizarCategoria();
  const eliminar = useEliminarCategoria();

  const [modal, setModal] = useState<{ mode: 'crear' | 'editar'; row?: any } | null>(null);
  const [nombre, setNombre] = useState('');
  const [activa, setActiva] = useState(true);

  const openCrear = () => { setNombre(''); setActiva(true); setModal({ mode: 'crear' }); };
  const openEditar = (row: any) => { setNombre(row.nombre); setActiva(row.activa ?? true); setModal({ mode: 'editar', row }); };
  const close = () => setModal(null);

  const confirm = () => {
    if (!nombre.trim()) return;
    if (modal?.mode === 'crear') {
      crear.mutate({ nombre, activa }, { onSuccess: close });
    } else {
      actualizar.mutate({ id: modal!.row.id, body: { nombre, activa } }, { onSuccess: close });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCrear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          <MI name="add" className="!text-base" /> Nueva categoría
        </button>
      </div>
      {data.length === 0 ? <EmptyState label="No hay categorías" /> : (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'activa', label: 'Estado', render: r => (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.activa ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {r.activa ? 'Activa' : 'Inactiva'}
              </span>
            )},
          ]}
          rows={data}
          onEdit={openEditar}
          onDelete={r => eliminar.mutate(r.id)}
          deletePending={eliminar.isPending}
        />
      )}
      {modal && (
        <Modal
          title={modal.mode === 'crear' ? 'Nueva categoría' : 'Editar categoría'}
          onClose={close} onConfirm={confirm}
          pending={crear.isPending || actualizar.isPending}
        >
          <Input label="Nombre" value={nombre} onChange={setNombre} placeholder="Ej: Ropa" />
          <Toggle value={activa} onChange={setActiva} label="Activa" />
        </Modal>
      )}
    </div>
  );
};

// ── Tags ─────────────────────────────────────────────────────────

const Tags = () => {
  const { data = [], isLoading } = useTags();
  const crear = useCrearTag();
  const actualizar = useActualizarTag();
  const eliminar = useEliminarTag();

  const [modal, setModal] = useState<{ mode: 'crear' | 'editar'; row?: any } | null>(null);
  const [nombre, setNombre] = useState('');

  const openCrear = () => { setNombre(''); setModal({ mode: 'crear' }); };
  const openEditar = (row: any) => { setNombre(row.nombre); setModal({ mode: 'editar', row }); };
  const close = () => setModal(null);
  const confirm = () => {
    if (!nombre.trim()) return;
    if (modal?.mode === 'crear') {
      crear.mutate({ nombre }, { onSuccess: close });
    } else {
      actualizar.mutate({ id: modal!.row.id, body: { nombre } }, { onSuccess: close });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCrear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          <MI name="add" className="!text-base" /> Nuevo tag
        </button>
      </div>
      {data.length === 0 ? <EmptyState label="No hay tags" /> : (
        <Table
          cols={[{ key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }]}
          rows={data}
          onEdit={openEditar}
          onDelete={r => eliminar.mutate(r.id)}
          deletePending={eliminar.isPending}
        />
      )}
      {modal && (
        <Modal
          title={modal.mode === 'crear' ? 'Nuevo tag' : 'Editar tag'}
          onClose={close} onConfirm={confirm}
          pending={crear.isPending || actualizar.isPending}
        >
          <Input label="Nombre" value={nombre} onChange={setNombre} placeholder="Ej: Novedad" />
        </Modal>
      )}
    </div>
  );
};

// ── Métodos de Pago ──────────────────────────────────────────────

const MetodosPago = () => {
  const { data = [], isLoading } = useMetodosPagoAdmin();
  const crear = useCrearMetodoPago();
  const actualizar = useActualizarMetodoPago();
  const eliminar = useEliminarMetodoPago();

  const blank = { nombre: '', icono: '', descripcion: '', activo: true, orden: 0 };
  const [modal, setModal] = useState<{ mode: 'crear' | 'editar'; row?: any } | null>(null);
  const [form, setForm] = useState(blank);

  const openCrear = () => { setForm(blank); setModal({ mode: 'crear' }); };
  const openEditar = (row: any) => { setForm({ nombre: row.nombre, icono: row.icono ?? '', descripcion: row.descripcion ?? '', activo: row.activo ?? true, orden: row.orden ?? 0 }); setModal({ mode: 'editar', row }); };
  const close = () => setModal(null);
  const f = (k: keyof typeof form) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const confirm = () => {
    if (!form.nombre.trim()) return;
    const body = { ...form, orden: Number(form.orden) };
    if (modal?.mode === 'crear') {
      crear.mutate(body, { onSuccess: close });
    } else {
      actualizar.mutate({ id: modal!.row.id, body }, { onSuccess: close });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCrear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          <MI name="add" className="!text-base" /> Nuevo método
        </button>
      </div>
      {data.length === 0 ? <EmptyState label="No hay métodos de pago" /> : (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'orden', label: 'Orden' },
            { key: 'activo', label: 'Estado', render: r => (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {r.activo ? 'Activo' : 'Inactivo'}
              </span>
            )},
          ]}
          rows={data}
          onEdit={openEditar}
          onDelete={r => eliminar.mutate(r.id)}
          deletePending={eliminar.isPending}
        />
      )}
      {modal && (
        <Modal
          title={modal.mode === 'crear' ? 'Nuevo método de pago' : 'Editar método de pago'}
          onClose={close} onConfirm={confirm}
          pending={crear.isPending || actualizar.isPending}
        >
          <Input label="Nombre" value={form.nombre} onChange={f('nombre')} placeholder="Ej: Mercado Pago" />
          <Input label="Ícono (nombre Material)" value={form.icono} onChange={f('icono')} placeholder="Ej: qr_code_2" />
          <Input label="Descripción" value={form.descripcion} onChange={f('descripcion')} placeholder="Descripción breve" />
          <Input label="Orden" value={String(form.orden)} onChange={v => f('orden')(Number(v))} type="number" />
          <Toggle value={form.activo} onChange={f('activo')} label="Activo" />
        </Modal>
      )}
    </div>
  );
};

// ── Métodos de Entrega ───────────────────────────────────────────

const MetodosEntrega = () => {
  const { data = [], isLoading } = useMetodosEntregaAdmin();
  const crear = useCrearMetodoEntrega();
  const actualizar = useActualizarMetodoEntrega();
  const eliminar = useEliminarMetodoEntrega();

  const blank = { nombre: '', icono: '', descripcion: '', permiteZona: false, activo: true, orden: 0 };
  const [modal, setModal] = useState<{ mode: 'crear' | 'editar'; row?: any } | null>(null);
  const [form, setForm] = useState(blank);

  const openCrear = () => { setForm(blank); setModal({ mode: 'crear' }); };
  const openEditar = (row: any) => { setForm({ nombre: row.nombre, icono: row.icono ?? '', descripcion: row.descripcion ?? '', permiteZona: row.permiteZona ?? false, activo: row.activo ?? true, orden: row.orden ?? 0 }); setModal({ mode: 'editar', row }); };
  const close = () => setModal(null);
  const f = (k: keyof typeof form) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const confirm = () => {
    if (!form.nombre.trim()) return;
    const body = { ...form, orden: Number(form.orden) };
    if (modal?.mode === 'crear') {
      crear.mutate(body, { onSuccess: close });
    } else {
      actualizar.mutate({ id: modal!.row.id, body }, { onSuccess: close });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCrear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          <MI name="add" className="!text-base" /> Nuevo método
        </button>
      </div>
      {data.length === 0 ? <EmptyState label="No hay métodos de entrega" /> : (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'permiteZona', label: 'Zona', render: r => r.permiteZona ? 'Sí' : 'No' },
            { key: 'activo', label: 'Estado', render: r => (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {r.activo ? 'Activo' : 'Inactivo'}
              </span>
            )},
          ]}
          rows={data}
          onEdit={openEditar}
          onDelete={r => eliminar.mutate(r.id)}
          deletePending={eliminar.isPending}
        />
      )}
      {modal && (
        <Modal
          title={modal.mode === 'crear' ? 'Nuevo método de entrega' : 'Editar método de entrega'}
          onClose={close} onConfirm={confirm}
          pending={crear.isPending || actualizar.isPending}
        >
          <Input label="Nombre" value={form.nombre} onChange={f('nombre')} placeholder="Ej: Correo Argentino" />
          <Input label="Ícono (nombre Material)" value={form.icono} onChange={f('icono')} placeholder="Ej: local_shipping" />
          <Input label="Descripción" value={form.descripcion} onChange={f('descripcion')} placeholder="Descripción breve" />
          <Input label="Orden" value={String(form.orden)} onChange={v => f('orden')(Number(v))} type="number" />
          <Toggle value={form.permiteZona} onChange={f('permiteZona')} label="Permite zona de cobertura" />
          <Toggle value={form.activo} onChange={f('activo')} label="Activo" />
        </Modal>
      )}
    </div>
  );
};

// ── Plantillas ───────────────────────────────────────────────────

const Plantillas = () => {
  const { data = [], isLoading } = usePlantillasAdmin();
  const crear = useCrearPlantilla();
  const actualizar = useActualizarPlantilla();
  const eliminar = useEliminarPlantilla();

  const blank = { nombre: '', descripcion: '', previewUrl: '', sortOrder: 0, activo: true };
  const [modal, setModal] = useState<{ mode: 'crear' | 'editar'; row?: any } | null>(null);
  const [form, setForm] = useState(blank);

  const openCrear = () => { setForm(blank); setModal({ mode: 'crear' }); };
  const openEditar = (row: any) => { setForm({ nombre: row.nombre, descripcion: row.descripcion ?? '', previewUrl: row.previewUrl ?? '', sortOrder: row.sortOrder ?? 0, activo: row.activo ?? true }); setModal({ mode: 'editar', row }); };
  const close = () => setModal(null);
  const f = (k: keyof typeof form) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const confirm = () => {
    if (!form.nombre.trim()) return;
    const body = { ...form, sortOrder: Number(form.sortOrder), previewUrl: form.previewUrl || undefined };
    if (modal?.mode === 'crear') {
      crear.mutate(body, { onSuccess: close });
    } else {
      actualizar.mutate({ id: modal!.row.id, body }, { onSuccess: close });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCrear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          <MI name="add" className="!text-base" /> Nueva plantilla
        </button>
      </div>
      {data.length === 0 ? <EmptyState label="No hay plantillas" /> : (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'sortOrder', label: 'Orden' },
            { key: 'activo', label: 'Estado', render: r => (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {r.activo ? 'Activa' : 'Inactiva'}
              </span>
            )},
          ]}
          rows={data}
          onEdit={openEditar}
          onDelete={r => eliminar.mutate(r.id)}
          deletePending={eliminar.isPending}
        />
      )}
      {modal && (
        <Modal
          title={modal.mode === 'crear' ? 'Nueva plantilla' : 'Editar plantilla'}
          onClose={close} onConfirm={confirm}
          pending={crear.isPending || actualizar.isPending}
        >
          <Input label="Nombre" value={form.nombre} onChange={f('nombre')} placeholder="Ej: Boutique" />
          <Input label="Descripción" value={form.descripcion} onChange={f('descripcion')} placeholder="Descripción de la plantilla" />
          <Input label="URL Preview" value={form.previewUrl} onChange={f('previewUrl')} placeholder="https://..." />
          <Input label="Orden" value={String(form.sortOrder)} onChange={v => f('sortOrder')(Number(v))} type="number" />
          <Toggle value={form.activo} onChange={f('activo')} label="Activa" />
        </Modal>
      )}
    </div>
  );
};

// ── Usuarios ─────────────────────────────────────────────────────

const ROLES = ['OWNER', 'ADMIN', 'CLIENT'];

const Usuarios = () => {
  const [pagina, setPagina] = useState(1);
  const { data, isLoading } = useUsuariosAdmin(pagina, 20);
  const cambiarRol = useCambiarRolUsuario();
  const cambiarActivo = useCambiarActivoUsuario();

  const usuarios: any[] = data?.datos ?? [];
  const total: number = data?.total ?? 0;
  const totalPaginas = Math.ceil(total / 20);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">{total} usuarios en total</p>
      {usuarios.length === 0 ? <EmptyState label="No hay usuarios" /> : (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'email', label: 'Email' },
            { key: 'rol', label: 'Rol', render: r => (
              <select
                value={r.rol}
                onChange={e => cambiarRol.mutate({ id: r.id, rol: e.target.value })}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white"
              >
                {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
              </select>
            )},
            { key: 'activo', label: 'Estado', render: r => (
              <button
                onClick={() => cambiarActivo.mutate({ id: r.id, activo: !r.activo })}
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${r.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {r.activo ? 'Activo' : 'Inactivo'}
              </button>
            )},
          ]}
          rows={usuarios}
        />
      )}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            ← Anterior
          </button>
          <span className="text-xs text-slate-500">{pagina} / {totalPaginas}</span>
          <button disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════

const TABS = [
  { id: 'overview', label: 'Resumen', icon: 'dashboard' },
  { id: 'categorias', label: 'Categorías', icon: 'category' },
  { id: 'tags', label: 'Tags', icon: 'label' },
  { id: 'metodos-pago', label: 'Métodos de pago', icon: 'payments' },
  { id: 'metodos-entrega', label: 'Métodos de envío', icon: 'local_shipping' },
  { id: 'plantillas', label: 'Plantillas', icon: 'palette' },
  { id: 'usuarios', label: 'Usuarios', icon: 'group' },
];

export default function AdminSection({ accent }: { accent: string }) {
  const [tab, setTab] = useState('overview');
  const active = TABS.find(t => t.id === tab)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
          <MI name="admin_panel_settings" className="!text-xl" style={{ color: accent }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Panel Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">Gestión global del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
            style={tab === t.id
              ? { backgroundColor: accent, color: 'white' }
              : { backgroundColor: '#f1f5f9', color: '#64748b' }
            }
          >
            <MI name={t.icon} className="!text-sm" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
          <MI name={active.icon} className="!text-base text-slate-400" />
          {active.label}
        </h2>

        {tab === 'overview' && <Overview />}
        {tab === 'categorias' && <Categorias />}
        {tab === 'tags' && <Tags />}
        {tab === 'metodos-pago' && <MetodosPago />}
        {tab === 'metodos-entrega' && <MetodosEntrega />}
        {tab === 'plantillas' && <Plantillas />}
        {tab === 'usuarios' && <Usuarios />}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
