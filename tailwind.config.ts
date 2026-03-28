import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        line: "var(--line)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        text: "var(--text)",
        muted: "var(--muted)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0, 200, 150, 0.12), 0 24px 60px rgba(5, 9, 16, 0.45)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 20% 20%, rgba(0, 200, 150, 0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(142, 255, 205, 0.16), transparent 35%), linear-gradient(180deg, rgba(9,14,21,0.96), rgba(4,7,12,1))"
      }
    }
  },
  plugins: []
};

export default config;
