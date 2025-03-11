#!/usr/bin/env node

/**
 * Mouse Aim Trainer Installation Script
 * This script helps users install and set up the Mouse Aim Trainer application.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");
const readline = require("readline");

// Configuration
const APP_NAME = "MouseAimTrainer";
const APP_VERSION = "1.0.0";

// Default installation paths
const DEFAULT_INSTALL_PATHS = {
  win32: path.join(process.env.PROGRAMFILES || "C:\\Program Files", APP_NAME),
  darwin: path.join("/Applications", `${APP_NAME}.app`),
  linux: path.join("/opt", APP_NAME.toLowerCase()),
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Main function to run the installation process
 */
async function main() {
  console.log(`\n=== Mouse Aim Trainer Installation (v${APP_VERSION}) ===\n`);

  try {
    // Parse command line arguments
    const args = parseArguments();

    if (args.uninstall) {
      await uninstallApplication();
      return;
    }

    // Check prerequisites
    if (!checkPrerequisites()) {
      console.log("\nInstallation aborted due to missing prerequisites.\n");
      process.exit(1);
    }

    // Get installation path
    const installPath = await getInstallationPath(args.installPath);

    // Install dependencies
    if (!args.noDeps) {
      await installDependencies();
    }

    // Copy application files
    await copyApplicationFiles(installPath);

    // Create configuration file
    createConfigFile(installPath);

    // Create shortcuts
    if (!args.noShortcuts) {
      createShortcuts(installPath);
    }

    console.log(
      `\n✅ Mouse Aim Trainer has been successfully installed to: ${installPath}\n`,
    );
    console.log(
      "You can now start the application from the created shortcuts or by running:",
    );
    console.log(`  cd ${installPath} && npm start\n`);
  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}\n`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    installPath: null,
    noDeps: false,
    noShortcuts: false,
    dev: false,
    uninstall: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--install-path" && i + 1 < args.length) {
      options.installPath = args[++i];
    } else if (arg === "--no-deps") {
      options.noDeps = true;
    } else if (arg === "--no-shortcuts") {
      options.noShortcuts = true;
    } else if (arg === "--dev") {
      options.dev = true;
    } else if (arg === "--uninstall") {
      options.uninstall = true;
    } else if (arg === "--help") {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
Mouse Aim Trainer Installation Script

Usage: node setup.js [options]

Options:
  --install-path <path>  Specify custom installation path
  --no-deps             Skip installing dependencies
  --no-shortcuts        Skip creating desktop and start menu shortcuts
  --dev                 Install in development mode
  --uninstall           Uninstall the application
  --help                Show this help information
`);
}

/**
 * Check if all prerequisites are met
 */
function checkPrerequisites() {
  console.log("Checking prerequisites...");

  // Check Node.js version
  const nodeVersion = process.version;
  const versionMatch = nodeVersion.match(/v(\d+)\.(\d+)\.(\d+)/);

  if (!versionMatch || parseInt(versionMatch[1]) < 14) {
    console.error(
      `❌ Node.js 14.0.0 or higher is required. Current version: ${nodeVersion}`,
    );
    return false;
  }
  console.log(`✅ Node.js ${nodeVersion}`);

  // Check npm
  try {
    const npmVersion = execSync("npm --version").toString().trim();
    console.log(`✅ npm ${npmVersion}`);
  } catch (error) {
    console.error("❌ npm is not installed or not in PATH");
    return false;
  }

  return true;
}

/**
 * Get the installation path from user or use default
 */
async function getInstallationPath(customPath) {
  const platform = os.platform();
  const defaultPath =
    DEFAULT_INSTALL_PATHS[platform] || path.join(os.homedir(), APP_NAME);

  if (customPath) {
    return customPath;
  }

  return new Promise((resolve) => {
    rl.question(`Installation path [${defaultPath}]: `, (answer) => {
      const installPath = answer.trim() || defaultPath;
      resolve(installPath);
    });
  });
}

/**
 * Install dependencies
 */
async function installDependencies() {
  console.log("\nInstalling dependencies...");

  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully");
    return true;
  } catch (error) {
    console.error(`❌ Failed to install dependencies: ${error.message}`);
    throw new Error("Dependency installation failed");
  }
}

/**
 * Copy application files to installation directory
 */
async function copyApplicationFiles(installPath) {
  console.log(`\nCopying application files to ${installPath}...`);

  // Create installation directory if it doesn't exist
  if (!fs.existsSync(installPath)) {
    fs.mkdirSync(installPath, { recursive: true });
  }

  // Files and directories to copy
  const filesToCopy = [
    "package.json",
    "package-lock.json",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.node.json",
    "public",
    "src",
    "components.json",
    "postcss.config.js",
    "tailwind.config.js",
    "README.md",
  ];

  // Files to exclude
  const excludePatterns = ["node_modules", "dist", ".git", "tempobook"];

  try {
    // Get source directory (current directory)
    const sourceDir = process.cwd();

    // Copy each file/directory
    for (const item of filesToCopy) {
      const sourcePath = path.join(sourceDir, item);
      const destPath = path.join(installPath, item);

      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️ Skipping ${item} (not found)`);
        continue;
      }

      // Check if it's a directory
      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath, excludePatterns);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }

      console.log(`✅ Copied ${item}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Failed to copy application files: ${error.message}`);
    throw new Error("File copying failed");
  }
}

/**
 * Recursively copy a directory
 */
function copyDirectory(source, destination, excludePatterns) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read directory contents
  const files = fs.readdirSync(source);

  for (const file of files) {
    // Skip excluded patterns
    if (excludePatterns.some((pattern) => file.includes(pattern))) {
      continue;
    }

    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(sourcePath, destPath, excludePatterns);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Create configuration file
 */
function createConfigFile(installPath) {
  console.log("\nCreating configuration file...");

  const configPath = path.join(installPath, "config.json");
  const configData = {
    version: APP_VERSION,
    installPath: installPath,
    installDate: new Date().toISOString(),
    platform: os.platform(),
    arch: os.arch(),
  };

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  console.log("✅ Configuration file created");
}

/**
 * Create desktop and start menu shortcuts
 */
function createShortcuts(installPath) {
  console.log("\nCreating shortcuts...");

  const platform = os.platform();

  if (platform === "win32") {
    createWindowsShortcuts(installPath);
  } else if (platform === "linux") {
    createLinuxShortcuts(installPath);
  } else if (platform === "darwin") {
    createMacOSShortcuts(installPath);
  } else {
    console.log(`⚠️ Shortcut creation not supported on ${platform}`);
    return false;
  }

  return true;
}

/**
 * Create Windows shortcuts
 */
function createWindowsShortcuts(installPath) {
  try {
    // Create a .bat file to start the application
    const batchPath = path.join(installPath, "start.bat");
    const batchContent = `@echo off\ncd /d "%~dp0"\nnpm start\n`;
    fs.writeFileSync(batchPath, batchContent);

    // Create a PowerShell script to create shortcuts
    const psScriptPath = path.join(installPath, "create-shortcuts.ps1");
    const psScriptContent = `
$WshShell = New-Object -ComObject WScript.Shell

# Desktop shortcut
$Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath("Desktop") + "\\${APP_NAME}.lnk")
$Shortcut.TargetPath = "${installPath.replace(/\\/g, "\\\\")}\\start.bat"
$Shortcut.WorkingDirectory = "${installPath.replace(/\\/g, "\\\\")}"
$Shortcut.IconLocation = "${installPath.replace(/\\/g, "\\\\")}\\public\\vite.svg"
$Shortcut.Save()

# Start Menu shortcut
$StartMenuPath = $WshShell.SpecialFolders("Programs")
$Shortcut = $WshShell.CreateShortcut("$StartMenuPath\\${APP_NAME}.lnk")
$Shortcut.TargetPath = "${installPath.replace(/\\/g, "\\\\")}\\start.bat"
$Shortcut.WorkingDirectory = "${installPath.replace(/\\/g, "\\\\")}"
$Shortcut.IconLocation = "${installPath.replace(/\\/g, "\\\\")}\\public\\vite.svg"
$Shortcut.Save()
`;
    fs.writeFileSync(psScriptPath, psScriptContent);

    // Execute the PowerShell script
    execSync(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`);

    console.log("✅ Windows shortcuts created");
  } catch (error) {
    console.error(`⚠️ Failed to create Windows shortcuts: ${error.message}`);
  }
}

/**
 * Create Linux shortcuts
 */
function createLinuxShortcuts(installPath) {
  try {
    // Create a shell script to start the application
    const shellScriptPath = path.join(installPath, "start.sh");
    const shellScriptContent = `#!/bin/bash\ncd "$(dirname "$0")"\nnpm start\n`;
    fs.writeFileSync(shellScriptPath, shellScriptContent);
    fs.chmodSync(shellScriptPath, "755");

    // Create desktop entry file
    const desktopEntryContent = `[Desktop Entry]
Type=Application
Name=${APP_NAME}
Comment=Mouse Aim Trainer Application
Exec=${shellScriptPath}
Icon=${path.join(installPath, "public/vite.svg")}
Terminal=false
Categories=Game;Utility;
`;

    // Save to user's desktop
    const userDesktopPath = path.join(os.homedir(), "Desktop");
    if (fs.existsSync(userDesktopPath)) {
      fs.writeFileSync(
        path.join(userDesktopPath, `${APP_NAME}.desktop`),
        desktopEntryContent,
      );
      fs.chmodSync(path.join(userDesktopPath, `${APP_NAME}.desktop`), "755");
    }

    // Save to applications directory
    const applicationsDir = path.join(
      os.homedir(),
      ".local/share/applications",
    );
    if (!fs.existsSync(applicationsDir)) {
      fs.mkdirSync(applicationsDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(applicationsDir, `${APP_NAME}.desktop`),
      desktopEntryContent,
    );
    fs.chmodSync(path.join(applicationsDir, `${APP_NAME}.desktop`), "755");

    console.log("✅ Linux shortcuts created");
  } catch (error) {
    console.error(`⚠️ Failed to create Linux shortcuts: ${error.message}`);
  }
}

/**
 * Create macOS shortcuts
 */
function createMacOSShortcuts(installPath) {
  try {
    // Create a shell script to start the application
    const shellScriptPath = path.join(installPath, "start.sh");
    const shellScriptContent = `#!/bin/bash\ncd "$(dirname "$0")"\nnpm start\n`;
    fs.writeFileSync(shellScriptPath, shellScriptContent);
    fs.chmodSync(shellScriptPath, "755");

    // Create an AppleScript to create an alias on the desktop
    const appleScriptPath = path.join(
      installPath,
      "create-shortcut.applescript",
    );
    const appleScriptContent = `
tell application "Finder"
  make new alias file at (path to desktop) to POSIX file "${shellScriptPath}" with properties {name:"${APP_NAME}"}
end tell
`;
    fs.writeFileSync(appleScriptPath, appleScriptContent);

    // Execute the AppleScript
    execSync(`osascript "${appleScriptPath}"`);

    console.log("✅ macOS shortcuts created");
  } catch (error) {
    console.error(`⚠️ Failed to create macOS shortcuts: ${error.message}`);
  }
}

/**
 * Uninstall the application
 */
async function uninstallApplication() {
  console.log("\nUninstalling Mouse Aim Trainer...");

  // Ask for confirmation
  const confirmation = await new Promise((resolve) => {
    rl.question(
      "Are you sure you want to uninstall Mouse Aim Trainer? (y/N): ",
      (answer) => {
        resolve(answer.trim().toLowerCase() === "y");
      },
    );
  });

  if (!confirmation) {
    console.log("Uninstallation cancelled.");
    return;
  }

  // Ask for installation path
  const platform = os.platform();
  const defaultPath =
    DEFAULT_INSTALL_PATHS[platform] || path.join(os.homedir(), APP_NAME);

  const installPath = await new Promise((resolve) => {
    rl.question(`Enter the installation path [${defaultPath}]: `, (answer) => {
      const path = answer.trim() || defaultPath;
      resolve(path);
    });
  });

  // Check if the path exists
  if (!fs.existsSync(installPath)) {
    console.log(`\n❌ Installation not found at: ${installPath}`);
    return;
  }

  try {
    // Remove shortcuts
    if (platform === "win32") {
      removeWindowsShortcuts();
    } else if (platform === "linux") {
      removeLinuxShortcuts();
    } else if (platform === "darwin") {
      removeMacOSShortcuts();
    }

    // Remove installation directory
    console.log(`Removing installation directory: ${installPath}`);
    fs.rmSync(installPath, { recursive: true, force: true });

    console.log("\n✅ Mouse Aim Trainer has been successfully uninstalled.");
  } catch (error) {
    console.error(`\n❌ Uninstallation failed: ${error.message}`);
  }
}

/**
 * Remove Windows shortcuts
 */
function removeWindowsShortcuts() {
  try {
    // Desktop shortcut
    const desktopShortcut = path.join(
      os.homedir(),
      "Desktop",
      `${APP_NAME}.lnk`,
    );
    if (fs.existsSync(desktopShortcut)) {
      fs.unlinkSync(desktopShortcut);
    }

    // Start Menu shortcut
    const startMenuDir = path.join(
      process.env.APPDATA,
      "Microsoft",
      "Windows",
      "Start Menu",
      "Programs",
    );
    const startMenuShortcut = path.join(startMenuDir, `${APP_NAME}.lnk`);
    if (fs.existsSync(startMenuShortcut)) {
      fs.unlinkSync(startMenuShortcut);
    }

    console.log("✅ Windows shortcuts removed");
  } catch (error) {
    console.error(`⚠️ Failed to remove Windows shortcuts: ${error.message}`);
  }
}

/**
 * Remove Linux shortcuts
 */
function removeLinuxShortcuts() {
  try {
    // Desktop shortcut
    const desktopShortcut = path.join(
      os.homedir(),
      "Desktop",
      `${APP_NAME}.desktop`,
    );
    if (fs.existsSync(desktopShortcut)) {
      fs.unlinkSync(desktopShortcut);
    }

    // Applications directory shortcut
    const applicationsShortcut = path.join(
      os.homedir(),
      ".local/share/applications",
      `${APP_NAME}.desktop`,
    );
    if (fs.existsSync(applicationsShortcut)) {
      fs.unlinkSync(applicationsShortcut);
    }

    console.log("✅ Linux shortcuts removed");
  } catch (error) {
    console.error(`⚠️ Failed to remove Linux shortcuts: ${error.message}`);
  }
}

/**
 * Remove macOS shortcuts
 */
function removeMacOSShortcuts() {
  try {
    // Desktop alias
    const desktopAlias = path.join(os.homedir(), "Desktop", `${APP_NAME}`);
    if (fs.existsSync(desktopAlias)) {
      fs.unlinkSync(desktopAlias);
    }

    console.log("✅ macOS shortcuts removed");
  } catch (error) {
    console.error(`⚠️ Failed to remove macOS shortcuts: ${error.message}`);
  }
}

// Run the main function
main();
