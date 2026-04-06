export interface IOrderItem {
  id: number;
  cantidad: number;
  nombreProd: string;
  nombreVar?: string;
  subtotal: number;
}

export interface IOrderShippingMethod {
  nombre: string;
}

export interface IOrderPaymentMethod {
  nombre: string;
}

export interface IOrder {
  id: number;
  compradorNombre: string;
  compradorEmail?: string;
  compradorTel?: string;
  direccionCalle?: string;
  direccionNumero?: string;
  direccionCiudad?: string;
  direccionProv?: string;
  metodoEntrega?: IOrderShippingMethod;
  metodoPago?: IOrderPaymentMethod;
  notasCliente?: string;
  estado: string;
  total: number;
  costoEnvio?: number;
  creadoEn: string;
  _count?: {
    items?: number;
  };
  items?: IOrderItem[];
}

export interface IOrderPaginatedResponse {
  datos: IOrder[];
  paginacion: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}
