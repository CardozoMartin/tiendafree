import joyas from '../../../assets/img/plantillaJoya.png'
import gorras from '../../../assets/img/plantillagorra.png'
import ropa from '../../../assets/img/plantillaRopa.png';

export const PLANTILLAS = [
  {
    id: 3,
    nombre: 'plantilla_accesorios',
    label: 'Accesorios',
    categoria: 'Joyería',
    precio: 'Gratis',
    preview: joyas
  },
  {
    id: 2,
    nombre: 'plantilla_gorras',
    label: 'Gorras',
    categoria: 'Streetwear',
    precio: 'Gratis',
    preview: gorras,
    activa: false,
  },
  {
    id: 1,
    nombre: 'plantilla_ropa',
    label: 'Ropa',
    categoria: 'Moda',
    precio: 'Gratis',
    preview: ropa,
    activa: false,
  },
];
