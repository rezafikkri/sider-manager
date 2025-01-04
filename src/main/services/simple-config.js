import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import log from 'electron-log/main';
import { app } from 'electron';
import { generateErrorLogMessage } from '../utils';
import { getSettings } from './settings';

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
  return readdirSync(path.join(pesDirectory, 'content', 'Live CPK'));
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

function editLuaModuleCpkLiveSiderIni(siderIni, newSiderIni) {
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
  editLuaModuleCpkLiveSiderIni(siderIni, newSiderIni);

  writeFileSync(path.join(settings.pesDirectory, 'sider.ini'), siderIni.join('\n'));

  return true;
}

export {
  readSiderIni,
  readModules,
  readLiveCpks,
  saveSiderIni,
};
