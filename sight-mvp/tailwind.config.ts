import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1F3A5F",
        brand: "#2E75B6",
        "brand-dark": "#1B5A94",
        accent: "#1E7A46",
        "accent-soft": "#DFF0E4",
        amber: "#9C6A00",
        ink: "#1A2733",
        muted: "#5B6B7B",
        line: "#E3E9F0",
        surface: "#F5F8FB",
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "Cairo",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 10px rgba(31, 58, 95, 0.08)",
        "card-hover": "0 8px 24px rgba(31, 58, 95, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
