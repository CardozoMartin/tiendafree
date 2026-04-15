import { useNavigate } from 'react-router-dom';
import type { Carrito, Tienda } from './Types';

interface OrderDataProps {
  carrito?: Carrito;
  tienda?: Tienda;
}

const OrderData = ({ carrito, tienda }: OrderDataProps) => {
  const navigate = useNavigate();
  const items = carrito?.items || [];
  const subtotal = Number(carrito?.total || 0);
  const ship = subtotal > 8000 ? 0 : 800;
  const total = subtotal + ship;

  const handleFinalizarCompra = () => {
    if (!items.length || !tienda) return;

    let msj = `¡Hola! Quiero confirmar mi pedido:\n\n`;
    items.forEach((item) => {
      msj += `- ${item.cantidad}x ${item.producto?.nombre} ($${(Number(item.precioUnit) * item.cantidad).toLocaleString()})\n`;
    });
    msj += `\nSubtotal: $${subtotal.toLocaleString()}`;
    msj += `\nEnvío: $${ship === 0 ? 'Gratis' : ship.toLocaleString()}`;
    msj += `\n*TOTAL: $${total.toLocaleString()}*\n\n`;
    msj += `Espero confirmación. ¡Muchas gracias!`;

    const numeroStr = tienda?.whatsapp?.toString().replace(/\D/g, '') || '5493812345678';
    window.open(`https://wa.me/${numeroStr}?text=${encodeURIComponent(msj)}`, '_blank');

    // Vaciar carrito después de finalizar (opcional, se podría hacer desde el hook)
    // Aquí podrías llamar a una función para limpiar el estado del carrito
    navigate(-1); // Volver atrás
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'var(--gor-bg)' }}>
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[.85rem] font-medium mb-4 p-0 transition-colors duration-200"
            style={{ color: 'var(--gor-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gor-txt)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gor-muted)')}
          >
            <span className="text-xl">←</span> Volver al carrito
          </button>

          <h1
            className="font-bold text-[2.5rem] leading-[1.1]"
            style={{
              fontFamily: "'Playfair Display',serif",
              color: 'var(--gor-txt)',
            }}
          >
            Datos del{' '}
            <span className="italic font-normal" style={{ color: 'var(--gor-acento)' }}>
              Pedido
            </span>
          </h1>
        </div>

        {/* Resumen del pedido */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'var(--gor-surface)',
            border: `1.5px solid var(--gor-border)`,
          }}
        >
          <h2
            className="text-[1.2rem] font-bold mb-6"
            style={{ color: 'var(--gor-txt)', fontFamily: "'Playfair Display',serif" }}
          >
            Resumen del Pedido
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4"
                style={{ borderBottom: `1px solid var(--gor-border)` }}
              >
                {/* Imagen */}
                <div
                  className="w-[80px] h-[80px] rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--gor-surface2)' }}
                >
                  <img
                    src={
                      item.producto?.imagenPrincipalUrl ||
                      item.producto?.imagenes?.[0]?.url ||
                      'https://via.placeholder.com/150'
                    }
                    alt={item.producto?.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p
                    className="text-[.9rem] font-medium"
                    style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {item.producto?.nombre}
                  </p>
                  <p
                    className="text-[.75rem] mt-1"
                    style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Cantidad: {item.cantidad}
                  </p>
                  <p
                    className="text-[.75rem] mt-1"
                    style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Precio unitario: ${Number(item.precioUnit).toLocaleString()}
                  </p>
                  <p
                    className="text-[1.1rem] font-bold mt-2"
                    style={{ color: 'var(--gor-acento)', fontFamily: "'Playfair Display',serif" }}
                  >
                    Subtotal: ${(Number(item.precioUnit) * item.cantidad).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="pt-6 space-y-3" style={{ borderTop: `2px solid var(--gor-border)` }}>
            <div className="flex justify-between items-center">
              <span
                className="text-[.9rem]"
                style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
              >
                Subtotal
              </span>
              <span
                className="text-[1rem] font-semibold"
                style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
              >
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-[.9rem]"
                style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
              >
                Envío
              </span>
              <span
                className="text-[1rem] font-semibold"
                style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
              >
                {ship === 0 ? 'Gratis' : `$${ship.toLocaleString()}`}
              </span>
            </div>
            <div
              className="flex justify-between items-center pt-4"
              style={{ borderTop: `1px solid var(--gor-border)` }}
            >
              <span
                className="text-[1.2rem] font-bold"
                style={{ color: 'var(--gor-txt)', fontFamily: "'Playfair Display',serif" }}
              >
                Total
              </span>
              <span
                className="text-[1.8rem] font-bold"
                style={{ color: 'var(--gor-acento)', fontFamily: "'Playfair Display',serif" }}
              >
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario de datos del cliente */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'var(--gor-surface)',
            border: `1.5px solid var(--gor-border)`,
          }}
        >
          <h2
            className="text-[1.2rem] font-bold mb-6"
            style={{ color: 'var(--gor-txt)', fontFamily: "'Playfair Display',serif" }}
          >
            Datos de Envío
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[.85rem] font-semibold mb-2"
                style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
              >
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl text-[.9rem] outline-none transition-colors duration-300"
                style={{
                  border: `1.5px solid var(--gor-border)`,
                  background: 'var(--gor-bg)',
                  color: 'var(--gor-txt)',
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gor-acento)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--gor-border)')}
              />
            </div>

            <div>
              <label
                className="block text-[.85rem] font-semibold mb-2"
                style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
              >
                Dirección
              </label>
              <input
                type="text"
                placeholder="Calle y número"
                className="w-full px-4 py-3 rounded-xl text-[.9rem] outline-none transition-colors duration-300"
                style={{
                  border: `1.5px solid var(--gor-border)`,
                  background: 'var(--gor-bg)',
                  color: 'var(--gor-txt)',
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gor-acento)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--gor-border)')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[.85rem] font-semibold mb-2"
                  style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
                >
                  Ciudad
                </label>
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="w-full px-4 py-3 rounded-xl text-[.9rem] outline-none transition-colors duration-300"
                  style={{
                    border: `1.5px solid var(--gor-border)`,
                    background: 'var(--gor-bg)',
                    color: 'var(--gor-txt)',
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gor-acento)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--gor-border)')}
                />
              </div>

              <div>
                <label
                  className="block text-[.85rem] font-semibold mb-2"
                  style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
                >
                  Código Postal
                </label>
                <input
                  type="text"
                  placeholder="CP"
                  className="w-full px-4 py-3 rounded-xl text-[.9rem] outline-none transition-colors duration-300"
                  style={{
                    border: `1.5px solid var(--gor-border)`,
                    background: 'var(--gor-bg)',
                    color: 'var(--gor-txt)',
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gor-acento)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--gor-border)')}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[.85rem] font-semibold mb-2"
                style={{ color: 'var(--gor-txt)', fontFamily: "'DM Sans',sans-serif" }}
              >
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="Tu teléfono"
                className="w-full px-4 py-3 rounded-xl text-[.9rem] outline-none transition-colors duration-300"
                style={{
                  border: `1.5px solid var(--gor-border)`,
                  background: 'var(--gor-bg)',
                  color: 'var(--gor-txt)',
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gor-acento)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--gor-border)')}
              />
            </div>
          </div>
        </div>

        {/* Botón de finalizar */}
        <button
          onClick={handleFinalizarCompra}
          disabled={items.length === 0}
          className="w-full py-4 rounded-full text-[1.1rem] font-semibold border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'var(--gor-acento)',
            color: 'var(--gor-btn-txt)',
            fontFamily: "'DM Sans',sans-serif",
            boxShadow: `0 8px 20px var(--gor-acento)30`,
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.opacity = '.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Finalizar Compra por WhatsApp
        </button>

        {/* Nota */}
        <p
          className="text-[.75rem] text-center mt-4"
          style={{ color: 'var(--gor-muted)', fontFamily: "'DM Sans',sans-serif" }}
        >
          Al finalizar, se abrirá WhatsApp con los detalles de tu pedido para confirmar con el
          vendedor.
        </p>
      </div>
    </div>
  );
};

export default OrderData;
