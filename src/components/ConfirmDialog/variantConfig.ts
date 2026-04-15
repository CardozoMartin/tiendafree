import type { ConfirmVariant } from '@/types/ModalAlert.type';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export const VARIANT_CONFIG: Record<
  ConfirmVariant,
  { iconoBg: string; iconoColor: string; btnClass: string; IconDefault: LucideIcon }
> = {
  danger: {
    iconoBg: 'bg-red-100',
    iconoColor: 'text-red-600',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
    IconDefault: Trash2,
  },
  warning: {
    iconoBg: 'bg-yellow-100',
    iconoColor: 'text-yellow-600',
    btnClass: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    IconDefault: AlertTriangle,
  },
  info: {
    iconoBg: 'bg-blue-100',
    iconoColor: 'text-blue-600',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    IconDefault: Info,
  },
};
