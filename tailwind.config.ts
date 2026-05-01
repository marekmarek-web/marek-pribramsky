import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "clamp(3rem, 6vw, 7rem)",
        "section-sm": "clamp(2.5rem, 5vw, 5rem)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          navy: "#1D2354",
          navyLight: "#2a3366",
          dark: "#0a0f29",
          main: "#1D2354",
          cyan: "#4FC6F2",
          gold: "#fbbf24",
          light: "#EAF3FF",
          line: "#D6E6FF",
          background: "#F8FAFC",
          white: "#FFFFFF",
          text: "#0F172A",
          muted: "#475569",
          border: "#E2E8F0",
        },
      },
      maxWidth: { content: "1120px" },
      animation: { shimmer: "shimmer 2.8s ease-in-out infinite" },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(150%) skewX(-20deg)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
