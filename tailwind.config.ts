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
        bg: {
          start: "#3A3F8F",
          mid: "#5B4E9E",
          end: "#6B5CA5",
        },
        neon: {
          cyan: "#4CD9E8",
          yellow: "#E8D44C",
          pink: "#E84C9E",
          purple: "#8B5CF6",
          blue: "#4C7FE8",
        },
        glass: {
          fill: "rgba(255,255,255,0.10)",
          border: "rgba(255,255,255,0.25)",
        },
        text: {
          primary: "#F5F6FA",
          secondary: "#A9AAC4",
        },
        status: {
          success: "#4CE87D",
          warning: "#E8A44C",
          danger: "#E85C5C",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #3A3F8F 0%, #5B4E9E 50%, #6B5CA5 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
