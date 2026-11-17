import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../middleware/errorHandler";
import { User, userRepository } from "../repositories/userRepository";
import { LoginInput, RegisterInput } from "../validation/auth";

export type PublicUser = Omit<User, "passwordHash">;

export function toPublic(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

function signToken(user: User) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });
}

export const authService = {
  async register(input: RegisterInput) {
    if (await userRepository.findByEmail(input.email)) {
      throw new HttpError(409, "Cet e-mail est déjà utilisé");
    }
    const passwordHash = await hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash,
    });
    return { user: toPublic(user), token: signToken(user) };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user || !(await compare(input.password, user.passwordHash))) {
      throw new HttpError(401, "E-mail ou mot de passe incorrect");
    }
    if (!user.active) {
      throw new HttpError(403, "Ce compte est désactivé");
    }
    return { user: toPublic(user), token: signToken(user) };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.active) throw new HttpError(401, "Session invalide");
    return toPublic(user);
  },
};
