import { readFileSync, writeFileSync } from 'node:fs';
import { getSettings } from './settings';
import path from 'node:path';

function readSiderIni(pesDirectory) {
  const ini = readFileSync(path.join(pesDirectory, 'sider.ini'), { encoding: 'utf-8' });
  return ini.split('\n');
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
  saveSiderIni,
};
