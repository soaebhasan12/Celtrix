import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";
import { angularSetup } from "./installer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function copyTemplates(projectPath, config) {
  const { stack } = config;

  if(stack !== "mean" && stack !== "mean+tailwind+auth"){
    const frontendTemplate = path.join(__dirname, "..", "templates", stack, config.language, "client");
    const backendTemplate = path.join(__dirname, "..", "templates", stack, config.language, "server");

    const clientPath = path.join(projectPath, "client");
    const serverPath = path.join(projectPath, "server");

    logger.info("📂 Copying template files...");
    fs.copySync(frontendTemplate, clientPath);
    fs.copySync(backendTemplate, serverPath);
  }
  if(stack === "mean" || stack === "mean+tailwind+auth"){
    const backendTemplate = path.join(__dirname, "..", "templates", stack, "server")
    const serverPath = path.join(projectPath, "server");
    
    logger.info("📂 Copying template files...");
    fs.copySync(backendTemplate, serverPath);
  }
}
