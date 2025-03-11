/**
 * Mouse device detection and information utilities
 */

export interface MouseDevice {
  name: string;
  dpi?: number;
  pollingRate?: number;
  buttons?: number;
  wireless?: boolean;
  manufacturer?: string;
}

// Common gaming mouse models with their typical specifications
const knownMouseModels: Record<string, Partial<MouseDevice>> = {
  "Logitech G Pro X Superlight": {
    dpi: 25600,
    pollingRate: 1000,
    buttons: 5,
    wireless: true,
    manufacturer: "Logitech",
  },
  "Razer Viper Ultimate": {
    dpi: 20000,
    pollingRate: 1000,
    buttons: 8,
    wireless: true,
    manufacturer: "Razer",
  },
  "SteelSeries Prime": {
    dpi: 18000,
    pollingRate: 1000,
    buttons: 6,
    wireless: false,
    manufacturer: "SteelSeries",
  },
  "Zowie EC2": {
    dpi: 3200,
    pollingRate: 1000,
    buttons: 5,
    wireless: false,
    manufacturer: "BenQ",
  },
  "Glorious Model O": {
    dpi: 12000,
    pollingRate: 1000,
    buttons: 6,
    wireless: false,
    manufacturer: "Glorious",
  },
};

/**
 * Attempts to detect the user's mouse device information
 * Note: Web browsers have limited access to hardware information for security reasons
 */
export const detectMouseDevice = async (): Promise<MouseDevice> => {
  // In a real implementation, we might use the Navigator.userAgentData API
  // or other browser-specific APIs to get more detailed information
  // For now, we'll return a generic device with some estimated values

  try {
    // This is a placeholder for actual device detection logic
    // In a real implementation, we might use more sophisticated techniques
    const userAgent = navigator.userAgent.toLowerCase();

    // Very basic detection based on user agent (not reliable in practice)
    let detectedManufacturer = "Generic";
    if (userAgent.includes("windows")) {
      detectedManufacturer = "Microsoft";
    } else if (userAgent.includes("macintosh")) {
      detectedManufacturer = "Apple";
    }

    return {
      name: "Unknown Mouse",
      dpi: 800, // Default/common DPI value
      pollingRate: 125, // Default/common polling rate
      buttons: 3, // Standard mouse buttons
      wireless: false,
      manufacturer: detectedManufacturer,
    };
  } catch (error) {
    console.error("Error detecting mouse device:", error);
    return {
      name: "Unknown Mouse",
      manufacturer: "Unknown",
    };
  }
};

/**
 * Estimates the user's current mouse DPI based on pointer movement
 * This is an approximation and not 100% accurate
 */
export const estimateMouseDPI = (): Promise<number> => {
  return new Promise((resolve) => {
    // Create a temporary overlay for the test
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "white";
    overlay.style.fontFamily = "sans-serif";
    overlay.style.cursor = "crosshair";

    const instructions = document.createElement("div");
    instructions.textContent =
      "Move your mouse exactly 1 inch (2.54 cm) to the right";
    instructions.style.fontSize = "18px";
    instructions.style.marginBottom = "20px";

    const subInstructions = document.createElement("div");
    subInstructions.textContent =
      "Click once at the starting position, then move and click again";
    subInstructions.style.fontSize = "14px";
    subInstructions.style.marginBottom = "40px";

    const status = document.createElement("div");
    status.textContent = "Waiting for first click...";
    status.style.fontSize = "16px";

    overlay.appendChild(instructions);
    overlay.appendChild(subInstructions);
    overlay.appendChild(status);

    document.body.appendChild(overlay);

    let firstClick = true;
    let startX = 0;
    let startY = 0;

    const clickHandler = (e: MouseEvent) => {
      if (firstClick) {
        startX = e.screenX;
        startY = e.screenY;
        firstClick = false;
        status.textContent = "Now move exactly 1 inch right and click again";
      } else {
        const deltaX = e.screenX - startX;
        const deltaY = e.screenY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Estimate DPI based on the distance moved
        // This is a very rough approximation
        const estimatedDPI = Math.round(distance);

        // Clean up
        document.body.removeChild(overlay);
        overlay.removeEventListener("click", clickHandler);

        resolve(estimatedDPI);
      }
    };

    overlay.addEventListener("click", clickHandler);

    // Allow cancellation with Escape key
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.removeChild(overlay);
        overlay.removeEventListener("click", clickHandler);
        window.removeEventListener("keydown", keyHandler);
        resolve(800); // Default fallback value
      }
    };

    window.addEventListener("keydown", keyHandler);
  });
};

/**
 * Gets information about a known mouse model
 */
export const getKnownMouseInfo = (
  modelName: string,
): Partial<MouseDevice> | null => {
  return knownMouseModels[modelName] || null;
};

/**
 * Returns a list of all known mouse models
 */
export const getKnownMouseModels = (): string[] => {
  return Object.keys(knownMouseModels);
};

/**
 * Calculates the effective sensitivity based on DPI and sensitivity settings
 */
export const calculateEffectiveSensitivity = (
  dpi: number,
  sensitivity: number,
): number => {
  // This is a simplified calculation
  return (dpi * sensitivity) / 100;
};
