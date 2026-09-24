import { categoriaRepository } from "../repositories/categoria.repository";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/sku";

export const categoriaService = {
  listarPublicas() { return categoriaRepository.findAllActive(); },
  listarTodas() { return categoriaRepository.findAll(); },
  async crear(nombre: string, orden = 0) {
    const slug = slugify(nombre);
    const existente = await categoriaRepository.findBySlug(slug);
    if (existente) throw ApiError.conflict(`Ya existe una categoría con el slug "${slug}".`);
    return categoriaRepository.create({ nombre, slug, orden });
  },
  async actualizar(id: number, cambios: { nombre?: string; orden?: number; activo?: boolean }) {
    const data: Record<string, unknown> = { ...cambios };
    if (cambios.nombre) data.slug = slugify(cambios.nombre);
    await categoriaRepository.update(id, data as any);
  },
  eliminar(id: number) { return categoriaRepository.remove(id); },
};
