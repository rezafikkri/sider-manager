import { dialog, app } from 'electron';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  cpSync,
  renameSync,
  rmSync,
} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import log from 'electron-log/main';
import { getSettings, getSettingsPath } from './settings';
import { getLocaleResources } from './locale';
import { translate, generateErrorLogMessage } from '../utils';
import { getFileSize, isFile } from '.';
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

function backup(settings) {
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
      const dest = path.join(backupPath, fileName);

      if (isFile(fullPath)) {
        renameSync(fullPath, dest);
      } else {
        cpSync(fullPath, dest, { recursive: true });
        rmSync(fullPath, { recursive: true, force: true });
      }
    }
  });
}

async function addonInitialization(filePath) {
  const settings = getSettings();
  const pesDirectory = settings.pesDirectory;

  try {
    // run backup
    backup(settings);

    // extract zip file
    const outputDir = path.basename(filePath, '.zip');
    const fileDir = path.dirname(filePath);
    const extractPath = path.join(fileDir, outputDir);
    await decompress(filePath, fileDir);

    // move folder to appData
    const extractMlManagerPath = path.join(extractPath, 'ML Manager');
    const extractGraphicsMenuPath = path.join(extractPath, 'Graphics Menu');
    const extractTeamPressRoomPath = path.join(extractPath, 'Press Room');
    const settingsPath = getSettingsPath();
    cpSync(
      extractMlManagerPath,
      path.join(settingsPath, 'ml-manager'),
      { recursive: true },
    );
    cpSync(
      extractGraphicsMenuPath,
      path.join(settingsPath, 'graphics-menu'),
      { recursive: true },
    );
    cpSync(
      extractTeamPressRoomPath,
      path.join(settingsPath, 'press-room'),
      { recursive: true },
    );
    rmSync(extractMlManagerPath, { recursive: true, force: true });
    rmSync(extractGraphicsMenuPath, { recursive: true, force: true });
    rmSync(extractTeamPressRoomPath, { recursive: true, force: true });

    // move folder and file to PES 2017 installation directory
    readdirSync(extractPath).forEach((fileName) => {
      const fullPath = path.join(extractPath, fileName);
      const dest = path.join(pesDirectory, fileName);

      if (isFile(fullPath)) {
        renameSync(fullPath, dest);
      } else {
        cpSync(fullPath, dest, { recursive: true });
      }
    });
    rmSync(extractPath, { recursive: true, force: true });
    return true;
  } catch (err) {
    log.error(generateErrorLogMessage(
      app.getVersion(),
      os.version(),
      process.versions.electron,
      err.stack,
    ));
    return false;
  }
}

export { backup, chooseInitializationFile, addonInitialization };
