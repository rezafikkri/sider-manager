import { dialog } from 'electron';
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import path from 'node:path';
import { getSettings } from './settings';
import { getLocaleResources } from './locale';
import { translate } from '../utils';
import { getFileSize } from '.';
import decompress from 'decompress';

const ignoreList = new Set([
  'Data',
  'download',
  'Settings',
  'Uninstall',
  'anilag.cfg',
  'CPY.ini',
  'lua51.dll',
  'msvcr100.dll',
  'PES2017.exe',
  'sdkencryptedappticket.dll',
  'Settings.exe',
  'Settings_b.dll',
  'steam_api.dll',
  'steamclient.dll',
  'Uninstal.exe',
  'vaname.exe',
  'backup',
]);

function backup() {
  const settings = getSettings();
  ignoreList.add(settings.pesExecutable[0]);

  const pesDirectory = settings.pesDirectory;
  const backupPath = path.join(pesDirectory, 'backup');
  if (!existsSync(backupPath)) {
    mkdirSync(backupPath);
  }

  readdirSync(pesDirectory).forEach((fileName) => {
    // if file or folder is not in ignore list, then backup
    if (!ignoreList.has(fileName)) {
      const fullPath = path.join(pesDirectory, fileName);
      renameSync(fullPath, path.join(backupPath, fileName));
    }
  });
}

async function chooseInitializationFile() {
  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  const initializationFileObj = await dialog.showOpenDialog({
    title: translate(locale, 'addonInitializationChoose.dialogTitle', localeResources),
    properties: ['openFile'],
    filters: [
      { name: '*.zip', extensions: ['zip'] },
    ],
  });
  if (!initializationFileObj.canceled) {
    const initializationFile = initializationFileObj.filePaths[0];
    const fileSize = getFileSize(initializationFile);
    const fileName = path.basename(initializationFile);
    return { fileName, fileSize, filePath: initializationFile };
  }

  return false;
}

async function addonInitialization(fileName, filePath) {
  const folderName = fileName.split('.')[0];
  await decompress(filePath, path.join(path.dirname(filePath), folderName));
}

export { backup, chooseInitializationFile, addonInitialization };
