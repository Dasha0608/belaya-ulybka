import animate from "tailwindcss-animate"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
        script: ["Caveat", "cursive"],
      },
      colors: {
        navy: { DEFAULT: "#0c2d4f", 800: "#0f3a63", 950: "#061a30" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        kenburns: { "0%": { transform: "scale(1.12) translate(2%, 1%)" }, "100%": { transform: "scale(1) translate(0,0)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "pulse-ring": { "0%": { transform: "scale(1)", opacity: "0.6" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
        wiggle: { "0%,100%": { transform: "rotate(-6deg)" }, "50%": { transform: "rotate(-2deg)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        shake: { "0%,100%": { transform: "translateX(0)" }, "20%,60%": { transform: "translateX(-8px)" }, "40%,80%": { transform: "translateX(8px)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        kenburns: "kenburns 14s ease-out both",
        marquee: "marquee 35s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.2,0.6,0.4,1) infinite",
        wiggle: "wiggle 5s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [animate],
}
