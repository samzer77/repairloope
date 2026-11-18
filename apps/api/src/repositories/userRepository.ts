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
   async findAll() {
    return store.readAll();
  },

  async setActive(id: string, active: boolean) {
    const users = await store.readAll();
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;
    user.active = active;
    await store.writeAll(users);
    return user;
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
