import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.js'),
          initializations: resolve(__dirname, 'src/preload/initializations.js'),
          settings: resolve(__dirname, 'src/preload/settings.js'),
          about: resolve(__dirname, 'src/preload/about.js'),
        },
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          initializations: resolve(__dirname, 'src/renderer/initializations.html'),
          settings: resolve(__dirname, 'src/renderer/settings.html'),
          about: resolve(__dirname, 'src/renderer/about.html'),
        },
      },
    },
  },
});
