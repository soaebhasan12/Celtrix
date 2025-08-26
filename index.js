#!/usr/bin/env node
import fs from "fs-extra";
import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

// Get dirname of this file (inside npm package)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run interactive prompts
async function runInteractiveMode() {
  console.log(chalk.blue("🚀 Welcome to Celtrix CLI!"));
  console.log(chalk.gray("Let's set up your full-stack project..."));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Choose your frontend framework:',
      choices: [
        { name: 'React with Vite', value: 'react-vite' },
        { name: 'Vue.js', value: 'vue' },
        { name: 'Angular', value: 'angular' },
        { name: 'Svelte', value: 'svelte' }
      ],
      default: 'react-vite'
    },
    {
      type: 'list',
      name: 'backend',
      message: 'Choose your backend framework:',
      choices: [
        { name: 'Express.js', value: 'express' },
        { name: 'Fastify', value: 'fastify' },
        { name: 'Koa.js', value: 'koa' },
        { name: 'NestJS', value: 'nestjs' }
      ],
      default: 'express'
    },
    {
      type: 'list',
      name: 'database',
      message: 'Choose your database:',
      choices: [
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'SQLite', value: 'sqlite' }
      ],
      default: 'mongodb'
    },
    {
      type: 'list',
      name: 'language',
      message: 'Choose your language preference:',
      choices: [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' }
      ],
      default: 'javascript'
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Project name is required!';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores.';
        }
        return true;
      }
    }
  ]);
  
  return answers;
}

// Function to create project with old behavior
function createProject(projectName, config = {}) {
  const {
    framework = 'react-vite',
    backend = 'express',
    database = 'mongodb',
    language = 'javascript'
  } = config;
  
  console.log(chalk.blue(`📋 Project Configuration:`));
  console.log(chalk.gray(`   Framework: ${framework}`));
  console.log(chalk.gray(`   Backend: ${backend}`));
  console.log(chalk.gray(`   Database: ${database}`));
  console.log(chalk.gray(`   Language: ${language}`));
  console.log();
  
  // Source templates inside your package
  const clientTemplate = path.join(__dirname, "templates", "client");
  const serverTemplate = path.join(__dirname, "templates", "server");
  
  // Destination in user's project
  const projectPath = path.join(process.cwd(), projectName);
  const clientPath = path.join(projectPath, "client");
  const serverPath = path.join(projectPath, "server");
  
  // Copy templates
  console.log(chalk.blue("📂 Copying template files..."));
  fs.copySync(clientTemplate, clientPath);
  fs.copySync(serverTemplate, serverPath);
  
  console.log(chalk.blue("📦 Installing dependencies..."));
  
  // Install client dependencies
  execSync("npm install", { cwd: clientPath, stdio: "inherit" });
  
  // Install server dependencies
  execSync("npm install", { cwd: serverPath, stdio: "inherit" });
  
  console.log(chalk.blue("-----------------------------------------------------"));
  console.log(chalk.green(`✅ MERN app '${projectName}' created successfully!`));
  console.log(chalk.blue("-----------------------------------------------------"));
  console.log(chalk.yellow(`👉 cd ${projectName}/client && npm run dev`));
  console.log(chalk.yellow(`👉 cd ${projectName}/server && npm start`));
  console.log(chalk.blue("-----------------------------------------------------"));
  console.log(chalk.white("✨ Made with ❤️  by Joe Celaster ✨"));
  console.log(chalk.blue("-----------------------------------------------------"));
}

// Main execution
async function main() {
  const projectName = process.argv[2];
  
  // If no project name provided, run interactive mode
  if (!projectName) {
    try {
      const config = await runInteractiveMode();
      await createProject(config.projectName, {
        framework: config.framework,
        backend: config.backend,
        database: config.database,
        language: config.language
      });
    } catch (error) {
      if (error.isTtyError) {
        console.log(chalk.red("❌ Interactive mode requires a TTY environment"));
        console.log(chalk.green("👉 Example: npx celtrix myapp"));
      } else {
        console.log(chalk.red("❌ An error occurred:"), error.message);
      }
      process.exit(1);
    }
  } else {
    // Legacy behavior: project name provided as argument
    createProject(projectName);
  }
}

main().catch(console.error);
