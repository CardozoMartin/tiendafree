import type { AxiosError } from 'axios';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import { getMyShopFn, postCreateShopFn } from '../api/shop.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { IShopData } from '../types/shop.type';

// ─── Helper para extraer el mensaje de error ─────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

//hook para crear una nueva tienda
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateShopFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const useMyShop = () => {
  return useQuery({
    queryKey: ['myShop'],
    queryFn: getMyShopFn,
    enabled: true
  });
};
