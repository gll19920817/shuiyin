/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/App.vue"],
  theme: {
    extend: {},
    fontFamily: {
      Bold: ["Optima"],
      SemiBold: ["MuktaMahee"],
      Demibold: ["MiSans-Demibold"],
      Thin: ["Handwrite"],
      ExtralLight: ["MiSans-ExtralLight"],
    },
  },
  plugins: [],
};
