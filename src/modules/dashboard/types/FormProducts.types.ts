import type { IProduct } from "./product.type";

export interface FormProductValues {
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | '';
  moneda: string;
  disponible: boolean;
  destacado: boolean;
  stock: number;
  tags: string;
  categoriaId: number | '';
}

export interface VariantePendiente {
  nombre: string;
  sku: string;
  precioExtra: number;
  stock: number;
  disponible: boolean;
}

export interface FormProductProps {
  producto?: IProduct;
  onSuccess?: () => void;
}