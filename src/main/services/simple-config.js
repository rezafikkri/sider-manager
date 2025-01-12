import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  cpSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';
import log from 'electron-log/main';
import { app } from 'electron';
import { generateErrorLogMessage } from '../utils';
import { deleteSetting, getSettings, getSettingsPath, saveSettings } from './settings';
import { chooseDirectory, isFile } from '.';

function readSiderIni(pesDirectory) {
  try {
    const ini = readFileSync(path.join(pesDirectory, 'sider.ini'), { encoding: 'utf-8' });
    return ini.split('\n');
  } catch (err) {
    log.error(generateErrorLogMessage(
      app.getVersion(),
      os.version(),
      process.versions.electron,
      err.stack,
    ));
    return [];
  }
}

function readLiveCpks(pesDirectory) {
  const liveCpks = readdirSync(path.join(pesDirectory, 'content', 'Live CPK'));
  return liveCpks.filter((liveCpk) => !['ML Manager', 'Graphics Menu', 'Press Room'].includes(liveCpk));
}

function readModules(pesDirectory) {
  const modules = readdirSync(path.join(pesDirectory, 'modules'));
  return modules.filter((module) => /\.lua$/.test(module));
}

function editCommonSiderIni(siderIni, newSiderIni) {
  if (newSiderIni.key === 'lua.module' || newSiderIni.key === 'cpk.root') return false;

  // SIIndex = siderIni index, SIVal = siderIni value
  for (const [SIIndex, SIVal] of siderIni.entries()) {
    const regexp = new RegExp(`^${newSiderIni.key} =`);
    if (regexp.test(SIVal)) {
      siderIni[SIIndex] = `${newSiderIni.key} = ${newSiderIni.value}`;

      return true;
    }
  }
  return false;
}

function editLuaModuleLiveCpkSiderIni(siderIni, newSiderIni) {
  if (newSiderIni.key !== 'lua.module' && newSiderIni.key !== 'cpk.root') return false;

  let lastIndex = 0;
  // SIIndex = siderIni index, SIVal = siderIni value
  for (const [SIIndex, SIVal] of siderIni.entries()) {
    const regexpLastIndex = new RegExp(`^${newSiderIni.key} =`);
    if (regexpLastIndex.test(SIVal)) lastIndex = SIIndex;

    const regexStrKey = newSiderIni.key.replace(/\./g, '\\.');
    const regexStrValue = newSiderIni.value.replace(/\\/g, '\\\\').replace(/\./g, '\\.');

    // if lua.module is enabled, then disable
    const regexpEnabled = new RegExp(`^${regexStrKey} = ${regexStrValue}`);
    if (regexpEnabled.test(SIVal)) {
      siderIni[SIIndex] = `; ${siderIni[SIIndex]}`;
      return true;
    }
    const regexDisabled = new RegExp(`^; ${regexStrKey} = ${regexStrValue}`);
    // if lua.module is disabled, then enable
    if (regexDisabled.test(SIVal)) {
      siderIni[SIIndex] = `${newSiderIni.key} = ${newSiderIni.value}`;
      return true
    }
  }

  // create new lua.module, because it not found in sider.ini
  siderIni.splice(lastIndex + 1, 0, `${newSiderIni.key} = ${newSiderIni.value}`);
  return true;
}

function saveSiderIni(newSiderIni) {
  const settings = getSettings();
  const siderIni = readSiderIni(settings.pesDirectory);

  editCommonSiderIni(siderIni, newSiderIni);
  editLuaModuleLiveCpkSiderIni(siderIni, newSiderIni);

  writeFileSync(path.join(settings.pesDirectory, 'sider.ini'), siderIni.join('\n'));

  return true;
}

function toggleMLManagerConfig() {
  const settings = getSettings();
  const pesDirectory = settings.pesDirectory;

  const mlManagerPath = path.join(pesDirectory, 'content', 'Live CPK', 'ML Manager');
  if (!existsSync(mlManagerPath)) {
    mkdirSync(mlManagerPath);
  } else {
    rmSync(mlManagerPath, { recursive: true, force: true });
    deleteSetting('activeMLManager');
  }

  // add new or comment lua code of ML Manager cpk.root in sider.ini
  saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\ML Manager"' });
  return true;
}

function isMLManagerConfigActivated() {
  const settings = getSettings();
  const pesDirectory = settings.pesDirectory;
  const siderIni = readSiderIni(pesDirectory);

  const checkMLManagerPath = existsSync(path.join(pesDirectory, 'content', 'Live CPK', 'ML Manager'));
  let checkMLManagerSiderIni = false;
  for (const ini of siderIni) {
    if (/^cpk\.root = "\.\\content\\Live CPK\\ML Manager"/.test(ini)) {
      checkMLManagerSiderIni = true;
      break;
    }
  }

  if (checkMLManagerPath && checkMLManagerSiderIni) return true;
  return false;
}

function getMLManagerPreview(mlManagerpath) {
  let preview = path.join(mlManagerpath, 'preview');
  if (existsSync(`${preview}.png`)) {
    preview = url.pathToFileURL(`${preview}.png`).toString();
  } else if (existsSync(`${preview}.jpg`)) {
    preview = url.pathToFileURL(`${preview}.jpg`).toString();
  } else {
    return null;
  }

  return preview;
}

function readMLManagers() {
  const settingsPath = getSettingsPath();
  const activeMLManager = getActiveMLManager();

  const mlManagers = readdirSync(path.join(settingsPath, 'ml-manager')).map((mlManager) => {
    let mlManagerpath = path.join(settingsPath, 'ml-manager', mlManager);

    return {
      name: mlManager,
      path: mlManagerpath,
      preview: getMLManagerPreview(mlManagerpath),
      active: false,
    };
  });

  if (activeMLManager) {
    return [
      activeMLManager,
      ...mlManagers.filter((mlManager) => mlManager.name !== activeMLManager?.name)
    ];
  }

  return mlManagers;
}

function chooseMLManager(mlManager) {
  const settings = getSettings();
  const dest = path.join(settings.pesDirectory, 'content', 'Live CPK', 'ML Manager', 'common');

  // remove common directory if exist
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });

  cpSync(path.join(mlManager.path, 'common'), dest, { recursive: true });

  saveSettings({ activeMLManager: { ...mlManager } });

  return true;
}

function getActiveMLManager() {
  const settings = getSettings();
  return settings.activeMLManager;
}

function hasCpkFileInDirecotry(directory) {
  const contents = readdirSync(directory);

  for (const [index, content] of contents.entries()) {
    const fullPath = path.join(directory, content);
    if(isFile(fullPath)) {
      if (/\.cpk$/.test(content)) {
        return true;
      }
    } else {
      const isHas = hasCpkFileInDirecotry(fullPath);
      if (index === contents.length - 1 || isHas) return isHas;
    }
  }

  return false;
}

function saveMLManager(name, directory) {
  const settingsPath = getSettingsPath();
  const dest = path.join(settingsPath, 'ml-manager', name);

  // if after directory direct in it is not common directory or common is file
  const commonPath = path.join(directory, 'common');
  if (!existsSync(commonPath) || isFile(commonPath)) return false;
  // if file .cpk exist in directory
  if (hasCpkFileInDirecotry(directory)) return false;

  cpSync(directory, dest, { recursive: true });
  return {
    name: name,
    path: dest,
    preview: getMLManagerPreview(dest),
    active: false,
  };
}

async function chooseNewSimpleConfigDirectory(title) {
  const directory = await chooseDirectory(title);
  if (directory) {
    return {
      name: path.basename(directory),
      directory,
      preview: getMLManagerPreview(directory),
    };
  }

  return directory;
}

export {
  readSiderIni,
  readModules,
  readLiveCpks,
  saveSiderIni,
  toggleMLManagerConfig,
  isMLManagerConfigActivated,
  readMLManagers,
  chooseMLManager,
  getActiveMLManager,
  saveMLManager,
  chooseNewSimpleConfigDirectory,
};
