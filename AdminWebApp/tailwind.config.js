/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#e8f0f5', 100: '#c5dbe8', 200: '#9fc4d9', 300: '#79acca', 400: '#5c9bbe', 500: '#1a5276', 600: '#164766', 700: '#123c56', 800: '#0e3146', 900: '#0a2636' },
        secondary: { 50: '#fdeaea', 100: '#f9caca', 200: '#f4a7a7', 300: '#ef8484', 400: '#eb6a6a', 500: '#e74c3c', 600: '#d43c2e', 700: '#b32d22', 800: '#921f17', 900: '#71120d' },
        accent: { 500: '#f39c12' },
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        info: '#3498db',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
