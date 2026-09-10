/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", 
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", 
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // An Chuyến brand palette (logo redesign) — used to migrate Home off the
        // old yellow/black scheme without touching every hex literal at once.
        teal: { DEFAULT: "#215951", deep: "#153B35", light: "#3D7A6D" },
        amber: { DEFAULT: "#D1873F", deep: "#B36C2B" },
        cream: "#F6F1E0",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        cormorant: ["Cormorant Garamond", "Georgia", "serif"],
        brand: ["'Instrument Serif'", "Georgia", "serif"],
        condensed: ["Barlow Condensed", "system-ui", "sans-serif"],
        // Redesign faces (logo lockup): Fraunces for display headings, Be Vietnam
        // Pro for body/UI (already loaded, better Vietnamese diacritic support).
        fraunces: ["Fraunces", "Georgia", "serif"],
        viet: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
