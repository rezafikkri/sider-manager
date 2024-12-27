import { readFileSync, writeFileSync } from 'node:fs';
import { getSettings } from './settings';
import path from 'node:path';

function readSiderIni(pesDirectory) {
  const ini = readFileSync(path.join(pesDirectory, 'sider.ini'), { encoding: 'utf-8' });
  return ini.split('\n');
}

function saveSiderIni(newSiderIni) {
  const settings = getSettings();
  const siderIni = readSiderIni(settings.pesDirectory);

  // SIIndex = siderIni index, SIVal = siderIni value
  for (const [SIIndex, SIVal] of siderIni.entries()) {
    const regexp = new RegExp(`^${newSiderIni.key} =`);
    if (regexp.test(SIVal)) {
      const [, oVal] = SIVal.split('=');
      // if original value of siderIni is not a NaN, then convert newSiderIni value to integer
      if (!isNaN(oVal)) {
        siderIni[SIIndex] = `${newSiderIni.key} = ${parseInt(newSiderIni.value)}`;
      } else {
        siderIni[SIIndex] = `${newSiderIni.key} = ${newSiderIni.value}`;
      }

      break;
    }
  }

  writeFileSync(path.join(settings.pesDirectory, 'sider.ini'), siderIni.join('\n'));

  return true;
}

export {
  readSiderIni,
  saveSiderIni,
};
