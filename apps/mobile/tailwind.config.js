/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
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
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
