import { useEffect, useState } from 'react';
import { FileText, ShieldCheck, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { usePaginaLegal, useGuardarPaginaLegal } from '../hooks/useLegal';
import type { TipoLegal } from '../api/legal.api';

interface Props {
  accent: string;
}

const TABS: { tipo: TipoLegal; label: string; icon: React.ReactNode }[] = [
  { tipo: 'TERMINOS', label: 'Términos y Condiciones', icon: <FileText className="w-4 h-4" /> },
  { tipo: 'CAMBIOS', label: 'Cambios y Devoluciones', icon: <RefreshCw className="w-4 h-4" /> },
  { tipo: 'PRIVACIDAD', label: 'Privacidad', icon: <ShieldCheck className="w-4 h-4" /> },
];

export default function LegalSection({ accent }: Props) {
  const [tipo, setTipo] = useState<TipoLegal>('TERMINOS');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Páginas legales</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Textos legales que tus clientes ven en la tienda. Editables y activables por vos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => {
          const activo = tipo === t.tipo;
          return (
            <button
              key={t.tipo}
              onClick={() => setTipo(t.tipo)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activo ? 'border-transparent text-white' : 'bg-white text-slate-600 border-gray-200 hover:border-gray-400'
              }`}
              style={activo ? { background: accent } : undefined}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Editor de la página activa (remonta al cambiar de tab) */}
      <EditorLegal key={tipo} tipo={tipo} accent={accent} />
    </div>
  );
}

function EditorLegal({ tipo, accent }: { tipo: TipoLegal; accent: string }) {
  const { data: pagina, isLoading } = usePaginaLegal(tipo);
  const guardar = useGuardarPaginaLegal(tipo);

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [activa, setActiva] = useState(true);
  const [cargado, setCargado] = useState(false);

  // Al llegar la data (o plantilla), inicializamos el form una vez
  useEffect(() => {
    if (pagina && !cargado) {
      setTitulo(pagina.titulo);
      setContenido(pagina.contenido);
      setActiva(pagina.activa);
      setCargado(true);
    }
  }, [pagina, cargado]);

  const esPlantilla = pagina?.esPlantilla;
  const sinContenido = !contenido.trim();

  const onGuardar = () => {
    if (sinContenido) return;
    guardar.mutate({ titulo: titulo.trim() || 'Documento legal', contenido, activa });
  };

  if (isLoading || !cargado) {
    return <p className="text-sm text-slate-400 py-8 text-center">Cargando…</p>;
  }

  return (
    <div className="space-y-4">
      {esPlantilla && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800 flex gap-3">
          <FileText className="w-5 h-5 shrink-0 text-amber-500" />
          <p>
            {contenido.trim()
              ? 'Cargamos una plantilla base autocompletada con los datos de tu tienda. Revisala, ajustala a tus políticas y guardá para publicarla.'
              : 'Todavía no tenés esta página. Escribí tu texto y guardá para publicarla en tu tienda.'}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 space-y-4">
        {/* Título + estado */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiva((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              activa ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
            title={activa ? 'Visible en la tienda' : 'Oculta'}
          >
            {activa ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {activa ? 'Visible' : 'Oculta'}
          </button>
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Contenido</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={20}
            placeholder="Escribí el texto legal aquí…"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-gray-900/10 text-slate-800 font-mono leading-relaxed resize-y"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Se muestra respetando los saltos de línea. {contenido.length} caracteres.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onGuardar}
            disabled={sinContenido || guardar.isPending}
            className="px-6 py-2.5 text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-all shadow-sm"
            style={{ background: accent }}
          >
            {guardar.isPending ? 'Guardando…' : 'Guardar y publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
