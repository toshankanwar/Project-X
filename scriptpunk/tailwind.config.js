/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kali: {
          bg: "#0b0f10",
          panel: "#0f1416",
          accent: "#00e5ff",
          text: "#cbd5e1"
        }
      }
    },
  },
  plugins: [],
}
