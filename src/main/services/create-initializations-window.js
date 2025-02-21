import { shell, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import icon from '../../../resources/icon.png?asset';
import { getLocaleResources } from './locale';
import { getSettings } from './settings';
import { translate } from '../utils';

export default function createInitializationsWindow() {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  // Create initializations window
  const initializationsWindow = new BrowserWindow({
    width: 350,
    height: 490,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/initializations.js'),
      sandbox: false,
    },
    title: translate(locale, 'initializationsWindow.title', localeResources),
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
    initializationsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/initializations.html`);
  } else {
    initializationsWindow.loadFile(join(__dirname, '../renderer/initializations.html'));
  }
}
