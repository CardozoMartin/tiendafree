import type { AxiosError } from "axios";
import type { IErrorResponse, ISuccessResponse } from "../../../types/api.type";
import {
  getMyShopFn,
  getPublicShopFn,
  postCreateShopFn,
  putUpdateShopFn,
  putUpdateShopVisualFn,
  getMetodosPagoCatalogoFn,
  getMetodosEntregaCatalogoFn,
  postAgregarMetodoPagoFn,
  deleteEliminarMetodoPagoFn,
  postAgregarMetodoEntregaFn,
  deleteEliminarMetodoEntregaFn,
  getAboutUsFn,
  putUpdateAboutUsFn,
  postUploadAboutUsImageFn,
  getMarqueeFn,
  putUpdateMarqueeFn,
} from "../api/shop.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthSessionStore } from "../../auth/store/useAuthSession";
import type { IShopData } from "../types/shop.type";

// ─── Helper para extraer el mensaje de error ─────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(" · ") ?? data?.mensaje ?? "Error inesperado";
};

//hook para crear una nueva tienda
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateShopFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const useMyShop = () => {
  const token = useAuthSessionStore((state) => state.token);

  return useQuery<IShopData, AxiosError<IErrorResponse>>({
    queryKey: ["myShop"],
    queryFn: getMyShopFn,
    enabled: Boolean(token),
    refetchOnMount: "always",
    retry: false,
  });
};

//Hooks para obtener los datos de la tienda publica por slug, para mostrar en el sitio publico
export const usePublicShop = (slug: string) => {
  return useQuery({
    queryKey: ["publicShop", slug],
    queryFn: () => getPublicShopFn(slug),
    enabled: !!slug,
  });
};

//hook para actualizar los datos de la tienda
export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateShopFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para actualizar los datos visuales de la tienda (colores, fuentes, etc)
export const useUpdateShopVisual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateShopVisualFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ── Catálogo ──

//hook para obtener el catálogo de métodos de pago disponibles para agregar a la tienda
export const useMetodosPagoCatalogo = () => {
  return useQuery({
    queryKey: ["metodosPagoCatalogo"],
    queryFn: getMetodosPagoCatalogoFn,
  });
};

//hook para obtener el catálogo de métodos de entrega disponibles para agregar a la tienda
export const useMetodosEntregaCatalogo = () => {
  return useQuery({
    queryKey: ["metodosEntregaCatalogo"],
    queryFn: getMetodosEntregaCatalogoFn,
  });
};

// ── Mutaciones ──

//hook para agregar un método de pago a la tienda
export const useAgregarMetodoPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarMetodoPagoFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para eliminar un método de pago de la tienda
export const useEliminarMetodoPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarMetodoPagoFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para agregar un método de entrega a la tienda
export const useAgregarMetodoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarMetodoEntregaFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para eliminar un método de entrega de la tienda
export const useEliminarMetodoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarMetodoEntregaFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ── About Us ──

//hook para obtener los datos de la sección "About Us" de la tienda
export const useAboutUs = () => {
  return useQuery({
    queryKey: ["aboutUs"],
    queryFn: getAboutUsFn,
  });
};

//hook para actualizar los datos de la sección "About Us" de la tienda
export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateAboutUsFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para subir una imagen a la sección "About Us" de la tienda
export const useUploadAboutUsImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUploadAboutUsImageFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ── Marquee ──

//hook para obtener los datos del marquee de la tienda
export const useMarquee = () => {
  return useQuery({
    queryKey: ["marquee"],
    queryFn: getMarqueeFn,
  });
};

//hook para actualizar los datos del marquee de la tienda
export const useUpdateMarquee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateMarqueeFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ["marquee"] });
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
