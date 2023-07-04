/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/App.vue",
  ],
  theme: {
    extend: {
      
    },
    fontFamily: {
      Demibold: ["MiSans-Demibold", 'sans-serif'],
      Light: ["MiSans-Light", 'sans-serif'],
    }
  },
  plugins: [],
}

