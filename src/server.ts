import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`EUNIKMODA API escuchando en http://localhost:${env.port}`);
  console.log(`  Público: http://localhost:${env.port}/api/v1/public`);
  console.log(`  Admin:   http://localhost:${env.port}/api/v1/admin`);
});
