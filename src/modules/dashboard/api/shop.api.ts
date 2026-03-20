import {api} from '../../../api/ApiBase'
import type { IShopData } from '../types/shop.type'

//funcion para crear una nueva tienda
export const postCreateShopFn = async (data:IShopData)=>{
    const response = await api.post('/tiendas/', data)
    return response.data
}
