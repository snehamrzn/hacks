import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#0A0A0A",
        elevated: "#141414",
        fg: "#FFFFFF",
        muted: "#A1A1AA",
        subtle: "#71717A",
        border: "rgba(255,255,255,0.10)",
        "border-strong": "rgba(255,255,255,0.20)",
        accent: "#2D7FF9",
        "accent-hover": "#5499FB",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem, 7vw, 6rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        h1: ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2: ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.15em" }],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
      },
      spacing: {
        section: "clamp(5rem, 12vh, 9rem)",
      },
      boxShadow: {
        "accent-glow": "0 0 0 1px #2D7FF9, 0 8px 30px rgba(45,127,249,0.25)",
        "focus-ring": "0 0 0 2px #000000, 0 0 0 4px #2D7FF9",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-sweep": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "gradient-sweep": "gradient-sweep 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
