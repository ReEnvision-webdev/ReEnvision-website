import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT!, 10),
    database: process.env.DATABASE_NAME!,

    ssl: "require",
  },
});
