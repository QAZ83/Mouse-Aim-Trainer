import React from "react";
import { GitIgnore } from "../components/GitIgnore";

const meta = {
  title: "Components/GitIgnore",
  component: GitIgnore,
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "text",
      description: "The content of the .gitignore file to display",
    },
  },
};

export default meta;

export const Default = {
  render: (args) => <GitIgnore {...args} />,
  args: {
    content:
      "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n!node_modules/.vite\n\n**/tempobook/dynamic/\n**/tempobook/storyboards/\n\ncore\n",
  },
  description: "Shows a standard .gitignore file with common patterns",
};

export const Minimal = {
  render: (args) => <GitIgnore {...args} />,
  args: {
    content: "node_modules\ndist\n.DS_Store\n",
  },
  description: "Shows a minimal .gitignore file with only essential patterns",
};
