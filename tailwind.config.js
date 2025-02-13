/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/*.html',
    './src/renderer/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'd-bg': '#0E0D11',
        'd-input-bg': '#131217',
        'd-alert-bg': '#16141A',
        'd-alert-bg-hover': '#1B191F',
        'd-bg-light': '#1D1B22',
        'd-input-bg-light': '#24212A',
      },
    },
  },
  plugins: [],
};
