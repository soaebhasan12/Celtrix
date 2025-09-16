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





// Check if Python is installed
export function checkPythonInstallation() {
  try {
    execSync('python --version', { stdio: 'ignore' });
    return 'python';
  } catch {
    try {
      execSync('python3 --version', { stdio: 'ignore' });
      return 'python3';
    } catch {
      logger.error("❌ Python is not installed. Please install Python 3.8+ first.");
      throw new Error("Python not found");
    }
  }
}

// Basic Django setup
export async function djangoSetup(projectPath, config, projectName) {
  logger.info("🐍 Setting up Django...");

  try {
    const pythonCmd = checkPythonInstallation();
    const serverDir = path.join(projectPath, "server");
    fs.mkdirSync(serverDir, { recursive: true });
    
    // Create virtual environment in project root
    logger.info("📦 Creating virtual environment...");
    execSync(`${pythonCmd} -m venv venv`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Determine activation command based on platform
    const activateCmd = process.platform === "win32" 
      ? `venv\\Scripts\\activate`
      : `source venv/bin/activate`;

    // Install Django and dependencies
    logger.info("📥 Installing Django and dependencies...");
    const installCmd = process.platform === "win32"
      ? `${activateCmd} && pip install django djangorestframework python-decouple corsheaders pillow`
      : `${activateCmd} && pip install django djangorestframework python-decouple corsheaders pillow`;

    execSync(installCmd, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Create Django project
    logger.info("🏗️ Creating Django project structure...");
    const createProjectCmd = process.platform === "win32"
      ? `${activateCmd} && django-admin startproject ${projectName}_backend .`
      : `${activateCmd} && django-admin startproject ${projectName}_backend .`;

    execSync(createProjectCmd, {
      cwd: serverDir,
      stdio: "inherit",
      shell: true,
    });

    // Create API app
    const createAppCmd = process.platform === "win32"
      ? `${activateCmd} && python manage.py startapp api`
      : `${activateCmd} && python manage.py startapp api`;

    execSync(createAppCmd, {
      cwd: serverDir,
      stdio: "inherit",
      shell: true,
    });

    // Create requirements.txt
    const requirements = `Django>=4.2.0
djangorestframework>=3.14.0
python-decouple>=3.8
django-cors-headers>=4.0.0
Pillow>=10.0.0`;

    fs.writeFileSync(path.join(projectPath, "requirements.txt"), requirements);

    logger.info("✅ Django project created successfully!");
  } catch (error) {
    logger.error("❌ Failed to set up Django");
    throw error;
  }
}

// Django + React setup
export async function djangoReactSetup(projectPath, config, projectName) {
  logger.info("🐍⚛️ Setting up Django + React...");

  try {
    // First setup Django
    await djangoSetup(projectPath, config, projectName);

    // Then setup React client
    logger.info("⚛️ Creating React application...");
    execSync(`npx create-react-app client`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Install additional packages for React
    const clientDir = path.join(projectPath, "client");
    logger.info("📥 Installing React dependencies...");
    execSync(`npm install axios react-router-dom`, {
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

// Django + Vue setup
export async function djangoVueSetup(projectPath, config, projectName) {
  logger.info("🐍💚 Setting up Django + Vue.js...");

  try {
    // First setup Django
    await djangoSetup(projectPath, config, projectName);

    // Then setup Vue client
    logger.info("💚 Creating Vue.js application...");
    execSync(`npm create vue@latest client -- --yes`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Install additional packages for Vue
    const clientDir = path.join(projectPath, "client");
    logger.info("📥 Installing Vue dependencies...");
    execSync(`npm install && npm install axios vue-router`, {
      cwd: clientDir,
      stdio: "inherit",
      shell: true,
    });

    logger.info("✅ Django + Vue.js setup completed!");
  } catch (error) {
    logger.error("❌ Failed to set up Django + Vue");
    throw error;
  }
}

// Django + PostgreSQL setup
export async function djangoPostgresSetup(projectPath, config, projectName) {
  logger.info("🐍🐘 Setting up Django + PostgreSQL...");

  try {
    const pythonCmd = checkPythonInstallation();
    const serverDir = path.join(projectPath, "server");
    fs.mkdirSync(serverDir, { recursive: true });
    
    // Create virtual environment
    logger.info("📦 Creating virtual environment...");
    execSync(`${pythonCmd} -m venv venv`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    const activateCmd = process.platform === "win32" 
      ? `venv\\Scripts\\activate`
      : `source venv/bin/activate`;

    // Install Django with PostgreSQL dependencies
    logger.info("📥 Installing Django with PostgreSQL support...");
    const installCmd = process.platform === "win32"
      ? `${activateCmd} && pip install django djangorestframework python-decouple corsheaders pillow psycopg2-binary`
      : `${activateCmd} && pip install django djangorestframework python-decouple corsheaders pillow psycopg2-binary`;

    execSync(installCmd, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    // Create Django project
    logger.info("🏗️ Creating Django project with PostgreSQL...");
    const createProjectCmd = process.platform === "win32"
      ? `${activateCmd} && django-admin startproject ${projectName}_backend .`
      : `${activateCmd} && django-admin startproject ${projectName}_backend .`;

    execSync(createProjectCmd, {
      cwd: serverDir,
      stdio: "inherit",
      shell: true,
    });

    // Create API app
    const createAppCmd = process.platform === "win32"
      ? `${activateCmd} && python manage.py startapp api`
      : `${activateCmd} && python manage.py startapp api`;

    execSync(createAppCmd, {
      cwd: serverDir,
      stdio: "inherit",
      shell: true,
    });

    // Create requirements.txt with PostgreSQL
    const requirements = `Django>=4.2.0
djangorestframework>=3.14.0
python-decouple>=3.8
django-cors-headers>=4.0.0
Pillow>=10.0.0
psycopg2-binary>=2.9.0`;

    fs.writeFileSync(path.join(projectPath, "requirements.txt"), requirements);

    // Create .env file template
    const envTemplate = `# Database Configuration
DB_NAME=${projectName}_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True`;

    fs.writeFileSync(path.join(projectPath, ".env.example"), envTemplate);

    logger.info("✅ Django + PostgreSQL setup completed!");
    logger.warn("⚠️  Don't forget to:");
    logger.warn("   1. Install PostgreSQL on your system");
    logger.warn("   2. Create a database and user");
    logger.warn("   3. Copy .env.example to .env and update database credentials");
  } catch (error) {
    logger.error("❌ Failed to set up Django + PostgreSQL");
    throw error;
  }
}
