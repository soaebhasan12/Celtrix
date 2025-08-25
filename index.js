#!/usr/bin/env node

import fs from 'fs-extra';
import chalk from 'chalk'; // if using ES modules
import { execSync } from 'child_process';
// const chalk = require('chalk');
// const chalk = require('chalk');
console.log(chalk.blue("Installing dependencies..."));


const projectName = process.argv[2];

if (!projectName) {
  console.log(chalk.red("Please provide a project name:"));
  console.log(chalk.green("npx celaster myapp"));
  process.exit(1);
}

// Copy templates
fs.copySync('./templates/client', `./${projectName}/client`);
fs.copySync('./templates/server', `./${projectName}/server`);

console.log(chalk.blue("Installing dependencies..."));

// Install client dependencies
execSync('npm install', { cwd: `./${projectName}/client`, stdio: 'inherit' });

// Install server dependencies
execSync('npm install', { cwd: `./${projectName}/server`, stdio: 'inherit' });
console.log(chalk.blue("-----------------------------------------------------"));
console.log(chalk.green(`✅ MERN app ${projectName} created successfully!`));
console.log(chalk.blue("-----------------------------------------------------"));
console.log(chalk.yellow(`Run: cd ${projectName}/client && npm run dev`));
console.log(chalk.yellow(`Run: cd ${projectName}/server && npm start`));
console.log(chalk.blue("-----------------------------------------------------"));
console.log(chalk.white("Made with ❤️  by Joe Celaster."));
console.log(chalk.blue("-----------------------------------------------------"));