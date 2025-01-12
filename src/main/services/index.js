import { BrowserWindow, dialog } from 'electron';
import { lstatSync, statSync } from 'node:fs';
import { getSettings } from './settings';

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

function getFileSize(filePath) {
  const { locale } = getSettings();
  const stats = statSync(filePath);
  let oSize = stats.size / (1000**2); // original size
  let fSize;
  if (oSize < 1) {
    oSize = stats.size / 1000;
    fSize = oSize.toFixed(1) + ' KB';
  } else {
    fSize = oSize.toFixed(1) + ' MB';
  }

  if (locale !== 'en') return fSize.replace('.', ',');
  return fSize;
}

function isFile(filePath) {
  return lstatSync(filePath).isFile();
}

async function chooseDirectory(title) {
  const directoryObj = await dialog.showOpenDialog({
    title,
    properties: ['openDirectory'],
  });
  if (!directoryObj.canceled) {
    return directoryObj.filePaths[0];
  }

  return false;
}

export {
  handleSetTitle,
  getFileSize,
  isFile,
  chooseDirectory,
};
