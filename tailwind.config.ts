import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0a0a0a",
        sanctuary: {
          DEFAULT: "#14b8a6",
          dark: "#050505",
          glow: "#2dd4bf",
        }
      },
      letterSpacing: {
        'sanctuary': '0.2em',
      }
    },
  },
  plugins: [],
};
export default config;
