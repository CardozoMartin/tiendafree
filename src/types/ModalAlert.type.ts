import type { LucideIcon } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmOptions {
  titulo?: string;
  descripcion?: string;
  textoCancelar?: string;
  textoConfirmar?: string;
  variant?: ConfirmVariant;
  icono?: LucideIcon;
}
