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
        forest: {
          50: "#f0f7f3",
          100: "#dbeef0",
          200: "#b5dfd0",
          300: "#8ac9b3",
          400: "#5baea3",
          500: "#378f77",
          600: "#2a7360",
          700: "#225c4e",
          800: "#1d4a3f",
          900: "#1a3d34",
          950: "#0c231e",
        },
        meadow: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        earth: {
          50: "#fbfaf8",
          100: "#f6f4f0",
          200: "#ede7e0",
          300: "#ded4c7",
          400: "#cbbaaa",
          500: "#b8a08c",
          600: "#aa8e79",
          700: "#8e7463",
          800: "#735f52",
          900: "#5e4e44",
        },
      },
    },
  },
  plugins: [],
};
export default config;
