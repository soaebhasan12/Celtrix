import { execSync } from "child_process";
import { logger } from "./logger.js";

export function installDependencies(projectPath) {
  logger.info("📦 Installing dependencies...");

  try {
    execSync("npm install", { cwd: `${projectPath}/client`, stdio: "inherit" });
    execSync("npm install", { cwd: `${projectPath}/server`, stdio: "inherit" });
  } catch (err) {
    logger.error("❌ Failed to install dependencies");
    throw err;
  }
}
