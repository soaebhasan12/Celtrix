import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function copyTemplates(projectPath, config) {
  const { stack } = config;

  // Handle Django stacks
  if (stack.startsWith('django')) {
    logger.info("📂 Copying Django template files...");
    
    // Always copy Django backend template
    const djangoServerTemplate = path.join(__dirname, "..", "templates", stack, "server");
    const serverPath = path.join(projectPath, "server");
    
    if (fs.existsSync(djangoServerTemplate)) {
      fs.copySync(djangoServerTemplate, serverPath);
      logger.info("✅ Django backend templates copied");
    }

    // Copy frontend templates for full-stack setups
    if (stack === "django+react") {
      const reactTemplate = path.join(__dirname, "..", "templates", "django+react", "client");
      const clientPath = path.join(projectPath, "client");
      
      if (fs.existsSync(reactTemplate)) {
        fs.copySync(reactTemplate, clientPath);
        logger.info("✅ React frontend templates copied");
      }
    } else if (stack === "django+vue") {
      const vueTemplate = path.join(__dirname, "..", "templates", "django+vue", "client");
      const clientPath = path.join(projectPath, "client");
      
      if (fs.existsSync(vueTemplate)) {
        fs.copySync(vueTemplate, clientPath);
        logger.info("✅ Vue.js frontend templates copied");
      }
    }
    
    // Copy additional Django configuration files
    const djangoConfigTemplate = path.join(__dirname, "..", "templates", "django-common");
    if (fs.existsSync(djangoConfigTemplate)) {
      fs.copySync(djangoConfigTemplate, projectPath);
      logger.info("✅ Django configuration files copied");
    }
    
    return;
  }

  // Handle T3 Stack
  if (stack === "t3-stack") {
    const frontendTemplate = path.join(__dirname, "..", "templates", stack, "t3-app");
    const clientPath = path.join(projectPath, "t3-app");

    logger.info("📂 Copying T3 template files...");
    if (fs.existsSync(frontendTemplate)) {
      fs.copySync(frontendTemplate, clientPath);
    }
    return;
  }

  // Handle MEAN stacks (Angular)
  if (stack === "mean" || stack === "mean+tailwind+auth") {
    const backendTemplate = path.join(__dirname, "..", "templates", stack, "server");
    const serverPath = path.join(projectPath, "server");
    
    logger.info("📂 Copying MEAN template files...");
    if (fs.existsSync(backendTemplate)) {
      fs.copySync(backendTemplate, serverPath);
    }
    return;
  }

  // Handle other stacks (MERN, MEVN, etc.)
  const frontendTemplate = path.join(__dirname, "..", "templates", stack, config.language, "client");
  const backendTemplate = path.join(__dirname, "..", "templates", stack, config.language, "server");

  const clientPath = path.join(projectPath, "client");
  const serverPath = path.join(projectPath, "server");

  logger.info("📂 Copying template files...");
  
  if (fs.existsSync(frontendTemplate)) {
    fs.copySync(frontendTemplate, clientPath);
  }
  
  if (fs.existsSync(backendTemplate)) {
    fs.copySync(backendTemplate, serverPath);
  }
}
