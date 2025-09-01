import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { createProject } from "./commands/scaffold.js";

function showBanner() {
  console.log(
    gradient.pastel(
      figlet.textSync("Celtrix", {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(chalk.gray("⚡ Setup Web-apps in seconds, not hours ⚡\n"));
}

console.log("\n")

async function askFrameworkQuestions() {
  return await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: gradient.pastel("🌐 Choose your frontend framework:"),
      choices: [
        new inquirer.Separator(chalk.gray("── Frontend ──")),
        { name: chalk.bold.green("⚡ React with Vite"), value: "react-vite" },
        { name: chalk.bold.yellow("🌿 Vue.js"), value: "vue" },
        { name: chalk.bold.red("🔺 Angular"), value: "angular" },
        { name: chalk.bold.magenta("🧡 Svelte"), value: "svelte" },
      ],
      pageSize: 10,
      default: "react-vite",
    },
    {
      type: "list",
      name: "backend",
      message: gradient.pastel("⚙️ Choose your backend framework:"),
      choices: [
        new inquirer.Separator(chalk.gray("── Backend ──")),
        { name: chalk.bold.green("🚂 Express.js"), value: "express" },
        { name: chalk.bold.blue("⚡ Fastify"), value: "fastify" },
        { name: chalk.bold.yellow("🍃 Koa.js"), value: "koa" },
        { name: chalk.bold.red("🏛️  NestJS"), value: "nestjs" },
      ],
      pageSize: 10,
      default: "express",
    },
    {
      type: "list",
      name: "database",
      message: gradient.pastel("🗄️ Choose your database:"),
      choices: [
        new inquirer.Separator(chalk.gray("── Databases ──")),
        { name: chalk.bold.green("🍃 MongoDB"), value: "mongodb" },
        { name: chalk.bold.blue("🐘 PostgreSQL"), value: "postgresql" },
        { name: chalk.bold.yellow("🐬 MySQL"), value: "mysql" },
        { name: chalk.bold.gray("📦 SQLite"), value: "sqlite" },
      ],
      pageSize: 10,
      default: "mongodb",
    },
    {
      type: "list",
      name: "language",
      message: gradient.pastel("💻 Choose your language preference:"),
      choices: [
        new inquirer.Separator(chalk.gray("── Languages ──")),
        { name: chalk.bold.yellow("✨ JavaScript"), value: "javascript" },
        { name: chalk.bold.blue("🔷 TypeScript"), value: "typescript" },
      ],
      pageSize: 10,
      default: "javascript",
    },
  ]);
}

async function askProjectName() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: chalk.cyan("📦 Enter your project name:"),
      validate: (input) => {
        if (!input.trim()) return chalk.red("Project name is required!");
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return chalk.red(
            "Only letters, numbers, hyphens, and underscores are allowed."
          );
        }
        return true;
      },
    },
  ]);
  return projectName;
}

async function main() {
  showBanner();

  let projectName = process.argv[2];
  let config;

  try {
    if (!projectName) {
      projectName = await askProjectName();
    }
    const frameworkAnswers = await askFrameworkQuestions();
    config = { ...frameworkAnswers, projectName };

    console.log(chalk.yellow("\n🚀 Creating your project...\n"));
    await createProject(projectName, config);

  } catch (err) {
    console.log(chalk.red("❌ Error:"), err.message);
    process.exit(1);
  }
}

main();
