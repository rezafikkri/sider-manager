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

function toggleSimpleConfig(configName) {
  const settings = getSettings();
  const pesDirectory = settings.pesDirectory;

  const simpleConfigPath = path.join(pesDirectory, 'content', 'Live CPK', configName);
  if (!existsSync(simpleConfigPath)) {
    mkdirSync(simpleConfigPath);
  } else {
    rmSync(simpleConfigPath, { recursive: true, force: true });
    deleteSetting(`active${configName.replace(/\s/g, '')}`);
  }

  // add new or comment lua code of simple config cpk.root in sider.ini
  saveSiderIni({ key: 'cpk.root', value: `".\\content\\Live CPK\\${configName}"` });
  return true;
}

function toggleMLManagerConfig() {
  return toggleSimpleConfig('ML Manager');
}

function toggleGraphicsMenuConfig() {
  return toggleSimpleConfig('Graphics Menu');
}

function togglePressRoomConfig() {
  return toggleSimpleConfig('Press Room');
}

function isSimpleConfigActivated(configName) {
  const settings = getSettings();
  const pesDirectory = settings.pesDirectory;
  const siderIni = readSiderIni(pesDirectory);

  const checkSimpleConfigPath = existsSync(path.join(pesDirectory, 'content', 'Live CPK', configName));
  let checkSimpleConfigSiderIni = false;
  for (const ini of siderIni) {
    const regexp = new RegExp(`^cpk\\.root = "\\.\\\\content\\\\Live CPK\\\\${configName}"`);
    if (regexp.test(ini)) {
      checkSimpleConfigSiderIni = true;
      break;
    }
  }

  if (checkSimpleConfigPath && checkSimpleConfigSiderIni) return true;
  return false;
}

function isMLManagerConfigActivated() {
  return isSimpleConfigActivated('ML Manager');
}

function isGraphicsMenuConfigActivated() {
  return isSimpleConfigActivated('Graphics Menu');
}

function isPressRoomConfigActivated() {
  return isSimpleConfigActivated('Press Room');
}

function getSimpleConfigPreview(simpleConfigPath) {
  let preview = path.join(simpleConfigPath, 'preview');
  if (existsSync(`${preview}.png`)) {
    preview = url.pathToFileURL(`${preview}.png`).toString();
  } else if (existsSync(`${preview}.jpg`)) {
    preview = url.pathToFileURL(`${preview}.jpg`).toString();
  } else {
    return null;
  }

  return preview;
}

function getActiveSimpleConfig(configName) {
  const settings = getSettings();
  return settings[`active${configName.replace(/\s/g, '')}`];
}

function readSimpleConfigs(configName) {
  const settingsPath = getSettingsPath();
  const activeSimpleConfig = getActiveSimpleConfig(configName)
  const dirname = configName.replace(/\s/g, '-').toLowerCase();

  const simpleConfigs = readdirSync(path.join(settingsPath, dirname)).map((simpleConfig) => {
    let simpleConfigPath = path.join(settingsPath, dirname, simpleConfig);

    return {
      name: simpleConfig,
      path: simpleConfigPath,
      preview: getSimpleConfigPreview(simpleConfigPath),
      active: false,
    };
  });

  if (activeSimpleConfig) {
    return [
      activeSimpleConfig,
      ...simpleConfigs.filter((mlManager) => mlManager.name !== activeSimpleConfig?.name)
    ];
  }

  return simpleConfigs;
}

function readMLManagers() {
  return readSimpleConfigs('ML Manager');
}

function readGraphicsMenu() {
  return readSimpleConfigs('Graphics Menu');
}

function readPressRooms() {
  return readSimpleConfigs('Press Room');
}

function chooseSimpleConfig(configName, configData) {
  const settings = getSettings();
  const dest = path.join(settings.pesDirectory, 'content', 'Live CPK', configName, 'common');

  // remove common directory if exist
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });

  cpSync(path.join(configData.path, 'common'), dest, { recursive: true });

  saveSettings({ [`active${configName.replace(/\s/g, '')}`]: { ...configData } });

  return true;
}

function chooseMLManager(mlManager) {
  return chooseSimpleConfig('ML Manager', mlManager);
}

function chooseGraphicMenu(graphicMenu) {
  return chooseSimpleConfig('Graphics Menu', graphicMenu);
}

function choosePressRoom(pressRoom) {
  return chooseSimpleConfig('Press Room', pressRoom);
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

function saveSimpleConfig(configName, dataName, directory) {
  const settingsPath = getSettingsPath();
  const dest = path.join(settingsPath, configName.replace(/\s/g, '-').toLowerCase(), dataName);

  // if after directory direct in it is not common directory or common is file
  const commonPath = path.join(directory, 'common');
  if (!existsSync(commonPath) || isFile(commonPath)) return false;

  cpSync(directory, dest, { recursive: true });
  return {
    name: dataName,
    path: dest,
    preview: getSimpleConfigPreview(dest),
    active: false,
  };
}

function saveMLManager(name, directory) {
  // if file .cpk exist in directory
  if (hasCpkFileInDirecotry(directory)) return false;

  return saveSimpleConfig('ML Manager', name, directory);
}

function saveGraphicMenu(name, directory) {
  return saveSimpleConfig('Graphics Menu', name, directory);
}

function savePressRoom(name, directory) {
  return saveSimpleConfig('Press Room', name, directory);
}

async function chooseNewSimpleConfigDirectory(title) {
  const directory = await chooseDirectory(title);
  if (directory) {
    return {
      name: path.basename(directory),
      directory,
      preview: getSimpleConfigPreview(directory),
    };
  }

  return directory;
}

function deleteSimpleConfig(configName, dataName) {
  const settingsPath = getSettingsPath();
  const mlManagerPath = path.join(settingsPath, configName.replace(/\s/g, '-').toLowerCase(), dataName);
  rmSync(mlManagerPath, { recursive: true, force: true });
  return true;
}

function deleteMLManager(name) {
  return deleteSimpleConfig('ML Manager', name);
}

function deleteGraphicMenu(name) {
  return deleteSimpleConfig('Graphics Menu', name);
}

function deletePressRoom(name) {
  return deleteSimpleConfig('Press Room', name);
}

export {
  readSiderIni,
  readModules,
  readLiveCpks,
  saveSiderIni,
  toggleMLManagerConfig,
  toggleGraphicsMenuConfig,
  togglePressRoomConfig,
  isMLManagerConfigActivated,
  isGraphicsMenuConfigActivated,
  isPressRoomConfigActivated,
  readMLManagers,
  readGraphicsMenu,
  readPressRooms,
  chooseMLManager,
  chooseGraphicMenu,
  choosePressRoom,
  saveMLManager,
  saveGraphicMenu,
  savePressRoom,
  chooseNewSimpleConfigDirectory,
  deleteMLManager,
  deleteGraphicMenu,
  deletePressRoom,
};
