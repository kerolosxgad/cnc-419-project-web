import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0B0F1A",
          secondary: "#0E1324",
        },
        card: {
          DEFAULT: "#12172A",
          hover: "#1A2038",
        },
        border: {
          DEFAULT: "#1E2847",
          glow: "#3B82F6",
        },
        severity: {
          critical: "#DC2626",
          high: "#F97316",
          medium: "#FBBF24",
          low: "#10B981",
          info: "#06B6D4",
        },
        accent: {
          blue: "#3B82F6",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-sm": "0 0 10px rgba(59, 130, 246, 0.2)",
        "glow-lg": "0 0 30px rgba(59, 130, 246, 0.4)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
