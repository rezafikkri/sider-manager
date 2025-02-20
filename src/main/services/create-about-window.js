import { shell, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { getLocaleResources } from './locale';
import { getSettings } from './settings';
import { translate } from '../utils';
import icon from '../../../resources/icon.png?asset';

export default function createAboutWindow(parentWindow) {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  // Create about window
  const aboutWindow = new BrowserWindow({
    width: 450,
    height: 550,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/about.js'),
      sandbox: false,
    },
    title: translate(locale, 'aboutWindow.title', localeResources),
    parent: parentWindow,
    minimizable: false,
    maximizable: false,
  });

  aboutWindow.on('ready-to-show', () => {
    aboutWindow.show();
  });

  aboutWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    aboutWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/about.html`);
  } else {
    aboutWindow.loadFile(join(__dirname, '../renderer/about.html'));
  }
}
