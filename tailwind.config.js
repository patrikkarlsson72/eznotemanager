/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
  darkMode: 'class', // This enables dark mode based on a class
  plugins: [],
}
