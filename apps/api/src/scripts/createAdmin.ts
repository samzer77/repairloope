import { hash } from "bcryptjs";
import { userRepository } from "../repositories/userRepository";

async function main() {
  const [rawEmail, password, name = "Admin"] = process.argv.slice(2);
  if (!rawEmail || !password) {
    console.error("Usage : npm run create-admin -- email motdepasse [nom]");
    process.exit(1);
  }
  const email = rawEmail.toLowerCase();
  if (await userRepository.findByEmail(email)) {
    console.error("Cet e-mail existe déjà");
    process.exit(1);
  }
  await userRepository.create({ name, email, role: "admin", passwordHash: await hash(password, 10) });
  console.log(`Admin créé : ${email}`);
}

main();
