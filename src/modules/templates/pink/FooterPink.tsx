
// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ brandName = 'LUMÉ' }: { brandName?: string; tienda?: any }) => {

  return (
    <footer className="py-12 px-6 md:px-16 bg-white border-t border-gray-100 text-center text-sm text-slate-400">
      <p className="font-black text-xl mb-2 text-primary">{brandName}</p>
      <p>© {new Date().getFullYear()} {brandName}. Todos los derechos reservados.</p>
      

      <div className="flex items-center justify-center gap-6 mt-6">
        <a href="#" className="hover:text-primary transition-colors">
          Términos
        </a>
        <span className="w-px h-3 bg-slate-100" />
        <a href="#" className="hover:text-primary transition-colors">
          Privacidad
        </a>
        <span className="w-px h-3 bg-slate-100" />
        <a href="#" className="hover:text-primary transition-colors">
          Contacto
        </a>
      </div>
    </footer>
  );
};
export default Footer;
