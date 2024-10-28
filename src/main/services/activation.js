import { app } from 'electron';
import log from 'electron-log/main';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { generateErrorLogMessage } from '../utils';
import { getSettingsPath } from './settings';
import pool from '../utils/db';
import ActivationKeyInvalidError from '../exceptions/ActivationKeyInvalidError';

const sKeyActivate = '42d36b6f54550304c82d30a925298f008820b0bebaee0efd1595911a47f13097';

// for ensure user activate is using form
function getSKeyCheck(sKeyActivate) {
  const sKeyActivateSnippet = sKeyActivate.substring(1, 20);
  const hostname = os.hostname();
  const cpuModel = os.cpus()[0].model;
  const totalMem = os.totalmem();
  const version = os.version();

  const sKeyCheck = sKeyActivateSnippet + hostname + cpuModel + totalMem + version;
  return sKeyCheck.replace(/[\s,\(,\),.,#,@,:]/g, '');
}

function validateActivationKey(aKey, sKeyActivate) {
  const decodedActivationKey = jwt.verify(aKey, sKeyActivate);
  const activationKeyVersion = decodedActivationKey.version.split('.')[0];
  const appVersion = app.getVersion().split('.')[0];
  // check if MAJOR version in activation_key is equal to MAJOR version from current app
  if (activationKeyVersion !== appVersion) {
    throw new ActivationKeyInvalidError('activationKeyInvalid');
  }
  return decodedActivationKey;
}

function isActivated() {
  try {
    const keyPath = path.join(getSettingsPath(), 'key.json');
    if (!existsSync(keyPath)) return false;

    const keys = JSON.parse(readFileSync(keyPath));
    // validate activation key
    validateActivationKey(keys.aKey, sKeyActivate);

    // validate check key
    const sKeyCheck = getSKeyCheck(sKeyActivate);
    jwt.verify(keys.cKey, sKeyCheck);
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

async function activate(activationKey) {
  let client;

  try {
    // validate activation key
    const decodedActivationKey = validateActivationKey(activationKey, sKeyActivate);

    // if activationKey type is online
    if (decodedActivationKey.type === 'online') {
      client = await pool.connect();

      // start transaction
      await client.query('START TRANSACTION');
      const getActivationKeyText = `SELECT id, used FROM activation_key where key = $1 FOR UPDATE`;
      const getActivationKeyValue = [activationKey];
      const activationKeyDB = (await client.query(getActivationKeyText, getActivationKeyValue)).rows;

      // then check if activation key exist in db
      if (activationKeyDB.length <= 0 || activationKeyDB[0].used > 0) await client.query('ROLLBACK');
      if (activationKeyDB.length <= 0) return 'activationKeyInvalid';
      if (activationKeyDB[0].used > 0) return 'activationKeyHasBeenUsed';

      // update activation key used in db
      const updateActivationKeyUsedText = 'UPDATE activation_key set used = $1 WHERE id = $2';
      const updateActivationKeyUsedValue = [++activationKeyDB[0].used, activationKeyDB[0].id];
      const rowCount = (await client.query(updateActivationKeyUsedText, updateActivationKeyUsedValue)).rowCount;
      if (rowCount <= 0) {
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('COMMIT');
    }

    // generate check key
    const sKeyCheck = getSKeyCheck(sKeyActivate);
    const checkKey = jwt.sign({ version: decodedActivationKey.version }, sKeyCheck);
    // save activation key and check key to file
    const settingPath = getSettingsPath();
    writeFileSync(
      path.join(settingPath, 'key.json'),
      JSON.stringify({ aKey: activationKey, cKey: checkKey }),
    );

    return true;
  } catch (err) {
    // rollback transaction
    if (client) await client.query('ROLLBACK');

    log.error(generateErrorLogMessage(
      app.getVersion(),
      os.version(),
      process.versions.electron,
      err.stack,
    ));

    if (err.name === 'JsonWebTokenError' || err.name === 'ActivationKeyInvalidError') {
      return 'activationKeyInvalid';
    }
    return false;
  } finally {
    // release client
    if (client) client.release();
  }
}

export {
  isActivated,
  activate,
};
