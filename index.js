import inquirer from "inquirer";
import chalk from "chalk";
import { createProject } from "./commands/scaffold.js";

async function askFrameworkQuestions() {
  return await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Choose your frontend framework:",
      choices: [
        { name: "React with Vite", value: "react-vite" },
        { name: "Vue.js", value: "vue" },
        { name: "Angular", value: "angular" },
        { name: "Svelte", value: "svelte" },
      ],
      default: "react-vite",
    },
    {
      type: "list",
      name: "backend",
      message: "Choose your backend framework:",
      choices: [
        { name: "Express.js", value: "express" },
        { name: "Fastify", value: "fastify" },
        { name: "Koa.js", value: "koa" },
        { name: "NestJS", value: "nestjs" },
      ],
      default: "express",
    },
    {
      type: "list",
      name: "database",
      message: "Choose your database:",
      choices: [
        { name: "MongoDB", value: "mongodb" },
        { name: "PostgreSQL", value: "postgresql" },
        { name: "MySQL", value: "mysql" },
        { name: "SQLite", value: "sqlite" },
      ],
      default: "mongodb",
    },
    {
      type: "list",
      name: "language",
      message: "Choose your language preference:",
      choices: [
        { name: "JavaScript", value: "javascript" },
        { name: "TypeScript", value: "typescript" },
      ],
      default: "javascript",
    },
  ]);
}

async function askProjectName() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => {
        if (!input.trim()) return "Project name is required!";
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return "Project name can only contain letters, numbers, hyphens, and underscores.";
        }
        return true;
      },
    },
  ]);
  return projectName;
}

async function main() {
  console.log(chalk.blue("🚀 Welcome to Celtrix CLI!"));
  console.log(chalk.gray("Let's set up your full-stack project..."));

  let projectName = process.argv[2];
  let config;

  try {
    if (!projectName) {
      // ask project name first
      projectName = await askProjectName();
    }
    // always ask framework/backend/db/lang
    const frameworkAnswers = await askFrameworkQuestions();
    config = { ...frameworkAnswers, projectName };

    await createProject(projectName, config);
  } catch (err) {
    console.log(chalk.red("❌ Error: "), err.message);
    process.exit(1);
  }
}

main();
