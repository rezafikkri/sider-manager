import { app, dialog, BrowserWindow } from 'electron';
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import createMainWindow from './create-main-window';
import { getLocaleResources } from './locale';
import { translate } from '../utils';

function getSettingsPath() {
  return path.join(app.getPath('appData'), 'sider-manager');
}

function getSettingsFilePath() {
  return path.join(getSettingsPath(), 'settings.json');
}

function getSettings() {
  const settingFilePath = getSettingsFilePath();
  return JSON.parse(readFileSync(settingFilePath));
}

function isPESDirectorySetup() {
  const settingFilePath = getSettingsFilePath();

  const setting = JSON.parse(readFileSync(settingFilePath));
  if (setting.pesDirectory) {
    return true;
  } else {
    return false;
  }
}

async function choosePESDirectory() {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  const pesDirectoryObj = await dialog.showOpenDialog({
    title: translate(locale, 'pesDirectoryInput.dialogTitle', localeResources),
    properties: ['openDirectory'],
  });
  if (!pesDirectoryObj.canceled) {
    const pesDirectory = pesDirectoryObj.filePaths[0];
    return pesDirectory;
  }

  return false;
}

function saveSettings(settings) {
  const oldSettings = getSettings();
  writeFileSync(getSettingsFilePath(), JSON.stringify({ ...oldSettings, ...settings }));
  return true;
}

function initializeSettings(pesDirectory, mainWindowObj) {
  const settings = {
    pesDirectory: pesDirectory,
    pesExecutable: ['PES2017.exe', 'sider.exe'],
  };
  saveSettings(settings);
  
  // close initilization window and show main window
  BrowserWindow.getFocusedWindow().close(); 
  mainWindowObj.mainWindow = createMainWindow();
  return true;
}

export {
  getSettingsPath,
  getSettingsFilePath,
  getSettings,
  isPESDirectorySetup,
  choosePESDirectory,
  initializeSettings,
  saveSettings,
};
