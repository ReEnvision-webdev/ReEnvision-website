import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// For both introspection (db:pull) and push (db:push), we need a connection string
let connectionString: string;

if (process.env.DATABASE_URL) {
  // If DATABASE_URL is provided, use it directly
  connectionString = process.env.DATABASE_URL;
} else if (process.env.DATABASE_USER && process.env.DATABASE_PASSWORD && 
           process.env.DATABASE_HOST && process.env.DATABASE_PORT && 
           process.env.DATABASE_NAME) {
  // Build connection string from individual variables
  connectionString = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?sslmode=no-verify`;
} else {
  throw new Error("Database connection variables are not properly set. Please ensure either DATABASE_URL or all of DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME are defined in your environment.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
