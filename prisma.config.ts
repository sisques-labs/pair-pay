/**
 * Prisma CLI configuration (Prisma 7+).
 *
 * Note:
 * - Prisma CLI no longer reads datasource URLs from `schema.prisma`.
 * - Keep runtime DB access (PrismaClient) configuration in application code.
 */
import { defineConfig } from "prisma/config";
import fs from "node:fs";
import path from "node:path";

// Prisma 7 does not automatically load `.env` / `.env.local`.
// We load them here so `process.env.DATABASE_URL` / `process.env.DIRECT_URL` are available for CLI commands.
function loadEnvFileIfPresent(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx <= 0) continue;

    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();

    // Strip surrounding quotes (basic .env support).
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Do not override variables already present in the environment.
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const rootDir = process.cwd();
const nodeEnv = process.env.NODE_ENV ?? "development";

// Similar to Next.js precedence (base first, then mode, then locals).
loadEnvFileIfPresent(path.join(rootDir, ".env"));
loadEnvFileIfPresent(path.join(rootDir, `.env.${nodeEnv}`));
loadEnvFileIfPresent(path.join(rootDir, ".env.local"));
loadEnvFileIfPresent(path.join(rootDir, `.env.${nodeEnv}.local`));

const directUrl = process.env.DIRECT_URL;
const databaseUrl = process.env.DATABASE_URL;
const datasourceUrl = directUrl ?? databaseUrl;

if (!datasourceUrl) {
  throw new Error(
    "Missing DATABASE_URL / DIRECT_URL. Set it in `.env` or `.env.local` before running Prisma CLI commands."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prefer a direct connection for Prisma CLI commands (migrate/db push/studio).
    url: datasourceUrl,
  },
});
