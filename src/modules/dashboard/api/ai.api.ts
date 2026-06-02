import { api } from '../../../api/ApiBase';

export interface GeneratePostRequest {
  productoId: number;
  tiendaId?: number;
  redSocial: string;
  tono: string;
  objetivo: string;
}

export interface GeneratedMarketingKit {
  resumen: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  whatsapp: string;
  historia: string;
  ideasVisuales: string[];
  variantes: Array<{
    titulo: string;
    texto: string;
  }>;
  recomendaciones: string[];
}

export interface GeneratePostResponse {
  success: boolean;
  data?: GeneratedMarketingKit;
  message?: string;
}

export const postGeneratePostFn = async (
  payload: GeneratePostRequest
): Promise<GeneratePostResponse> => {
  const { data } = await api.post('/ai/generate-post', payload);
  return data;
};
