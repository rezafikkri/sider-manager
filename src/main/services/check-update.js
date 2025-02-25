import needle from 'needle';
import path from 'node:path';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { app, Notification } from 'electron';
import log from 'electron-log/main';
import os from 'node:os';
import jwt from 'jsonwebtoken';
import { getSettingsPath, getSettings } from './settings';
import { generateErrorLogMessage } from '../utils';
import { getLocaleResources } from './locale';
import { translate } from '../utils';
import UnauthorizeError from '../exceptions/UnauthorizeError';
import { decrypt, encrypt } from './encrypt-decrypt';

const cid = '882426195302-d85q810np449r40iqg2t6j79ubcm2ts2.apps.googleusercontent.com';
const csec = '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';
const rt = '1//047LICTKVSZJiCgYIARAAGAQSNwF-L9IrABeN4tU2T0gyTovrEleRTz5jmMfJF6LmNZIHiT9DD-OUF-JZ871p-0QHqfGEACc-VBs';

async function loadAccessToken() {
  const gdAtPath = path.join(getSettingsPath(), 'gd-at.json');
  if (!existsSync(gdAtPath)) {
    await refreshAT();
  }

  const aTEncrypted = JSON.parse(readFileSync(gdAtPath));
  return decrypt(aTEncrypted.at);
}

async function refreshAT() {
  const url = 'https://oauth2.googleapis.com/token';
  const data = `client_id=${cid}&client_secret=${csec}&refresh_token=${rt}&grant_type=refresh_token`;
  const res = await needle('post', url, data, {
    header: { content_type: 'application/x-www-form-urlencoded' }
  });
  if (res.statusCode !== 200) throw new Error(JSON.stringify(res.body));

  // encrypt access token
  const encryptedAT = encrypt(res.body.access_token);

  const newAccessToken = { at: encryptedAT };
  writeFileSync(path.join(getSettingsPath(), 'gd-at.json'), JSON.stringify(newAccessToken));
}

async function get(url, accessToken) {
  const res = await needle('get', url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (res.statusCode === 401) {
    refreshAT(rt);
    throw new UnauthorizeError(JSON.stringify(res.body));
  }
  if (res.statusCode !== 200) throw new Error(JSON.stringify(res.body));
  return res.body;
}

async function getFolders() {
  try {
    const accessToken = await loadAccessToken();
    const url = 'https://www.googleapis.com/drive/v3/files?orderBy=name_natural%20desc&q=%27upload-sider-manager%40caramel-vim-451414-b6.iam.gserviceaccount.com%27%20in%20owners%20and%20mimeType%20%3D%20%27application%2Fvnd.google-apps.folder%27';
    const body = await get(url, accessToken);
    return body.files;
  } catch (err) {
    if (!(err instanceof UnauthorizeError)) {
      log.error(generateErrorLogMessage(
        app.getVersion(),
        os.version(),
        process.versions.electron,
        err.stack,
      ));
    }
    return false;
  }
}

function getCheckUpdate(checkUpdateFilePath) {
  return JSON.parse(readFileSync(checkUpdateFilePath));
}

function checkSmallerThanVersion(currentVersion, latestVersion) {
  const arrCurrent = currentVersion.split('.');
  const arrLatest = latestVersion.split('.');

  // if major current < major latest
  if (parseInt(arrCurrent[0]) < parseInt(arrLatest[0])) {
    return true;
  } else if (parseInt(arrCurrent[0]) === parseInt(arrLatest[0])) {
    // if minor current < minor latest
    if (parseInt(arrCurrent[1]) < parseInt(arrLatest[1])) {
      return true;
    } else if (parseInt(arrCurrent[1]) === parseInt(arrLatest[1])) {
      // if patch current < patch latest
      if (parseInt(arrCurrent[2]) < parseInt(arrLatest[2])) {
        return true;
      }
    }
  }

  return false;
}

// this is for get released at of latest version of application release
async function getReleasedAt(folderId) {
  try {
    const accessToken = await loadAccessToken();
    const urlGetFileId = `https://www.googleapis.com/drive/v3/files?q=name%3D%27released-at.txt%27%20and%20%27${folderId}%27%20in%20parents`;
    const bodyFileId = await get(urlGetFileId, accessToken);
    const fileId = bodyFileId.files[0].id;

    // get content
    const urlGetContent = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const bodyContent = await get(urlGetContent, accessToken);
    return parseInt(bodyContent);
  } catch (err) {
    if (!(err instanceof UnauthorizeError)) {
      log.error(generateErrorLogMessage(
        app.getVersion(),
        os.version(),
        process.versions.electron,
        err.stack,
      ));
    }
    return false;
  }
}

function getSMTempDirPath() {
  return path.join(app.getPath('temp'), 'sider-manager');
}

export default async function checkUpdate() {
  // check if native notification is support or not
  if (!Notification.isSupported()) return false;

  const { locale } = getSettings();
  const localeResources = getLocaleResources();
  const currentAppVersion = app.getVersion();
  const tempDirPath = getSMTempDirPath();
  // create sider-manager temp dir if does not exist
  if (!existsSync(tempDirPath)) {
    mkdirSync(tempDirPath, { recursive: true });
  }

  const checkUpdateFilePath = path.join(tempDirPath, 'check-update.json');
  const isCheckUpdateExist = existsSync(checkUpdateFilePath);
  if (isCheckUpdateExist) {
    const latestCheckUpdateVersion = getCheckUpdate(checkUpdateFilePath).version;
    const limitCheckUpdate = getCheckUpdate(checkUpdateFilePath).limitTime;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (currentTime < limitCheckUpdate) return false;

    const versions = await getFolders();
    if (!versions) return false;
    const latestReleaseVersion = versions[0].name.replace('v', '');

    // if (currentAppVersion < latestReleaseVersion && latestCheckUpdateVersion < latestReleaseVersion) {
    if (checkSmallerThanVersion(currentAppVersion, latestReleaseVersion) &&
      checkSmallerThanVersion(latestCheckUpdateVersion, latestReleaseVersion)) {
      // show notifications and update check-update.json file
      new Notification({
        title: translate(locale, 'notification.title', localeResources),
        body: translate(locale, 'notification.body', localeResources, latestReleaseVersion),
      }).show();

      // get released-at.txt content
      const releasedAt = await getReleasedAt(versions[0].id);
      if (!releasedAt) return false;

      writeFileSync(checkUpdateFilePath, JSON.stringify({
        version: latestReleaseVersion,
        limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2), // 2 days
        releasedAt,
      }));

      return true;
    }

    return false;
  }

  const versions = await getFolders();
  if (!versions) return false;
  const latestReleaseVersion = versions[0].name.replace('v', '');

  // if (currentAppVersion < latestReleaseVersion) {
  if (checkSmallerThanVersion(currentAppVersion, latestReleaseVersion)) {
    // show notifications and create check-update.json file
    new Notification({
      title: translate(locale, 'notification.title', localeResources),
      body: translate(locale, 'notification.body', localeResources, latestReleaseVersion),
    }).show();

    // get released-at.txt content
    const releasedAt = await getReleasedAt(versions[0].id);
    if (!releasedAt) return false;

    writeFileSync(checkUpdateFilePath, JSON.stringify({
      version: latestReleaseVersion,
      limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2), // 2 days
      releasedAt,
    }));
  }
}

function getRegistered() {
  const tempDirPath = getSMTempDirPath();
  const settingsPath = getSettingsPath();
  const keysPath = path.join(settingsPath, 'key.json');

  if (!existsSync(keysPath)) return false;

  const keys = JSON.parse(readFileSync(keysPath));
  const decodedLicenseKey = jwt.decode(keys.aKey);

  // generate message for update information
  let updateMessage = null;
  let checkUpdate = null;
  const checkUpdatePath = path.join(tempDirPath, 'check-update.json');
  if (existsSync(checkUpdatePath)) {
    checkUpdate = JSON.parse(readFileSync(checkUpdatePath));

    // check if current installed app version < latestReleaseVersion
    if (checkSmallerThanVersion(app.getVersion(), checkUpdate.version)) {
      if ((checkUpdate.releasedAt - decodedLicenseKey.iat) / (60*60*24*365.25) >= 1) {
        updateMessage = 'availableAndMustUpgrade';
      } else {
        updateMessage = 'available';
      }
    }
  }

  return {
    at: decodedLicenseKey.iat,
    until: decodedLicenseKey.iat + (60*60*24*365.25),
    name: decodedLicenseKey.name,
    email: decodedLicenseKey.email,
    updateMessage,
    latestReleaseVersion: checkUpdate?.version,
  };
}

export {
  checkSmallerThanVersion,
  getRegistered,
};
