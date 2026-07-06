// Prefija rutas de assets de /public con el basePath del despliegue.
// En dev y Vercel el basePath es "" (sin cambios); en GitHub Pages es
// "/ia-para-todos-puce", necesario para que las imágenes no den 404.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
