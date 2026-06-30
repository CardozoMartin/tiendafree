// Comprime y redimensiona una imagen en el navegador antes de subirla.
// Usa Canvas (sin dependencias). Devuelve un File listo para FormData.

interface Opciones {
  maxAncho?: number;   // ancho máximo en px (alto se ajusta proporcional)
  maxAlto?: number;    // alto máximo en px
  calidad?: number;    // 0–1 (solo para jpeg/webp)
  tipoSalida?: string; // 'image/jpeg' | 'image/webp'
  maxBytes?: number;   // si ya pesa menos que esto, no la tocamos
}

const DEFAULTS: Required<Opciones> = {
  maxAncho: 1920,
  maxAlto: 1920,
  calidad: 0.82,
  tipoSalida: 'image/jpeg',
  maxBytes: 600 * 1024, // 600KB: por debajo de esto no comprimimos
};

export async function comprimirImagen(file: File, opciones: Opciones = {}): Promise<File> {
  const o = { ...DEFAULTS, ...opciones };

  // Solo procesamos imágenes rasterizadas. SVG/GIF no se tocan.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // Si ya es chica, la dejamos como está.
  if (file.size <= o.maxBytes) return file;

  const dataUrl = await leerComoDataURL(file);
  const img = await cargarImagen(dataUrl);

  // Calcular nuevas dimensiones manteniendo proporción
  let { width, height } = img;
  const ratio = Math.min(o.maxAncho / width, o.maxAlto / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file; // fallback: subimos la original
  ctx.drawImage(img, 0, 0, width, height);

  // Si el original tenía transparencia (png), conviene mantener png; si no, jpeg.
  const tipo = file.type === 'image/png' ? 'image/png' : o.tipoSalida;
  const calidad = tipo === 'image/png' ? undefined : o.calidad;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, tipo, calidad)
  );
  if (!blob) return file;

  // Si por algún motivo quedó más pesada que la original, devolvemos la original.
  if (blob.size >= file.size) return file;

  const ext = tipo === 'image/png' ? 'png' : tipo === 'image/webp' ? 'webp' : 'jpg';
  const nombreBase = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${nombreBase}.${ext}`, { type: tipo, lastModified: Date.now() });
}

function leerComoDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
