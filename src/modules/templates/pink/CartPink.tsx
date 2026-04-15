import { useState } from 'react';
import type { CartItem } from './types.ts';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
}

const CartPink = ({ items, onClose, onUpdateQty, onRemove, accent, buttonBg, buttonText }: CartProps) => {
  const [showAddress, setShowAddress] = useState(false);
  const subtotal = items.reduce((acc, i) => acc + i.offerPrice * i.qty, 0);
  const tax = +(subtotal * 0.02).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header del carrito */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-black" style={{ color: accent || '#881337' /* rose-900 */ }}>
            Tu carrito{' '}
            <span className="text-sm font-medium" style={{ color: accent || '#fb7185' /* rose-400 */ }}>
              {items.length} items
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-200">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-slate-400 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50">
                <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image1} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: accent || '#fb7185' }}>{item.category}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-base font-black mt-0.5" style={{ color: accent || '#be123c' /* rose-700 */ }}>
                    ${item.offerPrice}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-100 rounded-full overflow-hidden">
                      <button
                        onClick={() => item.qty > 1 ? onUpdateQty(item.id, item.qty - 1) : onRemove(item.id)}
                        className="px-3 py-1 bg-gray-50 transition-colors text-sm font-bold"
                        style={{ color: accent || '#f43f5e' }}
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-semibold text-slate-700">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="px-3 py-1 bg-gray-50 transition-colors text-sm font-bold"
                        style={{ color: accent || '#f43f5e' }}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-gray-500 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen de compra */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Dirección de entrega</p>
              <div className="relative flex justify-between items-center">
                <p className="text-sm text-slate-400">Sin dirección cargada</p>
                <button onClick={() => setShowAddress(!showAddress)} className="text-xs font-semibold hover:underline" style={{ color: accent || '#f43f5e' }}>
                  Cambiar
                </button>
                {/* ... menu direccion ... */}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Método de pago</p>
              <select className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-xl text-sm text-slate-600 outline-none">
                <option value="efectivo">Efectivo al recibir</option>
                <option value="online">Pago online</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
            </div>

            <div className="space-y-1.5 text-sm text-slate-500">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="flex justify-between"><span>Envío</span><span className="text-green-500 font-medium">Gratis</span></div>
              <div className="flex justify-between"><span>IVA (2%)</span><span>${tax}</span></div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-gray-100" style={{ color: accent || '#881337' }}>
                <span>Total</span><span>${total}</span>
              </div>
            </div>

            <button 
              className="w-full py-4 font-bold rounded-full hover:opacity-90 transition-opacity text-sm tracking-wide shadow-lg" 
              style={{ backgroundColor: buttonBg || accent || '#e11d48', color: buttonText || '#ffffff' }}
            >
              Confirmar pedido →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPink;
