import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import type { AxiosError } from 'axios';
import {
  deleteShopCarouselImageFn,
  getCarruselAdminFn,
  postAddShopCarouselImageFn,
  putActualizarSeccionFn,
  putReordenarCarruselFn,
  type ActualizarSeccionDto,
} from '../api/carrusel.api';
import { toast } from 'sonner';
import type { IShopData } from '../types/shop.type';

const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

export const useCarruselAdmin = () => {
  return useQuery({
    queryKey: ['carruselAdmin'],
    queryFn: getCarruselAdminFn,
  });
};

export const useDeleteShopCarouselImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShopCarouselImageFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['carruselAdmin'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useAddShopCarouselImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAddShopCarouselImageFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['carruselAdmin'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useActualizarSeccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ActualizarSeccionDto }) =>
      putActualizarSeccionFn({ id, datos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['carruselAdmin'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useReordenarCarrusel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putReordenarCarruselFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carruselAdmin'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
