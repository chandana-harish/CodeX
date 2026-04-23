/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f8ff",
          100: "#edf0ff",
          200: "#dbe1ff",
          300: "#bcc8ff",
          400: "#95a7ff",
          500: "#637dff",
          600: "#405be8",
          700: "#3348c9",
          800: "#2d3da2",
          900: "#2a377f"
        }
      },
      boxShadow: {
        card: "0 24px 60px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        "hero-pattern":
          "radial-gradient(circle at top left, rgba(99,125,255,0.35), transparent 35%), radial-gradient(circle at bottom right, rgba(16,185,129,0.18), transparent 30%)"
      }
    }
  },
  plugins: []
};
