import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f7fb",
        foreground: "#0f172a",
        primary: "#2563eb",
        accent: "#f59e0b",
        panel: "#ffffff",
        border: "#dbe5f4",
        muted: "#64748b"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(15, 23, 42, 0.12)",
        glow: "0 18px 40px rgba(37, 99, 235, 0.2)"
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "ui-sans-serif", "system-ui"],
        display: ["Sora", "Manrope", "ui-sans-serif", "system-ui"],
        mono: ["SFMono-Regular", "Menlo", "ui-monospace", "monospace"]
      },
      backgroundImage: {
        "grain-gradient":
          "radial-gradient(1200px circle at 0% 0%, rgba(37,99,235,0.16) 0%, transparent 40%), radial-gradient(900px circle at 100% 0%, rgba(14,165,233,0.16) 0%, transparent 32%), linear-gradient(180deg, #f8fbff 0%, #f4f7fb 60%, #eef3fb 100%)"
      }
    }
  },
  plugins: []
};

export default config;
