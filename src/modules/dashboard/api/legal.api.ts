import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';

export type TipoLegal = 'TERMINOS' | 'PRIVACIDAD' | 'CAMBIOS';

export interface IPaginaLegal {
  id: number | null;
  tiendaId: number;
  tipo: TipoLegal;
  titulo: string;
  contenido: string;
  activa: boolean;
  esPlantilla?: boolean; // true = todavía no se guardó, viene de plantilla
}

export const getPaginaLegalFn = async (tipo: TipoLegal): Promise<IPaginaLegal> => {
  const { data } = await api.get<ISuccessResponse<IPaginaLegal>>(`/legal/${tipo}`);
  return data.datos;
};

export const putPaginaLegalFn = async (
  tipo: TipoLegal,
  payload: { titulo: string; contenido: string; activa: boolean }
): Promise<IPaginaLegal> => {
  const { data } = await api.put<ISuccessResponse<IPaginaLegal>>(`/legal/${tipo}`, payload);
  return data.datos;
};
