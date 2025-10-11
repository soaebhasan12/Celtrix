import { setupProject } from "../utils/project.js";

export async function createProject(projectName, config, installDeps = true) {
  return await setupProject(projectName, config, installDeps);
}
