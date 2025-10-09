import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import boxen from "boxen";
import { logger } from "./logger.js";
import { copyTemplates } from "./templateManager.js";
import { HonoReactSetup,mernTailwindSetup, installDependencies, mernSetup, serverAuthSetup, serverSetup, mevnSetup, mevnTailwindAuthSetup } from "./installer.js";
import { angularSetup, angularTailwindSetup } from "./installer.js";

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

  if (config.stack ==="mern") {
    mernSetup(projectPath,config,projectName);
    copyTemplates(projectPath, config);
    installDependencies(projectPath, config, projectName,false,[])
  }

  if(config.stack==="mern+tailwind+auth"){
    // Setup MERN first (includes client setup)
    await mernSetup(projectPath, config, projectName);
    
    // Copy templates
    await copyTemplates(projectPath, config);
    
    // Setup Tailwind (no need to install deps again)
    await mernTailwindSetup(projectPath, config, projectName);
    
    // Setup server with auth (handles its own deps)
    await serverAuthSetup(projectPath, config, projectName);
  }

  if(config.stack === 'mevn'){
    try{
      mevnSetup(projectPath,config,projectName)
      copyTemplates(projectPath,config)
      installDependencies(projectPath,config,projectName)

      try {
        serverSetup(projectPath,config,projectName);
      } catch (error) {
        logger.warn("⚠️  Server setup had issues, but continuing with client setup");
        logger.warn(error.message);
      }
    }
    catch(error){
      logger.error("❌ Failed to set up MEVN");
      throw error;
    }
  }

  if(config.stack === 'mevn+tailwind+auth'){
    try {
      // 1. Set up MEVN + Tailwind + Auth
      mevnTailwindAuthSetup(projectPath, config, projectName);
      
      // 2. Copy templates
      copyTemplates(projectPath, config);
      
      // 3. Install dependencies
      installDependencies(projectPath, config, projectName);
      
      // 4. Try to set up server auth (but don't fail if it doesn't work)
      try {
        serverAuthSetup(projectPath, config, projectName);
      } catch (serverError) {
        logger.warn("⚠️  Server setup had issues, but continuing with client setup");
        logger.warn(serverError.message);
      }
    } catch (error) {
      logger.error("❌ Failed to set up MEVN+tailwind+auth");
      logger.error(error.message);
      throw error;
    }
  }

  if(config.stack === "mean"){
    try {
      // First create Angular project
      angularSetup(projectPath, config, projectName);
      
      // Then copy templates
      copyTemplates(projectPath, config);
      
      // Then install dependencies
      installDependencies(projectPath, config, projectName);
      
      // Try server setup separately and don't let it fail the entire process
      try {
        serverSetup(projectPath, config, projectName);
      } catch (serverError) {
        logger.warn("⚠️  Server setup had issues, but continuing with client setup");
        logger.warn(serverError.message);
      }
    } catch (error) {
      logger.error("❌ Failed to set up MEAN stack");
      throw error;
    }
  }
  
  if(config.stack === "mean+tailwind+auth"){
    try {
      // 1. Set up Angular + Tailwind
      angularTailwindSetup(projectPath, config, projectName);
      
      // 2. Copy templates
      copyTemplates(projectPath, config);
      
      // 3. Install dependencies
      installDependencies(projectPath, config, projectName);
      
      // 4. Try to set up server auth (but don't fail if it doesn't work)
      try {
        serverAuthSetup(projectPath, config, projectName);
      } catch (serverError) {
        logger.warn("⚠️  Server setup had issues, but continuing with client setup");
        logger.warn(serverError.message);
      }
    }
    catch(error){
      logger.error("❌ Failed to set up MEAN+tailwind+Auth stack");
      throw error;
    }
  }


  if(config.stack === "react+tailwind+firebase"){
    copyTemplates(projectPath, config);
    installDependencies(projectPath, config, projectName);
  }

  
  if(config.stack === "hono"){
   try{
     HonoReactSetup(projectPath,config,projectName);
     copyTemplates(projectPath, config);
     installDependencies(projectPath, config, projectName,false);
    }
    catch{
      copyTemplates(projectPath, config);
    }
  }

  if(config.stack==='t3-stack'){
    try {
      // Copy template files
      copyTemplates(projectPath, config, projectName);
      
      // Install all dependencies (both client and server)
      installDependencies(projectPath, config, projectName);
      
      logger.info("✅ T3 stack project created successfully!");
    } catch (error) {
      logger.error("❌ Failed to set up T3 stack");
      logger.error(error.message);
      throw error;
    }
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

  } else if(config.stack === "react+tailwind+firebase") {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.gray("📝 Don't forget to configure your Firebase project in .env file!")}`);

  }else if(config.stack==="hono"){
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm run dev")}`);
  } else {
    console.log(`   ${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`);
    console.log(`   ${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`);
  }
  
  console.log(chalk.gray("-------------------------------------------"))
  console.log(chalk.gray("\n✨ Made with ❤️  by Celtrix ✨\n"));
}
