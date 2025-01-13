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

  const kbSize = stats.size / 1000;
  const mbSize = stats.size / (1000**2);
  const gbSize = stats.size / (1000**3);
  let fSize;
  if (gbSize > 1) {
    fSize = gbSize.toFixed(1) + ' GB';
  } else if (mbSize > 1) {
    fSize = mbSize.toFixed(1) + ' MB';
  } else {
    fSize = kbSize.toFixed(1) + ' KB';
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
