import { app, ipcMain, Menu, net, protocol } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import path from 'node:path';
import { existsSync } from 'node:fs';
import createMainWindow from './services/create-main-window';
import createInitializationsWindow from './services/create-initializations-window';
import createSettingsWindow from './services/create-settings-window';
import { initializeLocale, getLocaleResources } from './services/locale';
import { getFileSize, handleSetTitle } from './services';
import {
  choosePESDirectory,
  getSettings,
  saveSettings,
  isPESDirectorySetup,
  initializeSettings,
} from './services/settings';
import { activate, isActivated } from './services/activation';
import { playGame } from './services/play-game';
import checkUpdate from './services/check-update';
import { initializeMainWindow } from './services/initializations';
import createAboutWindow from './services/create-about-window';
import createAddonInitializationWindow from './services/create-addon-initialization-window';
import createSimpleConfigurationsWindow from './services/create-simple-configurations-window';
import { addonInitialization, backup, chooseInitializationFile } from './services/addon-initialization';

// for performance
Menu.setApplicationMenu(null);

protocol.registerSchemesAsPrivileged([
  { scheme: 'sm', privileges: { bypassCSP: true } },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('RezaFikkri.SiderManager');

  protocol.handle('sm', (request) => {
    const filePath = request.url.replace('sm://', 'file://');
    return net.fetch(filePath);
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  initializeLocale();

  ipcMain.handle('getLocaleResources', getLocaleResources);
  ipcMain.handle('getSettings', getSettings);
  ipcMain.handle('saveSettings', (_, settings) => saveSettings(settings));
  ipcMain.handle('isActivated', isActivated);
  ipcMain.on('set-title', handleSetTitle);

  // this is for catch mainWindow object that created after initialization
  // so that is can be used when create settingsWindow
  const mainWindowObj = { mainWindow: null };

  if (!isActivated() || !isPESDirectorySetup()) {
    ipcMain.handle('activate', (_, activationKey) => activate(activationKey));
    ipcMain.handle('initializeSettings', (_, pesDirectory) => initializeSettings(pesDirectory, mainWindowObj));
    ipcMain.handle('initializeMainWindow', () => initializeMainWindow(createMainWindow, mainWindowObj));
    ipcMain.handle('isPESDirectorySetup', isPESDirectorySetup);
    
    createInitializationsWindow();
  } else {
    mainWindowObj.mainWindow = createMainWindow();
  }

  ipcMain.handle('choosePESDirectory', choosePESDirectory);
  ipcMain.handle('playGame', playGame);
  ipcMain.handle('createAddonInitializationWindow', () => createAddonInitializationWindow(mainWindowObj.mainWindow));
  ipcMain.handle('createSimpleConfigurationsWindow', () => createSimpleConfigurationsWindow(mainWindowObj.mainWindow));
  ipcMain.handle('createSettingsWindow', () => createSettingsWindow(mainWindowObj.mainWindow));
  ipcMain.handle('isPESExecutableExist', (_, pesDirectory, pesExe) => existsSync(path.join(pesDirectory, pesExe)));
  ipcMain.handle('createAboutWindow', () => createAboutWindow(mainWindowObj.mainWindow));
  ipcMain.handle('getAppVersion', () => app.getVersion());

  ipcMain.handle('backup', backup);
  ipcMain.handle('chooseInitializationFile', chooseInitializationFile);
  ipcMain.handle('addonInitialization', (_, fileName, filePath) => addonInitialization(fileName, filePath));

  // check-update in background
  checkUpdate();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
