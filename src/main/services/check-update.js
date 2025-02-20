import needle from 'needle';
import path from 'node:path';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { app, Notification } from 'electron';
import log from 'electron-log/main';
import os from 'node:os';
import { getSettingsPath, getSettings } from './settings';
import { generateErrorLogMessage } from '../utils';
import { getLocaleResources } from './locale';
import { translate } from '../utils';
import UnauthorizeError from '../exceptions/UnauthorizeError';

const cid = '1067594218718-jue7kr807nc2nl08f1fpslk8v4mq70qs.apps.googleusercontent.com';
const csec = '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';
const rt = '1//04XwgAsM6hakgCgYIARAAGAQSNwF-L9Irlw0j6pApykBsA6CzjBvvIzabHe3IXaSCWd3QKA0lNEp7naZDbybj3m4qzwPkslMSsk0';

async function loadAccessToken() {
  const gdAtPath = path.join(getSettingsPath(), 'gd-at.json');
  if (!existsSync(gdAtPath)) {
    await refreshAT();
  }

  return JSON.parse(readFileSync(gdAtPath));
}

async function refreshAT() {
  const url = 'https://oauth2.googleapis.com/token';
  const data = `client_id=${cid}&client_secret=${csec}&refresh_token=${rt}&grant_type=refresh_token`;
  const res = await needle('post', url, data, {
    header: { content_type: 'application/x-www-form-urlencoded' }
  });
  if (res.statusCode !== 200) throw new Error(JSON.stringify(res.body));

  const newAccessToken = { at: res.body.access_token };
  writeFileSync(path.join(getSettingsPath(), 'gd-at.json'), JSON.stringify(newAccessToken));
}

async function getFolders() {
  const { at: accessToken } = await loadAccessToken();
  try {
    const url = 'https://www.googleapis.com/drive/v3/files?orderBy=name_natural%20desc&q=%27upload-sm%40release-sider-manager.iam.gserviceaccount.com%27%20in%20owners%20and%20mimeType%20%3D%20%27application%2Fvnd.google-apps.folder%27';
    const res = await needle('get', url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (res.statusCode === 401) {
      refreshAT(rt);
      throw new UnauthorizeError(JSON.stringify(res.body));
    }
    if (res.statusCode !== 200) throw new Error(JSON.stringify(res.body));

    return res.body.files;
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

export default async function checkUpdate() {
  // check if native notification is support or not
  if (!Notification.isSupported()) return false;

  const { locale } = getSettings();
  const localeResources = getLocaleResources();

  const currentAppVersion = app.getVersion();

  const tempDirPath = path.join(app.getPath('temp'), 'sider-manager');
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

      writeFileSync(checkUpdateFilePath, JSON.stringify({
        version: latestReleaseVersion,
        limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2), // 2 days
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

    writeFileSync(checkUpdateFilePath, JSON.stringify({
      version: latestReleaseVersion,
      limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2), // 2 days
    }));
  }
}

export { checkSmallerThanVersion };
