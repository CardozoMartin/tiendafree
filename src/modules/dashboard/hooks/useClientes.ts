import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClientesTiendaFn, getDetalleClienteFn } from '../api/clientes.api';

export const useClientes = (params: { pagina?: number; limite?: number; busqueda?: string }) => {
  return useQuery({
    queryKey: ['clientes', params],
    queryFn: () => getClientesTiendaFn(params),
    staleTime: 30_000,
  });
};

export const useDetalleCliente = (clienteId: number | null) => {
  return useQuery({
    queryKey: ['cliente-detalle', clienteId],
    queryFn: () => getDetalleClienteFn(clienteId!),
    enabled: clienteId !== null,
    staleTime: 30_000,
  });
};

export const useClientesFiltros = () => {
  const [pagina, setPagina]     = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const limite = 20;

  const resetPagina = () => setPagina(1);

  return { pagina, setPagina, busqueda, setBusqueda, limite, resetPagina };
};
