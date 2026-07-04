import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';

export interface IGuiaTalles {
  id: number;
  nombre: string;
  columnas: string[];
  filas: string[][];
  nota?: string | null;
}

export interface IGuiaTallesInput {
  nombre: string;
  columnas: string[];
  filas: string[][];
  nota?: string;
}

export const getGuiasTallesFn = async (): Promise<IGuiaTalles[]> => {
  const { data } = await api.get<ISuccessResponse<IGuiaTalles[]>>('/guias-talles');
  return data.datos;
};

export const postGuiaTallesFn = async (payload: IGuiaTallesInput): Promise<IGuiaTalles> => {
  const { data } = await api.post<ISuccessResponse<IGuiaTalles>>('/guias-talles', payload);
  return data.datos;
};

export const putGuiaTallesFn = async (
  id: number,
  payload: Partial<IGuiaTallesInput>
): Promise<IGuiaTalles> => {
  const { data } = await api.put<ISuccessResponse<IGuiaTalles>>(`/guias-talles/${id}`, payload);
  return data.datos;
};

export const deleteGuiaTallesFn = async (id: number): Promise<void> => {
  await api.delete(`/guias-talles/${id}`);
};
