import { RepairerProfile } from "../models";
import { JsonStore } from "./jsonStore";

const store = new JsonStore<RepairerProfile>("profiles.json");

export const profileRepository = {
  findAll: () => store.readAll(),

  async findByUserId(userId: string) {
    return (await store.readAll()).find((p) => p.userId === userId);
  },

  async save(profile: RepairerProfile) {
    const all = await store.readAll();
    const i = all.findIndex((p) => p.userId === profile.userId);
    if (i >= 0) all[i] = profile;
    else all.push(profile);
    await store.writeAll(all);
    return profile;
  },
};
