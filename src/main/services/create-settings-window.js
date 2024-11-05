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
  const settingsWindow = new BrowserWindow({
    width: 800,
    height: 360,
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

  settingsWindow.on('ready-to-show', () => {
    settingsWindow.show();
  });

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings.html`);
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'));
  }
}
