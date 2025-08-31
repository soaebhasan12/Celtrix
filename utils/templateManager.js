import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function copyTemplates(projectPath, config) {
  const { framework, backend, database, language } = config;

  const frontendTemplate = path.join(__dirname, "..", "templates", "frontend", framework, language, "client");
  const backendTemplate = path.join(__dirname, "..", "templates", "backend", backend, "server");
  const dbTemplate = path.join(__dirname, "..", "templates", "database", database);
//   const langTemplate = path.join(__dirname, "..", "templates", "language", language);

  const clientPath = path.join(projectPath, "client");
  const serverPath = path.join(projectPath, "server");

  logger.info("📂 Copying template files...");
  fs.copySync(frontendTemplate, clientPath);
  fs.copySync(backendTemplate, serverPath);
  fs.copySync(dbTemplate, serverPath, { overwrite: true });
//   fs.copySync(langTemplate, serverPath, { overwrite: true });
}
