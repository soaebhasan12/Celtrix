import { execSync } from "child_process";
import { logger } from "./logger.js";
import path from "path";
import fs from "fs";

export function installDependencies(projectPath, config, projectName) {
  logger.info("📦 Installing dependencies...");

  try {
    const clientDir = fs.existsSync(path.join(projectPath, "client"))
      ? path.join(projectPath, "client")
      : path.join(projectPath, "client");

    const serverDir = fs.existsSync(path.join(projectPath, "server"))
      ? path.join(projectPath, "server")
      : path.join(projectPath, "server");

    if (fs.existsSync(clientDir)) {
      execSync("npm install", { cwd: clientDir, stdio: "inherit", shell: true });
    }
    if (fs.existsSync(serverDir)) {
      execSync("npm install", { cwd: serverDir, stdio: "inherit", shell: true });
    }

    logger.info("✅ Dependencies installed successfully");
  } catch (err) {
    logger.error("❌ Failed to install dependencies");
    throw err;
  }
}


export function angularSetup(projectPath, config, projectName) {
  logger.info("⚡ Setting up Angular...");

  try {
    // Create Angular project (no Tailwind)
    execSync(`npx -y @angular/cli new client --style=css --skip-git --skip-install`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true, // fixes ENOENT
    });

    logger.info("✅ Angular project created successfully!");
  } catch (error) {
    logger.error("❌ Failed to set up Angular");
    throw error;
  }
}

export function angularTailwindSetup(projectPath, config, projectName) {
  logger.info("⚡ Setting up Angular + Tailwind...");

  try {
    // 1. Create Angular project (inside projectPath)
    execSync(`npx -y @angular/cli new client --style css`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    const clientPath = path.join(projectPath, "client");

    // 2. Install Tailwind + PostCSS
    execSync(`npm install tailwindcss @tailwindcss/postcss postcss --force`, {
      cwd: clientPath,
      stdio: "inherit",
      shell: true,
    });

    // 3. Create tailwind.config.js
    const tailwindConfigPath = path.join(clientPath, ".postcssrc.json");

    fs.writeFileSync(
      tailwindConfigPath,
      `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}`
    );

    // 4. Update styles.css with Tailwind directives
    const stylesPath = path.join(clientPath, "src/styles.css");
    fs.writeFileSync(
      stylesPath,
      `@import "tailwindcss";\n`

    );

    logger.info("✅ Angular + Tailwind setup completed!");
  } catch (error) {
    logger.error("❌ Failed to set up Angular Tailwind");
    throw error;
  }
}


// functions to handle Django project creation:
export function djangoSetup(projectPath, config, projectName) {
  logger.info("🐍 Setting up Django...");

  try {
    const serverDir = path.join(projectPath, "server");
    
    // Create virtual environment
    execSync(`python -m venv venv`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Activate venv and install Django
    const activateCmd = process.platform === "win32" 
      ? `venv\\Scripts\\activate && pip install django djangorestframework python-decouple`
      : `source venv/bin/activate && pip install django djangorestframework python-decouple`;

    execSync(activateCmd, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Create Django project
    const createProjectCmd = process.platform === "win32"
      ? `venv\\Scripts\\activate && django-admin startproject server .`
      : `source venv/bin/activate && django-admin startproject server .`;

    execSync(createProjectCmd, {
      cwd: serverDir,
      stdio: "inherit",
      shell: true,
    });

    logger.info("✅ Django project created successfully!");
  } catch (error) {
    logger.error("❌ Failed to set up Django");
    throw error;
  }
}

export function djangoReactSetup(projectPath, config, projectName) {
  logger.info("🐍⚛️ Setting up Django + React...");

  try {
    // First setup Django
    djangoSetup(projectPath, config, projectName);

    // Then setup React client
    const clientDir = path.join(projectPath, "client");
    execSync(`npx create-react-app client`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Install additional packages for React
    execSync(`npm install axios`, {
      cwd: clientDir,
      stdio: "inherit",
      shell: true,
    });

    logger.info("✅ Django + React setup completed!");
  } catch (error) {
    logger.error("❌ Failed to set up Django + React");
    throw error;
  }
}
