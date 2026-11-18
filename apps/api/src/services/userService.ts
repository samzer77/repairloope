import { HttpError } from "../middleware/errorHandler";
import { Actor } from "../models";
import { userRepository } from "../repositories/userRepository";
import { toPublic } from "./authService";

export const userService = {
  async search(term?: string) {
    const t = term?.trim().toLowerCase();
    const users = await userRepository.findAll();
    return users
      .filter((u) => !t || u.name.toLowerCase().includes(t) || u.email.includes(t))
      .map(toPublic);
  },

  async setActive(actor: Actor, id: string, active: boolean) {
    if (id === actor.id) throw new HttpError(400, "Vous ne pouvez pas désactiver votre propre compte");
    const user = await userRepository.setActive(id, active);
    if (!user) throw new HttpError(404, "Utilisateur introuvable");
    return toPublic(user);
  },
};
