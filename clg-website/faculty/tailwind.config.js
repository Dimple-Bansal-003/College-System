/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e3a5f', light: '#2d5a87', dark: '#152a45' },
        secondary: { DEFAULT: '#2d5a87', light: '#3d7ab7', dark: '#1d4a77' },
      },
    },
  },
  plugins: [],
};