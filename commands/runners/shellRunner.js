import { execSync, spawn } from "child_process";
import { logger } from "../../utils/logger.js";
import path from "path";
import os from "os";

/**
 * Run shell command with proper error handling
 * 
 * @param {string} command - Command to execute
 * @param {object} options - Execution options
 * @param {string} options.cwd - Working directory
 * @param {boolean} options.venv - Whether to activate virtual environment
 * @param {boolean} options.shell - Use shell
 * @param {string} options.stdio - stdio mode ('inherit', 'pipe', 'ignore')
 */
export async function runShellCommand(command, options = {}) {
  const {
    cwd = process.cwd(),
    venv = false,
    shell = true,
    stdio = 'inherit'
  } = options;

  try {
    let finalCommand = command;

    // Virtual environment activate karna hai?
    if (venv) {
      finalCommand = getVenvActivatedCommand(command, cwd);
    }

    // Command execute karo
    execSync(finalCommand, {
      cwd: cwd,
      stdio: stdio,
      shell: shell,
      encoding: 'utf-8'
    });

    return { success: true };

  } catch (error) {
    logger.error(`Command failed: ${command}`);
    if (error.stderr) {
      logger.error(error.stderr.toString());
    }
    throw new Error(`Failed to execute: ${command}`);
  }
}

/**
 * Virtual environment ke saath command run karne ke liye
 * OS-specific activation command add karta hai
 */
function getVenvActivatedCommand(command, cwd) {
  const platform = os.platform();
  
  if (platform === 'win32') {
    // Windows
    const venvPath = path.join(cwd, 'venv', 'Scripts', 'activate.bat');
    return `${venvPath} && ${command}`;
  } else {
    // Linux/Mac
    const venvPath = path.join(cwd, 'venv', 'bin', 'activate');
    return `source ${venvPath} && ${command}`;
  }
}

/**
 * Check if command exists in system
 */
export function commandExists(command) {
  try {
    const checkCmd = os.platform() === 'win32' 
      ? `where ${command}` 
      : `which ${command}`;
    
    execSync(checkCmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get command version
 */
export function getCommandVersion(command, versionFlag = '--version') {
  try {
    const result = execSync(`${command} ${versionFlag}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Run Python command (helper function)
 */
export async function runPythonCommand(command, options = {}) {
  const pythonCmd = getPythonCommand();
  return runShellCommand(`${pythonCmd} ${command}`, options);
}

/**
 * Run pip command (helper function)
 */
export async function runPipCommand(command, options = {}) {
  const pythonCmd = getPythonCommand();
  return runShellCommand(`${pythonCmd} -m pip ${command}`, options);
}

/**
 * Get correct Python command (python vs python3)
 */
function getPythonCommand() {
  if (commandExists('python3')) {
    return 'python3';
  } else if (commandExists('python')) {
    return 'python';
  } else {
    throw new Error('Python is not installed or not in PATH');
  }
}

/**
 * Run npm command (helper function)
 */
export async function runNpmCommand(command, options = {}) {
  return runShellCommand(`npm ${command}`, options);
}