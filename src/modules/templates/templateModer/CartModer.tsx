import { useState } from 'react';
import type { CartItem } from './types';

export const CartDrawerModer = ({
  items,
  onClose,
  onUpdateQty,
  onRemove,
  accent = '#c9a96e',
  buttonBg,
  buttonText,
}: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
}) => {
  const [showAddress, setShowAddress] = useState(false);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = +(subtotal * 0.02).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const textMain = '#f5f0e8';
  const textMuted = 'rgba(245,240,232,0.4)';
  const border = 'rgba(245,240,232,0.08)';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl transition-transform duration-500"
        style={{ background: '#0d0d12', borderLeft: `0.5px solid ${border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b" style={{ borderColor: border }}>
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke={accent}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-lg font-light tracking-tight uppercase" style={{ color: textMain, fontFamily: "'Cormorant Garamond', serif" }}>
              Tu Carrito
              {items.length > 0 && (
                <span className="ml-3 text-xs font-medium tracking-widest" style={{ color: accent }}>
                  {items.length} ITEMS
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-60 cursor-pointer"
            style={{ color: textMuted }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="60" height="60" viewBox="0 0 14 14" fill="none" className="opacity-10">
                <path
                  d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                  stroke={accent}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p style={{ color: textMuted, fontSize: '0.85rem' }}>El carrito está vacío</p>
              <button 
                onClick={onClose} 
                className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60 cursor-pointer mt-2" 
                style={{ color: accent, borderBottom: `0.5px solid ${accent}`, paddingBottom: '2px' }}
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: border }}>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-6 group">
                  <div 
                    className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: '#1a1a22', border: `0.5px solid ${border}` }}
                  >
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-light truncate" style={{ color: textMain }}>{item.name}</p>
                      <button onClick={() => onRemove(item.id)} className="transition-colors hover:text-red-400 cursor-pointer" style={{ color: 'rgba(245,240,232,0.15)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: textMuted }}>{item.category}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div 
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: `0.5px solid ${border}`, background: 'rgba(255,255,255,0.02)' }}
                      >
                        <button onClick={() => item.qty > 1 ? onUpdateQty(item.id, item.qty - 1) : onRemove(item.id)} className="p-1 px-2.5 transition-colors hover:bg-white/5 cursor-pointer text-xs" style={{ color: textMuted }}>−</button>
                        <span className="px-3 text-xs font-medium" style={{ color: textMain }}>{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="p-1 px-2.5 transition-colors hover:bg-white/5 cursor-pointer text-xs" style={{ color: textMuted }}>+</button>
                      </div>
                      <span className="text-base font-light" style={{ color: accent, fontFamily: "'Cormorant Garamond', serif" }}>${item.price * item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="px-6 py-6 space-y-5" style={{ background: 'rgba(255,255,255,0.02)', borderTop: `0.5px solid ${border}` }}>
             <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: textMuted }}>Envío</p>
              <div className="flex justify-between items-center text-xs">
                <p style={{ color: 'rgba(245,240,232,0.25)' }}>Calculado al finalizar la compra</p>
                <button onClick={() => setShowAddress(!showAddress)} className="hover:opacity-70 transition-opacity cursor-pointer underline underline-offset-4" style={{ color: accent }}>Cambiar</button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex justify-between text-xs" style={{ color: textMuted }}>
                <span>Subtotal</span>
                <span style={{ color: textMain }}>${subtotal}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: textMuted }}>
                <span>Impuestos (2%)</span>
                <span style={{ color: textMain }}>${tax}</span>
              </div>
              <div className="flex justify-between text-lg font-light pt-4 border-t" style={{ borderColor: border, fontFamily: "'Cormorant Garamond', serif" }}>
                <span style={{ color: textMain }}>Total</span>
                <span style={{ color: accent }}>${total}</span>
              </div>
            </div>

            <button 
              className="w-full py-4 transition-all font-medium text-xs uppercase tracking-widest cursor-pointer hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: buttonBg || accent, color: buttonText || '#0d0d12', borderRadius: '12px' }}
            >
              Finalizar Pedido
            </button>
            <button onClick={onClose} className="w-full py-3 text-[10px] uppercase tracking-widest transition-colors hover:bg-white/5 cursor-pointer" style={{ color: textMuted, borderRadius: '12px', border: `0.5px solid ${border}` }}>
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export const CartToastModer = ({ message, visible }: { message: string; visible: boolean }) => (
  <div
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl transition-all duration-500 z-50 whitespace-nowrap border ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'}`}
    style={{ background: '#0d0d12', color: '#f5f0e8', borderColor: 'rgba(245,240,232,0.1)' }}
  >
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {message}
    </div>
  </div>
);
