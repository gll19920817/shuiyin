/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/App.vue"],
  theme: {
    extend: {},
    fontFamily: {
      Bold: ["Optima", "sans-serif"],
      SemiBold: ["Dongqing", "sans-serif"],
      Demibold: ["MiSans-Demibold", "sans-serif"],
      Regular: ["MiSans-Regular", "sans-serif"],
      ExtralLight: ["Handwrite", "sans-serif"],
    },
  },
  plugins: [],
};
