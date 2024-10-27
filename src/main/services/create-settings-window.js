import { shell, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { getLocaleResources } from './locale';
import { getSettings } from './settings';
import { translate } from '../utils';
import icon from '../../../resources/icon.png?asset';

export default function createSettingsWindow(parentWindow) {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  // Create settings window
  const initializationsWindow = new BrowserWindow({
    width: 450,
    height: 598,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/settings.js'),
      sandbox: false,
    },
    title: translate(locale, 'settingsWindow.title', localeResources),
    parent: parentWindow,
    minimizable: false,
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
    initializationsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings.html`);
  } else {
    initializationsWindow.loadFile(join(__dirname, '../renderer/settings.html'));
  }

}
