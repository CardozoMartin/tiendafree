import {api} from '../../../api/ApiBase'
import type { IShopData } from '../types/shop.type'

//funcion para crear una nueva tienda
export const postCreateShopFn = async (data:IShopData)=>{
    const response = await api.post('/tiendas/', data)
    return response.data
}

//funcion para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const getMyShopFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/')
  return response.data
}

//funcion para ver el sitio web de la tienda
export const getPublicShopFn = async (slug: string) => {
  const {data} = await api.get(`/tiendas/${slug}/`)
  return data.datos
}
