import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./tools/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#EEF2FF", 100: "#E0E7FF", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
      boxShadow: { card: "0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.08)" },
    },
  },
  plugins: [],
};
export default config;
