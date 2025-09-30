import chalk from "chalk";

/**
 * Django + React Stack Configuration
 * PostgreSQL + Django REST Framework + React + JWT Auth
 */
export function getDjangoReactStack() {
  return {
    name: "Django + React + PostgreSQL",
    description: "Full-stack application with Django REST Framework backend and React frontend",

    // Prerequisites check
    requirements: {
      python: ">=3.8",
      node: ">=16",
      pip: true,
      npm: true
    },

    // Setup commands to execute
    setupCommands: [
      // ========== BACKEND SETUP ==========
      {
        name: "Creating project directories",
        command: "mkdir server client",
        cwd: "{{projectPath}}"
      },
      {
        name: "Creating Python virtual environment",
        command: "python -m venv venv",
        cwd: "{{projectPath}}/server"
      },
      {
        name: "Upgrading pip",
        command: "pip install --upgrade pip",
        cwd: "{{projectPath}}/server",
        venv: true
      },
      {
        name: "Installing Django and dependencies",
        command: "pip install django djangorestframework django-cors-headers psycopg2-binary djangorestframework-simplejwt python-decouple",
        cwd: "{{projectPath}}/server",
        venv: true
      },
      {
        name: "Creating Django project",
        command: "django-admin startproject backend .",
        cwd: "{{projectPath}}/server",
        venv: true
      },
      {
        name: "Creating API app",
        command: "python manage.py startapp api",
        cwd: "{{projectPath}}/server",
        venv: true
      },
      {
        name: "Creating authentication app",
        command: "python manage.py startapp authentication",
        cwd: "{{projectPath}}/server",
        venv: true
      },

      // ========== FRONTEND SETUP ==========
      {
        name: "Creating React application",
        command: "npx create-react-app .",
        cwd: "{{projectPath}}/client",
        silent: false
      },
      {
        name: "Installing React dependencies",
        command: "npm install axios react-router-dom",
        cwd: "{{projectPath}}/client"
      }
    ],

    // File modifications after generation
    fileModifications: [
      {
        name: "Configure Django settings.py",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.modifyDjangoSettings(projectPath, config);
        }
      },
      {
        name: "Configure Django urls.py",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.modifyDjangoUrls(projectPath, config);
        }
      },
      {
        name: "Create requirements.txt",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.createRequirementsTxt(projectPath);
        }
      },
      {
        name: "Create API serializers and views",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.createApiBoilerplate(projectPath, config);
        }
      },
      {
        name: "Create authentication views",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.createAuthBoilerplate(projectPath, config);
        }
      },
      {
        name: "Configure React API service",
        modify: async (projectPath, config, fileModifier) => {
          await fileModifier.createReactApiService(projectPath);
        }
      }
    ],

    // Environment file generation
    envGenerator: async (projectPath, config, envGenerator) => {
      await envGenerator.generateDjangoEnv(projectPath, config);
      await envGenerator.generateReactEnv(projectPath);
    },

    // Next steps to display after setup
    nextSteps: [
      chalk.yellow("\n📌 Backend Setup:"),
      chalk.white("   cd {{projectName}}/server"),
      chalk.gray("   # Activate virtual environment:"),
      chalk.cyan("   source venv/bin/activate") + chalk.gray("  (Linux/Mac)"),
      chalk.cyan("   venv\\Scripts\\activate") + chalk.gray("     (Windows)"),
      chalk.gray("   # Configure database in .env file, then:"),
      chalk.green("   python manage.py migrate"),
      chalk.green("   python manage.py createsuperuser"),
      chalk.green("   python manage.py runserver"),
      
      chalk.yellow("\n📌 Frontend Setup:"),
      chalk.white("   cd {{projectName}}/client"),
      chalk.green("   npm start"),
      
      chalk.yellow("\n🔗 URLs:"),
      chalk.cyan("   Backend API:    ") + chalk.white("http://localhost:8000/api/"),
      chalk.cyan("   Admin Panel:    ") + chalk.white("http://localhost:8000/admin/"),
      chalk.cyan("   Frontend:       ") + chalk.white("http://localhost:3000/"),
      
      chalk.yellow("\n📚 Database Setup:"),
      chalk.gray("   1. Install PostgreSQL from https://www.postgresql.org/"),
      chalk.gray("   2. Create a database: ") + chalk.cyan("createdb {{projectName}}_db"),
      chalk.gray("   3. Update credentials in server/.env"),
      chalk.gray("   4. Run migrations: ") + chalk.cyan("python manage.py migrate"),
    ]
  };
}