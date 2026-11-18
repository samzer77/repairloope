import { HttpError } from "../middleware/errorHandler";
import { categoryRepository } from "../repositories/categoryRepository";

export const categoryService = {
  list: () => categoryRepository.list(),

  async add(name: string) {
    const all = await categoryRepository.list();
    if (all.some((c) => c.toLowerCase() === name.toLowerCase())) {
      throw new HttpError(409, "Cette catégorie existe déjà", { name: "Cette catégorie existe déjà" });
    }
    await categoryRepository.saveAll([...all, name]);
    return name;
  },

  async remove(name: string) {
    const all = await categoryRepository.list();
    if (!all.includes(name)) throw new HttpError(404, "Catégorie introuvable");
    await categoryRepository.saveAll(all.filter((c) => c !== name));
  },
};
