import { RepairRequest } from "../models";
import { JsonStore } from "./jsonStore";

const store = new JsonStore<RepairRequest>("requests.json");

export const requestRepository = {
  findAll: () => store.readAll(),

  async findById(id: string) {
    return (await store.readAll()).find((r) => r.id === id);
  },

  async insert(request: RepairRequest) {
    const all = await store.readAll();
    all.unshift(request);
    await store.writeAll(all);
    return request;
  },

  async update(request: RepairRequest) {
    const all = await store.readAll();
    const i = all.findIndex((r) => r.id === request.id);
    if (i < 0) throw new Error("Demande introuvable");
    all[i] = request;
    await store.writeAll(all);
    return request;
  },
};
