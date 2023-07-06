/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/App.vue"],
  theme: {
    extend: {
      fontFamily: {
        optima: "Optima",
        midemibold: 'MiSans-Demibold',
        mithin: 'MiSans-Thin',
        handwrite: 'Handwrite',
        mukta: 'MuktaMahee',
      }
    },
  },
  plugins: [],
};
