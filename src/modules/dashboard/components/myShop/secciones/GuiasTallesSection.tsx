import { useState } from 'react';
import { Plus, Trash2, X, Table2, Pencil } from 'lucide-react';
import {
  useActualizarGuiaTalles,
  useCrearGuiaTalles,
  useEliminarGuiaTalles,
  useGuiasTalles,
} from '../../../hooks/useGuiasTalles';
import type { IGuiaTalles } from '../../../api/guiaTalles.api';

interface Props {
  onVolver: () => void;
}

const inputCls =
  'w-full px-2 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-all';

// Estado editable de una tabla (nueva o existente)
interface Borrador {
  id?: number;
  nombre: string;
  columnas: string[];
  filas: string[][];
  nota: string;
}

const borradorVacio = (): Borrador => ({
  nombre: '',
  columnas: ['Talle', 'Pecho', 'Largo'],
  filas: [
    ['S', '', ''],
    ['M', '', ''],
    ['L', '', ''],
  ],
  nota: '',
});

export default function GuiasTallesSection({ onVolver }: Props) {
  const { data: guias = [], isLoading } = useGuiasTalles();
  const crear = useCrearGuiaTalles();
  const actualizar = useActualizarGuiaTalles();
  const eliminar = useEliminarGuiaTalles();

  const [borrador, setBorrador] = useState<Borrador | null>(null);

  const abrirNueva = () => setBorrador(borradorVacio());
  const abrirEdicion = (g: IGuiaTalles) =>
    setBorrador({
      id: g.id,
      nombre: g.nombre,
      columnas: [...g.columnas],
      filas: g.filas.map((f) => [...f]),
      nota: g.nota ?? '',
    });

  // ── Mutaciones de la grilla en edición ──
  const setCol = (idx: number, val: string) =>
    setBorrador((b) => (b ? { ...b, columnas: b.columnas.map((c, i) => (i === idx ? val : c)) } : b));

  const addCol = () =>
    setBorrador((b) =>
      b ? { ...b, columnas: [...b.columnas, ''], filas: b.filas.map((f) => [...f, '']) } : b
    );

  const removeCol = (idx: number) =>
    setBorrador((b) =>
      b && b.columnas.length > 1
        ? {
            ...b,
            columnas: b.columnas.filter((_, i) => i !== idx),
            filas: b.filas.map((f) => f.filter((_, i) => i !== idx)),
          }
        : b
    );

  const setCelda = (fila: number, col: number, val: string) =>
    setBorrador((b) =>
      b
        ? {
            ...b,
            filas: b.filas.map((f, i) =>
              i === fila ? f.map((c, j) => (j === col ? val : c)) : f
            ),
          }
        : b
    );

  const addFila = () =>
    setBorrador((b) => (b ? { ...b, filas: [...b.filas, b.columnas.map(() => '')] } : b));

  const removeFila = (idx: number) =>
    setBorrador((b) => (b ? { ...b, filas: b.filas.filter((_, i) => i !== idx) } : b));

  const guardar = async () => {
    if (!borrador) return;
    const columnas = borrador.columnas.map((c) => c.trim());
    if (!borrador.nombre.trim() || columnas.some((c) => !c)) return;

    const payload = {
      nombre: borrador.nombre.trim(),
      columnas,
      filas: borrador.filas
        .map((f) => f.map((c) => c.trim()))
        .filter((f) => f.some((c) => c !== '')), // descartar filas vacías
      nota: borrador.nota.trim() || undefined,
    };

    if (borrador.id) {
      await actualizar.mutateAsync({ id: borrador.id, payload });
    } else {
      await crear.mutateAsync(payload);
    }
    setBorrador(null);
  };

  const guardando = crear.isPending || actualizar.isPending;
  const puedeGuardar =
    !!borrador && borrador.nombre.trim().length > 0 && borrador.columnas.every((c) => c.trim());

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Secciones
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-slate-900">Guías de talles</h1>
        </div>
        {!borrador && (
          <button
            onClick={abrirNueva}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nueva tabla
          </button>
        )}
      </div>

      <div className="space-y-6 pb-20">
        {/* ── Editor de grilla ── */}
        {borrador ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">
                {borrador.id ? 'Editar tabla' : 'Nueva tabla'}
              </p>
              <button onClick={() => setBorrador(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la tabla</label>
              <input
                type="text"
                value={borrador.nombre}
                onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })}
                placeholder="Ej. Remeras y buzos"
                className={inputCls}
              />
            </div>

            {/* Grilla */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Medidas</label>
              <div className="overflow-x-auto">
                <table className="border-separate border-spacing-1">
                  <thead>
                    <tr>
                      {borrador.columnas.map((col, ci) => (
                        <th key={ci} className="min-w-[110px]">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={col}
                              onChange={(e) => setCol(ci, e.target.value)}
                              placeholder={`Columna ${ci + 1}`}
                              className={`${inputCls} font-semibold`}
                            />
                            {borrador.columnas.length > 1 && (
                              <button
                                onClick={() => removeCol(ci)}
                                className="text-gray-300 hover:text-red-500 shrink-0"
                                title="Quitar columna"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="align-middle px-1">
                        <button
                          onClick={addCol}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          title="Agregar columna"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrador.filas.map((fila, fi) => (
                      <tr key={fi}>
                        {borrador.columnas.map((_, ci) => (
                          <td key={ci}>
                            <input
                              type="text"
                              value={fila[ci] ?? ''}
                              onChange={(e) => setCelda(fi, ci, e.target.value)}
                              className={inputCls}
                            />
                          </td>
                        ))}
                        <td className="align-middle px-1">
                          <button
                            onClick={() => removeFila(fi)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            title="Quitar fila"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addFila}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar fila
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nota (opcional)</label>
              <input
                type="text"
                value={borrador.nota}
                onChange={(e) => setBorrador({ ...borrador, nota: e.target.value })}
                placeholder="Ej. Medidas en cm. Ante la duda, elegí el talle más grande."
                className={inputCls}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBorrador(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={!puedeGuardar || guardando}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all"
              >
                {guardando ? 'Guardando…' : 'Guardar tabla'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Explicación */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-sm text-blue-900/80 flex gap-3">
              <Table2 className="w-5 h-5 shrink-0 text-blue-500" />
              <p>
                Creá tablas de talles reusables (ej. una para remeras, otra para calzado) y luego
                elegí cuál mostrar en cada producto desde su formulario. El cliente la verá con un
                botón <strong>“Guía de talles”</strong> en la página del producto.
              </p>
            </div>

            {/* Lista de tablas */}
            {isLoading ? (
              <p className="text-sm text-gray-400 py-6 text-center">Cargando…</p>
            ) : guias.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <Table2 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Todavía no creaste ninguna tabla de talles.</p>
                <button
                  onClick={abrirNueva}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Crear la primera
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guias.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{g.nombre}</p>
                        <p className="text-xs text-gray-400">
                          {g.columnas.length} columnas · {g.filas.length} talles
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => abrirEdicion(g)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminar.mutate(g.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Mini-preview */}
                    <div className="overflow-x-auto">
                      <table className="text-xs w-full">
                        <thead>
                          <tr className="text-gray-500">
                            {g.columnas.map((c, i) => (
                              <th key={i} className="text-left font-semibold px-2 py-1 bg-gray-50">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.filas.slice(0, 3).map((f, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              {f.map((cell, j) => (
                                <td key={j} className="px-2 py-1 text-gray-700">
                                  {cell || '—'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {g.filas.length > 3 && (
                        <p className="text-[11px] text-gray-400 mt-1">+{g.filas.length - 3} más</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
