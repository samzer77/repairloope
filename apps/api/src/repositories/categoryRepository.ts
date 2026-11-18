import { JsonStore } from "./jsonStore";

const defaults = ["Électroménager", "Informatique", "Smartphones", "Vélos", "Meubles", "Vêtements"];
const store = new JsonStore<string>("categories.json", defaults);

export const categoryRepository = {
  list: () => store.readAll(),
  saveAll: (items: string[]) => store.writeAll(items),
};
