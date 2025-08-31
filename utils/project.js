import path from "path";
import fs from "fs-extra";
import { logger } from "./logger.js";
import { copyTemplates } from "./templateManager.js";
import { installDependencies } from "./installer.js";

export async function setupProject(projectName, config) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    logger.error(`❌ Directory ${projectName} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);

  logger.info("📋 Project Configuration:");
  logger.info(`   Framework: ${config.framework}`);
  logger.info(`   Backend: ${config.backend}`);
  logger.info(`   Database: ${config.database}`);
  logger.info(`   Language: ${config.language}`);
  console.log();

  copyTemplates(projectPath, config);
  installDependencies(projectPath);

  logger.success(`✅ Project '${projectName}' created successfully!`);
  logger.info(`👉 cd ${projectName}/client && npm run dev`);
  logger.info(`👉 cd ${projectName}/server && npm start`);
  logger.info("✨ Made with ❤️ by Joe Celaster ✨");
}
