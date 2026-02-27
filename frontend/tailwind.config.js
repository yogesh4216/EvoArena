/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        evo: { 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca" },
        "bnb-gold": "#F0B90B",
        "bnb-gold-dim": "#c99a09",
        "neon-blue": "#00D4FF",
        "neon-purple": "#A855F7",
        "arena-dark": {
          950: "#030305",
          900: "#0a0a12",
          800: "#0f0f1a",
          700: "#141422",
          600: "#1a1a2e",
          500: "#22223a",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(240,185,11,0.15), 0 0 60px rgba(240,185,11,0.05)",
        "glow-blue":
          "0 0 20px rgba(0,212,255,0.15), 0 0 60px rgba(0,212,255,0.05)",
        "glow-sm": "0 0 10px rgba(240,185,11,0.1)",
        "glass":
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-hover":
          "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", boxShadow: "0 0 10px rgba(240,185,11,0.2)" },
          "50%": { opacity: "1", boxShadow: "0 0 25px rgba(240,185,11,0.4)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
