import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_5qg1YGxkwvCl@ep-plain-sun-ac20hdpf-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
