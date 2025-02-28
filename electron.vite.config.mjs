import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      bytecodePlugin({
        protectedStrings: [
          '66e13077f1babb14690f0d60f73fa315896abc1dcd8393814850b4907c6e6595',// secret license key
          '882426195302-d85q810np449r40iqg2t6j79ubcm2ts2.apps.googleusercontent.com',
          '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',
          '1//047LICTKVSZJiCgYIARAAGAQSNwF-L9IrABeN4tU2T0gyTovrEleRTz5jmMfJF6LmNZIHiT9DD-OUF-JZ871p-0QHqfGEACc-VBs',
          'e3bd81ea98ded3711c5df7761c12f420e0bb88d38073c64331d236a64460ade7',
          'SELECT id, used_for_activate FROM license_key where key = $1 FOR UPDATE',
          'UPDATE license_key set used_for_activate = $1 WHERE id = $2',
        ]
      }),
    ],
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
          "addon-initialization": resolve(__dirname, 'src/preload/addon-initialization.js'),
          "simple-configurations": resolve(__dirname, 'src/preload/simple-configurations.js'),
        },
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          initializations: resolve(__dirname, 'src/renderer/initializations.html'),
          settings: resolve(__dirname, 'src/renderer/settings.html'),
          about: resolve(__dirname, 'src/renderer/about.html'),
          "addon-initialization": resolve(__dirname, 'src/renderer/addon-initialization.html'),
          "simple-configurations": resolve(__dirname, 'src/renderer/simple-configurations.html'),
        },
      },
    },
  },
});
