import { api } from '../../../api/ApiBase';

export interface GeneratePostRequest {
  productoId: number;
  tiendaId?: number;
  redSocial: string;
  tono: string;
}

export const postGeneratePostFn = async (payload: GeneratePostRequest) => {
  const { data } = await api.post('/ai/generate-post', payload);
  return data;
};
