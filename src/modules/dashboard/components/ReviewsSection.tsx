import { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  CheckCircle2, 
  XSquare, 
  Reply, 
  Package,
  Store,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../api/ApiBase';
import DashboardHelp from './DashboardHelp';

interface Review {
  id: number;
  tiendaId?: number;
  productoId?: number;
  clienteId: number;
  autorNombre: string;
  calificacion: number;
  comentario: string;
  imagenUrl?: string;
  aprobada: boolean;
  creadoEn: string;
  cliente?: {
    nombre: string;
    email: string;
  };
  producto?: {
    nombre: string;
  };
}

interface ReviewsSectionProps {
  accent: string;
  tienda: any;
}

export const ReviewsSection = ({ accent, tienda }: ReviewsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'store' | 'product'>('store');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const tiendaId = tienda?.id || tienda?.datos?.id;

  const fetchReviews = async () => {
    if (!tiendaId) return;
    setLoading(true);
    try {
      const url = activeTab === 'store' 
        ? `/tiendas/${tiendaId}/resenas/pendientes`
        : `/tiendas/${tiendaId}/resenas/productos/pendientes`;
      
      const response = await api.get(url);
      if (response.data.ok) {
        setReviews(response.data.datos);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error al cargar las reseñas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab, tiendaId]);

  const handleApprove = async (id: number) => {
    setActingOn(id);
    try {
      const url = activeTab === 'store'
        ? `/tiendas/${tiendaId}/resenas/${id}/aprobar`
        : `/mis-productos/0/resenas/${id}/aprobar`;
      
      const response = await api.patch(url);
      if (response.data.ok) {
        toast.success("Reseña aprobada");
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      toast.error("Error al aprobar");
    } finally {
      setActingOn(null);
    }
  };

  const handleReject = async (id: number) => {
    setActingOn(id);
    try {
      const url = activeTab === 'store'
        ? `/tiendas/${tiendaId}/resenas/${id}/rechazar`
        : `/mis-productos/0/resenas/${id}/rechazar`;
      
      const response = await api.patch(url);
      if (response.data.ok) {
        toast.success("Reseña rechazada");
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      toast.error("Error al rechazar");
    } finally {
      setActingOn(null);
    }
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;
    setActingOn(id);
    try {
      const url = activeTab === 'store'
        ? `/tiendas/${tiendaId}/resenas/${id}/responder`
        : `/mis-productos/0/resenas/${id}/responder`;
      
      const response = await api.post(url, { respuesta: replyText });
      if (response.data.ok) {
        toast.success("Respuesta enviada");
        setReplyingTo(null);
        setReplyText('');
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      toast.error("Error al responder");
    } finally {
      setActingOn(null);
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star 
          key={s} 
          size={14} 
          className={s <= count ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} 
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Gestión de Reseñas</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Modera las opiniones de tus clientes para mejorar la confianza de tu tienda.
          </p>
        </div>
        <DashboardHelp activeSection="reviews" accent={accent} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100">
        <button
          onClick={() => setActiveTab('store')}
          className={`px-6 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'store' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Store size={16} />
            <span>Tienda</span>
          </div>
          {activeTab === 'store' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`px-6 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'product' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span>Productos</span>
          </div>
          {activeTab === 'product' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
          )}
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm">Buscando reseñas pendientes...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-100 text-zinc-400 space-y-3">
            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <CheckCircle2 size={24} className="text-zinc-300" />
            </div>
            <p className="text-sm font-medium">No hay reseñas pendientes</p>
            <p className="text-xs">¡Todo al día por aquí!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white border border-zinc-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                          <User size={20} className="text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-zinc-900">
                            {review.cliente?.nombre || review.autorNombre}
                          </p>
                          <p className="text-[12px] text-zinc-500">{review.cliente?.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                        {new Date(review.creadoEn).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {renderStars(review.calificacion)}
                      {activeTab === 'product' && review.producto && (
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-600 bg-zinc-100/50 w-fit px-2 py-1 rounded-lg">
                          <Package size={12} />
                          <span>{review.producto.nombre}</span>
                        </div>
                      )}
                      <p className="text-[14px] text-zinc-700 leading-relaxed italic">
                        "{review.comentario}"
                      </p>
                      {review.imagenUrl && (
                        <div className="mt-2">
                            <a href={review.imagenUrl} target="_blank" rel="noreferrer" className="inline-block group relative">
                                <img 
                                    src={review.imagenUrl} 
                                    alt="Imagen de reseña" 
                                    className="max-h-24 sm:max-h-32 rounded-lg object-contain border border-zinc-100 transition-opacity hover:opacity-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                    <ExternalLink size={16} className="text-white" />
                                </div>
                            </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row md:flex-col gap-2 justify-end md:w-32">
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={actingOn === review.id}
                      className="flex-1 md:w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs font-semibold"
                    >
                      {actingOn === review.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                      className="flex-1 md:w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-semibold"
                    >
                      <Reply size={14} />
                      <span>Responder</span>
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      disabled={actingOn === review.id}
                      className="flex-1 md:w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-semibold"
                    >
                      <XSquare size={14} />
                      <span>Rechazar</span>
                    </button>
                  </div>
                </div>

                {/* Reply Section */}
                {replyingTo === review.id && (
                  <div className="mt-4 pt-4 border-t border-zinc-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1">
                    <textarea
                      placeholder="Escribe tu respuesta oficial..."
                      className="w-full text-sm p-3 rounded-xl border border-zinc-100 focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-shadow min-h-[100px]"
                      style={{ '--tw-ring-color': accent } as any}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleReply(review.id)}
                        disabled={actingOn === review.id || !replyText.trim()}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: accent }}
                      >
                        {actingOn === review.id ? <Loader2 size={14} className="animate-spin" /> : <Reply size={14} />}
                        Publicar Respuesta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
