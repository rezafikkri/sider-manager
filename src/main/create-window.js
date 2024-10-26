import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../resources/icon.png?asset';

export default function createWindow() {
  // Create main window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 430,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
    title: 'Sider Manager',
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Create initializations window
  const initializationsWindow = new BrowserWindow({
    width: 400,
    height: 500,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/initializations.js'),
      sandbox: false,
    },
    title: 'Initializations - Sider Manager',
  });

  initializationsWindow.on('ready-to-show', () => {
    initializationsWindow.show();
  });

  initializationsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    initializationsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/initializations.html`);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    initializationsWindow.loadFile(join(__dirname, '../renderer/initializations.html'));
  }

  return { mainWindow, initializationsWindow };
}

