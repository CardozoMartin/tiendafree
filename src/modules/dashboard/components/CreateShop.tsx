import FormCreateShop from './Forms/FormCreateShop';

export interface IShopData {
  nombre: string;
  titulo: string;
  descripcion: string;
  plantillaId: number;
  whatsapp: string;
  instagram: string;
  facebook: string;
  pais: string;
  provincia: string;
  ciudad: string;
}

interface CreateShopProps {
  accent?: string;
}
const CreateShop = ({ accent = '#6344ee' }: CreateShopProps) => {
  return (
    <>
      <style>{`
        .rhf-input-focus:focus { ring-color: ${accent}; border-color: ${accent}; outline: none; box-shadow: 0 0 0 2px ${accent}33; }
      `}</style>

      <div className="space-y-6">
        {/* Page title */}
        <div>
          <h2 className="text-2xl font-black text-slate-900">Crear tu tienda</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Completá los datos para configurar tu tienda online.
          </p>
        </div>

        <FormCreateShop accent={accent} />
      </div>
    </>
  );
};

export default CreateShop;
