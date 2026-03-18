import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import type { ConfirmOptions } from '../types/ModalAlert.type';

export function useConfirm() {
  const [visible, setVisible] = useState(false);
  const [opciones, setOpciones] = useState<ConfirmOptions>({});

  // Guardamos resolve/reject de la promesa activa
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Abre el modal y retorna una promesa que resuelve
   * true (confirmar) o false (cancelar).
   */
  const confirm = useCallback((opts: ConfirmOptions = {}): Promise<boolean> => {
    setOpciones(opts);
    setVisible(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleRespuesta = useCallback((confirmado: boolean) => {
    setVisible(false);
    resolverRef.current?.(confirmado);
    resolverRef.current = null;
  }, []);

  // El componente modal que se renderiza vía portal
  const ConfirmModal = visible
    ? createPortal(
        <ConfirmDialog opciones={opciones} onRespuesta={handleRespuesta} />,
        document.body
      )
    : null;

  return { confirm, ConfirmModal };
}
