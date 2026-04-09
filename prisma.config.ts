import "dotenv/config";
import { defineConfig } from "prisma/config";

function buildDatabaseUrl() {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const user = process.env.DB_USER || "postgres";
  const password = encodeURIComponent(process.env.DB_PASSWORD || "postgres");
  const database = process.env.DB_NAME || "notehive";

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
