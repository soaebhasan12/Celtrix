import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import boxen from "boxen";
import { logger } from "./logger.js";
import { copyTemplates } from "./templateManager.js";
import { HonoReactSetup,mernTailwindSetup, installDependencies, mernSetup, serverAuthSetup, serverSetup, mevnSetup } from "./installer.js";
import { angularSetup, angularTailwindSetup, djangoSetup } from "./installer.js";

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
    ${chalk.bold("📖 Language:")}  ${chalk.red(config.language)}
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

  // --- Copy & Install ---
  if(config.stack !== "mean" && config.stack !== "mean+tailwind+auth" && config.stack!=="hono"){
    copyTemplates(projectPath, config);
    installDependencies(projectPath, config, projectName);
  }

  if(config.stack==="mern+tailwind+auth"){
    mernSetup(projectPath,config,projectName);
    copyTemplates(projectPath, config);
    mernTailwindSetup(projectPath, config, projectName);
    installDependencies(projectPath, config, projectName);
    serverAuthSetup(projectPath,config,projectName);
  }

  if(config.stack === 'mevn'){
    mevnSetup(projectPath,config,projectName)
    copyTemplates(projectPath,config)
    installDependencies(projectPath,config,projectName)
    serverSetup(projectPath,config,projectName)
  }

  if(config.stack === "mean"){
    angularSetup(projectPath, config);
    installDependencies(projectPath, config, projectName);
    copyTemplates(projectPath, config);
    serverSetup(projectPath,config,projectName)
  }
  
  if(config.stack === "mean+tailwind+auth"){
    angularTailwindSetup(projectPath, config, projectName);
    installDependencies(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  }
  
  if(config.stack === "hono"){
   try{

     HonoReactSetup(projectPath,config,projectName);
     installDependencies(projectPath, config, projectName,false);
    }
    catch{
      copyTemplates(projectPath, config);
    }
  }

  if (config.stack ==="mern") {
    mernSetup(projectPath,config,projectName);
    copyTemplates(projectPath, config);
    installDependencies(projectPath, config, projectName,false,[])
  }

  if(config.stack === "django"){
    djangoSetup(projectPath, config, projectName);
    copyTemplates(projectPath, config);
  }

  // --- Success + Next Steps ---
  console.log(chalk.gray("-------------------------------------------"))
  console.log(`${chalk.greenBright(`✅ Project ${chalk.bold.yellow(`${projectName}`)} created successfully! 🎉`)}`);
  console.log(chalk.gray("-------------------------------------------"))
  console.log(chalk.cyan("👉 Next Steps:\n"));
  
  if(config.stack === "mean" || config.stack === "mean+tailwind+auth") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm start")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`);
  } else if(config.stack === "t3-stack") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/t3-app && ${chalk.green("npm run dev")}`);
  }else if(config.stack==="hono"){
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm run dev")}`);
  }else if(config.stack === "django") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server`);
    console.log(`   ${chalk.green("venv\\Scripts\\activate")}  ${chalk.gray("(Windows)")}`);
    console.log(`   ${chalk.green("source venv/bin/activate")}  ${chalk.gray("(Mac/Linux)")}`);
    console.log(`   ${chalk.green("pip install -r requirements.txt")}`);
    console.log(`   ${chalk.green("python manage.py migrate")}`);
    console.log(`   ${chalk.green("python manage.py runserver")}`);
  }
  else {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`);
  }
  
  console.log(chalk.gray("-------------------------------------------"))
  console.log(chalk.gray("\n✨ Made with ❤️  by Celtrix ✨\n"));
}