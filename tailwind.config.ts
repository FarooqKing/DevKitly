import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./tools/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#EEF2FF", 100: "#E0E7FF", 400: "#818CF8", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA" },
      },
      fontFamily: { sans: ["'Inter Variable'", "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"], mono: ["'JetBrains Mono Variable'", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"] },
      boxShadow: { card: "0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.08)" },
    },
  },
  plugins: [],
};
export default config;
