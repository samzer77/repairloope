import { randomUUID } from "crypto";
import { JsonStore } from "./jsonStore";

export type Role = "owner" | "repairer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

const store = new JsonStore<User>("users.json");

export const userRepository = {
  async findByEmail(email: string) {
    return (await store.readAll()).find((u) => u.email === email);
  },

  async findById(id: string) {
    return (await store.readAll()).find((u) => u.id === id);
  },

  async create(data: Omit<User, "id" | "createdAt" | "active">) {
    const users = await store.readAll();
    const user: User = {
      ...data,
      id: randomUUID(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await store.writeAll(users);
    return user;
  },
};
