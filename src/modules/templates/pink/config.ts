import type { TemplateConfig } from '../types';

export const config: TemplateConfig = {
  id: 'plantilla_pink',
  nombre: 'Pink',
  descripcion: 'Template con enfoque en belleza y estilo visual editorial.',
  secciones: [
    {
      id: 'navbar',
      label: 'Navegación / Encabezado',
      descripcion: 'Logotipo y nombre principal',
      campos: ['titulo'],
    },
    {
      id: 'hero',
      label: 'Hero Principal',
      descripcion: 'Título, descripción y galería principal',
      campos: ['titulo', 'descripcion', 'carrusel'],
    },
    {
      id: 'galeria',
      label: 'Galería Inspiración',
      descripcion: 'Bloque visual tipo collage para destacar estilo',
      campos: [],
    },
    {
      id: 'productos',
      label: 'Productos Destacados',
      descripcion: 'Grid de productos y ofertas',
      campos: [],
    },
  ],
};
