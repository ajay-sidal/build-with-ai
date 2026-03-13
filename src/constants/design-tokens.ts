/**
 * THE SANCTUARY - DESIGN TOKENS
 * Reference for all AI Agents to maintain the Gold Standard UI.
 */

export const DESIGN_TOKENS = {
  colors: {
    background: {
      obsidian: "#0a0a0a", // Primary background
      deepBlack: "#050505", // Footer/Card background
      surface: "#0f0f0f",   // Hover/Elevation background
    },
    brand: {
      teal: "#14b8a6",      // Teal-500 (Primary Action)
      tealGlow: "#2dd4bf",  // Teal-400 (Hover/Glow)
      tealDark: "#0f766e",  // Teal-700 (Muted/Borders)
    },
    text: {
      primary: "#ffffff",   // Pure white for headers
      secondary: "#a3a3a3", // Neutral-400 for body
      muted: "#525252",     // Neutral-600 for subtext
    },
    border: {
      subtle: "rgba(38, 38, 38, 0.5)", // Neutral-800 with opacity
      glow: "rgba(20, 184, 166, 0.1)", // Teal-500 subtle glow
    }
  },
  typography: {
    fontFamily: "var(--font-inter)",
    tracking: {
      widest: "0.2em", // Standard for Sanctuary headers
      tighter: "-0.05em", // For "THE SANCTUARY" branding
    }
  },
  effects: {
    glassGradient: "linear-gradient(to bottom right, rgba(20, 184, 166, 0.05), transparent)",
    cardShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
  }
} as const;

export type SanctuaryTheme = typeof DESIGN_TOKENS;
