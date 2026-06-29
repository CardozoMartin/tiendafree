import { api } from '../../../api/ApiBase';

export interface ClienteStats {
  totalPedidos: number;
  totalGastado: number;
  ultimoPedido: { id: number; estado: string; fecha: string } | null;
}

export interface ClienteResumen {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  emailVerificado: boolean;
  activo: boolean;
  creadoEn: string;
  stats: ClienteStats;
}

export interface PedidoDetalle {
  id: number;
  total: number;
  estado: string;
  estadoPago: string;
  compradorNombre: string;
  compradorEmail: string;
  compradorTel: string;
  direccionCalle: string;
  direccionCiudad: string;
  direccionProv: string;
  metodoPago: { nombre: string };
  metodoEntrega: { nombre: string };
  items: {
    nombreProd: string;
    nombreVar: string | null;
    cantidad: number;
    precioUnit: number;
    subtotal: number;
    imagenUrl: string | null;
  }[];
  creadoEn: string;
}

export interface ClienteDetalle extends Omit<ClienteResumen, 'stats'> {
  actualizadoEn: string;
  pedidos: PedidoDetalle[];
  stats: ClienteStats & { pedidosAprobados: number };
}

export interface PaginacionClientes {
  datos: ClienteResumen[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export const getClientesTiendaFn = async (params: {
  pagina?: number;
  limite?: number;
  busqueda?: string;
}): Promise<PaginacionClientes> => {
  const response = await api.get('/clientes/mi-tienda', { params });
  return response.data;
};

export const getDetalleClienteFn = async (clienteId: number): Promise<ClienteDetalle> => {
  const response = await api.get(`/clientes/mi-tienda/${clienteId}`);
  return response.data.datos;
};
