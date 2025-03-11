# Mouse Aim Trainer

A React application that helps users improve their mouse aiming precision through interactive training exercises and simulations.

## Features

- Interactive training area with moving targets of various sizes and speeds
- Precision metrics tracking (accuracy percentage, reaction time, clicks per minute)
- Adjustable difficulty settings (target size, movement patterns, speed)
- Mouse sensitivity adjustment and DPI configuration
- Performance statistics dashboard

## Installation

### Automatic Installation

Use the setup script to install the application:

```bash
node setup.js
```

Options:
- `--install-path <path>`: Specify custom installation path
- `--no-deps`: Skip installing dependencies
- `--no-shortcuts`: Skip creating desktop and start menu shortcuts
- `--dev`: Install in development mode
- `--uninstall`: Uninstall the application
- `--help`: Show help information

### Manual Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Launch the application
2. From the main menu, select "Start Training"
3. Choose a difficulty level or customize your training session
4. Click on the targets as they appear to improve your aim precision
5. View your performance statistics after each session
6. Adjust mouse settings as needed for optimal performance

## System Requirements

- Node.js 14.0.0 or higher
- Modern web browser with WebGL support
- Mouse or trackpad

## License

MIT
