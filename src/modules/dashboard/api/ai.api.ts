import { api } from '../../../api/ApiBase';

export interface GeneratePostRequest {
  productoId: number;
  tiendaId?: number;
  redSocial: string;
  tono: string;
  objetivo: string;
}

export interface MarketingBlock {
  titulo: string;
  descripcion: string;
  caption: string;
  cta: string;
  hashtags: string[];
  whatsapp: string;
  historia: string;
  ideasVisuales: string[];
}

export interface GeneratedMarketingKit {
  resumen: string;
  hook: string;
  venta: MarketingBlock;
  promocion: MarketingBlock;
  organico: MarketingBlock;
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
