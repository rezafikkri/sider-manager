import { app } from 'electron';
import log from 'electron-log/main';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { generateErrorLogMessage } from '../utils';
import { getSettingsPath } from './settings';
import pool from '../utils/db';
import MustUpgradeLicenseKeyError from '../exceptions/MustUpgradeLicenseKeyError';

const sKeyLicense = '42d36b6f54550304c82d30a925298f008820b0bebaee0efd1595911a47f13097';
const releasedAt = 1740468984;

// for ensure user activate is using form
function getSKeyCheck(sKeyLicense) {
  const sKeyLicenseSnippet = sKeyLicense.substring(1, 20);
  const hostname = os.hostname();
  const cpuModel = os.cpus()[0].model;

  const sKeyCheck = sKeyLicenseSnippet + hostname + cpuModel;
  return sKeyCheck.replace(/[\s,\(,\),.,#,@,:]/g, '');
}

function validateLicenseKey(aKey, sKeyLicense) {
  const decodedLicenseKey = jwt.verify(aKey, sKeyLicense);
  // check if currently used license key is still eligible to use the currently installed version of the application
  if ((releasedAt - decodedLicenseKey.iat) / (60*60*24*365.25) >= 1) {
    throw new MustUpgradeLicenseKeyError();
  }

  return decodedLicenseKey;
}

function checkLicenseKeyHasBeenUsed() {
  try {
    const keyPath = path.join(getSettingsPath(), 'key.json');
    if (!existsSync(keyPath)) return false;

    const keys = JSON.parse(readFileSync(keyPath));
    // validate license key
    validateLicenseKey(keys.aKey, sKeyLicense);
    return true;
  } catch (err) {
    if (err.name === 'MustUpgradeLicenseKeyError') {
      return err.message;
    }
    return false;
  }
}

function isActivated() {
  try {
    const keyPath = path.join(getSettingsPath(), 'key.json');
    if (!existsSync(keyPath)) return false;

    const keys = JSON.parse(readFileSync(keyPath));
    // validate license key
    validateLicenseKey(keys.aKey, sKeyLicense);

    // validate check key
    const sKeyCheck = getSKeyCheck(sKeyLicense);
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

async function activate(licenseKey) {
  let client;

  try {
    // validate license key
    const decodedLicenseKey = validateLicenseKey(licenseKey, sKeyLicense);

    // if licenseKey type is online
    if (decodedLicenseKey.type === 'online') {
      client = await pool.connect();

      // start transaction
      await client.query('START TRANSACTION');
      const getLicenseKeyText = 'SELECT id, used_for_activate FROM license_key where key = $1 FOR UPDATE';
      const getLicenseKeyValue = [licenseKey];
      const licenseKeyDB = (await client.query(getLicenseKeyText, getLicenseKeyValue)).rows;

      // then check if license key exist in db
      if (licenseKeyDB.length <= 0 || licenseKeyDB[0].used_for_activate) await client.query('ROLLBACK');
      if (licenseKeyDB.length <= 0) return 'licenseKeyInvalid';
      if (licenseKeyDB[0].used_for_activate) return 'licenseKeyHasBeenUsed';

      // update license key used in db
      const updateLicenseKeyUsedText = 'UPDATE license_key set used_for_activate = $1 WHERE id = $2';
      const updateLicenseKeyUsedValue = [true, licenseKeyDB[0].id];
      const rowCount = (await client.query(updateLicenseKeyUsedText, updateLicenseKeyUsedValue)).rowCount;
      if (rowCount <= 0) {
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('COMMIT');
    }

    // generate check key
    const sKeyCheck = getSKeyCheck(sKeyLicense);
    const checkKey = jwt.sign({ version: decodedLicenseKey.version }, sKeyCheck);
    // save license key and check key to file
    const settingPath = getSettingsPath();
    writeFileSync(
      path.join(settingPath, 'key.json'),
      JSON.stringify({ aKey: licenseKey, cKey: checkKey }),
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

    if (err.name === 'JsonWebTokenError') {
      return 'licenseKeyInvalid';
    } else if (err.name === 'MustUpgradeLicenseKeyError') {
      return 'mustUpgradeLicenseKey';
    }
    return false;
  } finally {
    // release client
    if (client) client.release();
  }
}

export {
  releasedAt,
  isActivated,
  activate,
  checkLicenseKeyHasBeenUsed,
};
