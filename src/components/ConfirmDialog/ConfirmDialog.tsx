import type { ConfirmOptions } from '@/types/ModalAlert.type';
import { VARIANT_CONFIG } from './variantConfig';

interface ConfirmDialogProps {
  opciones: ConfirmOptions;
  onRespuesta: (confirmado: boolean) => void;
}

function ConfirmDialog({ opciones, onRespuesta }: ConfirmDialogProps) {
  const {
    titulo = '¿Estás seguro?',
    descripcion = 'Esta acción no puede deshacerse.',
    textoCancelar = 'Cancelar',
    textoConfirmar = 'Confirmar',
    variant = 'danger',
    icono: IconoCustom,
  } = opciones;

  const config = VARIANT_CONFIG[variant];
  const Icono = IconoCustom ?? config.IconDefault;

  return (
    // Overlay con backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => onRespuesta(false)} // cerrar al clickear fuera
    >
      <div
        className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200"
        onClick={(e) => e.stopPropagation()} // evitar que el click interno cierre el modal
      >
        {/* Ícono */}
        <div className={`flex items-center justify-center p-4 ${config.iconoBg} rounded-full`}>
          <Icono className={`w-6 h-6 ${config.iconoColor}`} strokeWidth={1.8} />
        </div>

        {/* Texto */}
        <h2 className="text-gray-900 font-semibold mt-4 text-xl">{titulo}</h2>
        <p className="text-sm text-gray-600 mt-2 text-center">{descripcion}</p>

        {/* Botones */}
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
          <button
            type="button"
            className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
            onClick={() => onRespuesta(false)}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`w-full md:w-36 h-10 rounded-md font-medium text-sm active:scale-95 transition ${config.btnClass}`}
            onClick={() => onRespuesta(true)}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
