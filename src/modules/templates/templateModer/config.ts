import type { TemplateConfig } from "../types";


export const configModer: TemplateConfig = {
  id: 'plantilla_comun',
  nombre: 'Moderna',
  descripcion: 'Diseño limpio y versátil. Ideal para moda, accesorios y productos generales.',
  secciones: [
    {
      id: 'hero',
      label: 'Hero / Galería',
      descripcion: 'Título, descripción e imágenes principales',
      campos: ['titulo', 'descripcion', 'carrusel'],
    },
    {
      id: 'marcas',
      label: 'Marcas',
      descripcion: 'Carrusel de logos de marcas',
      campos: [],
    },
    {
      id: 'nuevos',
      label: 'Nuevos ingresos',
      descripcion: 'Productos destacados',
      campos: [],
    },
    {
      id: 'productos',
      label: 'Todos los productos',
      descripcion: 'Catálogo completo con filtros',
      campos: [],
    },
  ],
};
