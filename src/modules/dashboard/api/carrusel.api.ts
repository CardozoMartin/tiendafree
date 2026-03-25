import { api } from "../../../api/ApiBase";


//funcion para eliminar una imagen del carrusel de la tienda
export const deleteShopCarouselImageFn = async (imageId: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/carrusel/${imageId}/`);
  return response.data;
}

//funcion para añadir una imagen al carrusel de la tienda
export const postAddShopCarouselImageFn = async (formData: FormData) => {
  const response = await api.post('/tiendas/mi-tienda/carrusel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
