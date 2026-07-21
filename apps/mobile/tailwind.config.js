/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
        background: "#FFFFFF",
        surface: "#F8FAFC",
        border: "#E5E7EB",
        textPrimary: "#111827",
        textSecondary: "#6B7280"
      },
      fontFamily: {
        inter: ["Inter"]
      }
    },
  },
  plugins: [],
}
