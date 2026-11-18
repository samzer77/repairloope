import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "..", "..", "data");

export class JsonStore<T> {
  private file: string;

  constructor(fileName: string, private seed: T[] = []) {
    this.file = path.join(DATA_DIR, fileName);
  }

  async readAll(): Promise<T[]> {
    try {
      const content = await fs.readFile(this.file, "utf-8");
      return JSON.parse(content) as T[];
    } catch (err: any) {
      if (err.code === "ENOENT") return structuredClone(this.seed);
      throw err;
    }
  }

  async writeAll(items: T[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(items, null, 2), "utf-8");
  }
}
