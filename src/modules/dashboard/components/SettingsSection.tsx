import MI from "./MaterialIcon";


const SettingsSection = ({ accent }: { accent: string }) => {
  const items = [
    {
      icon: 'person',
      label: 'Datos del negocio',
      sub: 'Nombre, dirección, horarios',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp vinculado',
      sub: '+54 9 11 0000-0000',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: 'qr_code_2',
      label: 'QR de mi tienda',
      sub: 'Descargar e imprimir',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: 'notifications',
      label: 'Notificaciones',
      sub: 'Pedidos, visitas, stock',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: 'help',
      label: 'Ayuda y soporte',
      sub: 'Comunidad y tutoriales',
      color: 'bg-slate-100 text-slate-600',
    },
    { icon: 'logout', label: 'Cerrar sesión', sub: '', color: 'bg-red-50 text-red-500' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Configuración</h1>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4 shadow-sm">
        <div
          className="size-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0"
          style={{ backgroundColor: accent }}
        >
          CS
        </div>
        <div>
          <p className="font-black text-slate-900">Caro Pastelería</p>
          <p className="text-sm text-slate-500">caro-pasteleria@gmail.com</p>
          <p className="text-xs font-bold mt-1" style={{ color: accent }}>
            vitrina.ar/caro-pasteleria
          </p>
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm divide-y divide-slate-50">
        {items.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
            >
              <MI name={item.icon} className="!text-xl" />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-bold ${item.icon === 'logout' ? 'text-red-500' : 'text-slate-900'}`}
              >
                {item.label}
              </p>
              {item.sub && <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>}
            </div>
            {item.icon !== 'logout' && (
              <MI name="chevron_right" className="text-slate-300 !text-xl" />
            )}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-slate-300">Vitrina v1.0 · Hecho con ❤️ en Argentina</p>
    </div>
  );
};

export default SettingsSection;
