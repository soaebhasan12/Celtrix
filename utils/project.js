import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import boxen from "boxen";
import { logger } from "./logger.js";
import { copyTemplates } from "./templateManager.js";
import { installDependencies } from "./installer.js";
import { angularSetup, angularTailwindSetup, djangoSetup, djangoReactSetup, djangoVueSetup, djangoPostgresSetup } from "./installer.js";

export async function setupProject(projectName, config) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    logger.error(`❌ Directory ${chalk.red(projectName)} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);

  // --- Pretty Project Config (Boxed) ---
  const configText = `
    ${chalk.bold("🌐 Stack:")}  ${chalk.green(config.stack)}
    ${chalk.bold("📦 Project Name:")}  ${chalk.blue(projectName)}
    ${chalk.bold("📖 Language:")}  ${chalk.red(config.language || 'N/A')}
    `;

  console.log(
    boxen(configText, {
      padding: 1,
      margin: 1,
      borderColor: "cyan",
      borderStyle: "round",
      title: chalk.cyanBright("📋 Project Configuration"),
      titleAlignment: "center",
    })
  );

  // --- Django Stack Handling ---
  if (config.stack === "django") {
    await djangoSetup(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  } else if (config.stack === "django+react") {
    await djangoReactSetup(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  } else if (config.stack === "django+vue") {
    await djangoVueSetup(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  } else if (config.stack === "django+postgres") {
    await djangoPostgresSetup(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  }
  
  // --- Existing Stack Handling ---
  else if (config.stack !== "mean" && config.stack !== "mean+tailwind+auth" && !config.stack.startsWith('django')) {
    copyTemplates(projectPath, config);
    installDependencies(projectPath, config, projectName);
  }
  
  // --- MEAN Stack Handling ---
  else if (config.stack === "mean") {
    angularSetup(projectPath, config);
    installDependencies(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  }
  else if (config.stack === "mean+tailwind+auth") {
    angularTailwindSetup(projectPath, config, projectName);
    installDependencies(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  }

  // --- Success + Next Steps ---
  console.log(chalk.gray("-------------------------------------------"));
  console.log(`${chalk.greenBright(`✅ Project ${chalk.bold.yellow(`${projectName}`)} created successfully! 🎉`)}`);
  console.log(chalk.gray("-------------------------------------------"));
  console.log(chalk.cyan("👉 Next Steps:\n"));
  
  // --- Django Next Steps ---
  if (config.stack.startsWith('django')) {
    const activateCmd = process.platform === "win32" 
      ? `${projectName}\\venv\\Scripts\\activate`
      : `source ${projectName}/venv/bin/activate`;
    
    console.log(`   ${chalk.yellow("cd")} ${projectName}`);
    console.log(`   ${chalk.green(activateCmd)}`);
    console.log(`   ${chalk.green("python server/manage.py migrate")}`);
    console.log(`   ${chalk.green("python server/manage.py runserver")}`);
    
    if (config.stack === "django+react") {
      console.log(`\n   ${chalk.gray("🌐 For the React frontend (in another terminal):")}`);
      console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm start")}`);
    } else if (config.stack === "django+vue") {
      console.log(`\n   ${chalk.gray("🌐 For the Vue.js frontend (in another terminal):")}`);
      console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    }
    
    console.log(`\n   ${chalk.gray("📝 Additional Django commands:")}`);
    console.log(`   ${chalk.green("python server/manage.py createsuperuser")} ${chalk.gray("(create admin user)")}`);
    console.log(`   ${chalk.green("python server/manage.py startapp <app_name>")} ${chalk.gray("(create new app)")}`);
  }
  
  // --- Angular/MEAN Next Steps ---
  else if (config.stack === "mean" || config.stack === "mean+tailwind+auth") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("ng serve")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`);
  } 
  
  // --- T3 Stack Next Steps ---
  else if (config.stack === "t3-stack") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/t3-app && ${chalk.green("npm run dev")}`);
  } 
  
  // --- Default MERN/MEVN Next Steps ---
  else {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`);
  }
  
  // --- Additional Info for Django ---
  if (config.stack.startsWith('django')) {
    console.log(`\n   ${chalk.gray("🔧 Useful URLs:")}`);
    console.log(`   ${chalk.blue("Django Admin:")} ${chalk.underline("http://127.0.0.1:8000/admin/")}`);
    console.log(`   ${chalk.blue("API Endpoints:")} ${chalk.underline("http://127.0.0.1:8000/api/")}`);
    
    if (config.stack === "django+react") {
      console.log(`   ${chalk.blue("React App:")} ${chalk.underline("http://localhost:3000/")}`);
    } else if (config.stack === "django+vue") {
      console.log(`   ${chalk.blue("Vue App:")} ${chalk.underline("http://localhost:8080/")}`);
    }
  }
  
  console.log(chalk.gray("-------------------------------------------"));
  console.log(chalk.gray("\n✨ Made with ❤️  by Celtrix ✨\n"));
}
