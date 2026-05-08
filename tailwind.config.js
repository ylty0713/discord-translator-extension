/** @type {import('tailwindcss').Config} */
export default {
  content: ["./popup/**/*.{html,ts,tsx}", "./content/**/*.{ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f3f4f6",
        accent: "#0f766e",
        accentSoft: "#ccfbf1"
      }
    }
  },
  plugins: []
};
