import { shell, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { getLocaleResources } from './locale';
import { getSettings } from './settings';
import { translate } from '../utils';
import icon from '../../../resources/icon.png?asset';

export default function createSimpleConfigurationsWindow(parentWindow) {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  // Create settings window
  const simpleConfigurationsWindow = new BrowserWindow({
    width: 950,
    height: 550,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/simple-configurations.js'),
      sandbox: false,
    },
    title: translate(locale, 'simpleConfigurationsWindow.title', localeResources),
    parent: parentWindow,
    minimizable: false,
  });

  simpleConfigurationsWindow.on('ready-to-show', () => {
    simpleConfigurationsWindow.show();
  });

  simpleConfigurationsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    simpleConfigurationsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/simple-configurations.html`);
  } else {
    simpleConfigurationsWindow.loadFile(join(__dirname, '../renderer/simple-configurations.html'));
  }
}
