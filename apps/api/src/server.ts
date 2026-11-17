import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => console.log(`API sur http://localhost:${env.PORT}`));
