import { shell, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { getLocaleResources } from './locale';
import { getSettings } from './settings';
import { translate } from '../utils';
import icon from '../../../resources/icon.png?asset';

export default function createAddonInitializationWindow(parentWindow) {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  // Create settings window
  const addonInitializationWindow = new BrowserWindow({
    width: 450,
    height: 395,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/addon-initialization.js'),
      sandbox: false,
    },
    title: translate(locale, 'addonInitializationWindow.title', localeResources),
    parent: parentWindow,
    minimizable: false,
  });

  addonInitializationWindow.on('ready-to-show', () => {
    addonInitializationWindow.show();
  });

  addonInitializationWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    addonInitializationWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/addon-initialization.html`);
  } else {
    addonInitializationWindow.loadFile(join(__dirname, '../renderer/addon-initialization.html'));
  }
}
