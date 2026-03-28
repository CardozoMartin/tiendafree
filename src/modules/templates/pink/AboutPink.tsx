import { MapPin, Instagram, Phone } from 'lucide-react';

export default function AboutPink({ tienda, accent, bgColor = '#fff1f2' }: { tienda: any; accent: string; bgColor?: string }) {
  const textColor = accent || '#e11d48';

  return (
    <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto flex flex-col items-center text-center" style={{ backgroundColor: bgColor }}>
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: textColor }}>
          Nuestra historia
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black mb-8 text-gray-900">
        ¿Quiénes somos?
      </h2>
      <p className="text-gray-600 max-w-2xl text-base md:text-lg leading-relaxed mb-12">
        {tienda?.descripcion || 'Somos una marca dedicada a brindarte los mejores productos. Seleccionamos cada artículo cuidadosamente para garantizar calidad, diseño y exclusividad.'}
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-gray-700">
        {tienda?.ciudad && (
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-full bg-white shadow-sm" style={{ color: textColor }}>
              <MapPin className="w-5 h-5" />
            </span>
            <span className="font-medium text-sm tracking-wide">{tienda.ciudad}{tienda.provincia ? `, ${tienda.provincia}` : ''}</span>
          </div>
        )}
        
        {tienda?.instagram && (
          <a href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="p-3 rounded-full bg-white shadow-sm" style={{ color: textColor }}>
              <Instagram className="w-5 h-5" />
            </span>
            <span className="font-medium text-sm tracking-wide">@{tienda.instagram}</span>
          </a>
        )}
        
        {tienda?.whatsapp && (
          <a href={`https://wa.me/${tienda.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="p-3 rounded-full bg-white shadow-sm" style={{ color: textColor }}>
              <Phone className="w-5 h-5" />
            </span>
            <span className="font-medium text-sm tracking-wide">{tienda.whatsapp}</span>
          </a>
        )}
      </div>
    </section>
  );
}
