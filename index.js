#!/usr/bin/env node

import fs from "fs-extra";
import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Get dirname of this file (inside npm package)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
  console.log(chalk.red("❌ Please provide a project name:"));
  console.log(chalk.green("👉 Example: npx celtrix myapp"));
  process.exit(1);
}

// Source templates inside your package
const clientTemplate = path.join(__dirname, "templates", "client");
const serverTemplate = path.join(__dirname, "templates", "server");

// Destination in user’s project
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