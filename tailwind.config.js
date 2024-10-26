/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/*.html',
    './src/renderer/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sima-bg': '#161437',
      },
    },
  },
  plugins: [],
};
