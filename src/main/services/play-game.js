import { readFileSync, existsSync } from 'node:fs';
import util from 'node:util';
import { app } from 'electron';
import os from 'node:os';
import log from 'electron-log/main';
import childProcess from 'node:child_process';
import path from 'node:path';
import { getSettingsFilePath } from './settings';
import { generateErrorLogMessage } from '../utils';

async function playGame() {
  try {
    const settingFilePath = getSettingsFilePath();
    const setting = JSON.parse(readFileSync(settingFilePath));
    const pes2017Exe = path.join(setting.pesDirectory, setting.pesExecutable[0]);
    const siderExe = path.join(setting.pesDirectory, setting.pesExecutable[1]);

    // check if executable exist or not in pes directory
    if (!existsSync(siderExe)) {
      return 'siderExeNotFound';
    } else if (!existsSync(pes2017Exe)) {
      return 'pesExeNotFound';
    }

    const execFile = util.promisify(childProcess.execFile);
    await Promise.all([execFile(siderExe), execFile(pes2017Exe)]);

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

export {
  playGame,
};
