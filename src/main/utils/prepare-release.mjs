import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ora from 'ora';
import chalk from 'chalk';
import pool from './db.mjs';

async function prepareRelease() {
  let spinner;
  try {
    // write sKeyLicense and releasedAt to activation.js,
    // while insert new (if not yet) sKeyLicense to DB
    const activationPath = path.join('src', 'main', 'services', 'activation.js');
    const activations = readFileSync(activationPath, { encoding: 'utf8' }).split('\n');
    const newReleasedAt = Math.floor(new Date().getTime() / 1000);

    const appVersions = JSON.parse(readFileSync('package.json')).version.split('.');
    const appVersion = `${appVersions[0]}.${appVersions[1]}`;

    spinner = ora('Proses...').start();
    // get sKeyLicense in DB based on current appVersion for check if sKeyLicense
    // with current version has existed or not
    const getSKeyLicenseText = 'SELECT id, version FROM secret_key_license WHERE version = $1';
    const getSKeyLicenseValue = [`${appVersions[0]}.${appVersions[1]}`];
    const sKeyLicenseDB = (await pool.query(getSKeyLicenseText, getSKeyLicenseValue)).rows;

    let changed = 0;
    let newSKeyLicense = null;
    for (const [aIndex, aVal] of activations.entries()) {
      if (/^const sKeyLicense =/.test(aVal)) {
        if (sKeyLicenseDB.length <= 0) {
          newSKeyLicense = crypto.randomBytes(32).toString('hex');
          activations[aIndex] = `const sKeyLicense = '${newSKeyLicense}';`;
          // insert new sKeyLicense to DB
          const insertSKeyLicenseText = `
            INSERT INTO secret_key_license (key, version, created_at)
            VALUES ($1, $2, $3)
          `;
          const insertSKeyLicenseValue = [newSKeyLicense, appVersion, newReleasedAt];
          (await pool.query(insertSKeyLicenseText, insertSKeyLicenseValue)).rowCount;
          console.log(chalk.green(`\nSKeyLicense for this version ${appVersion} successfully insert\n`));
        } else {
          console.log(chalk.dim(`\nSKeyLicense for this version ${appVersion} exist\n`));
        }
        changed++;
      } else if(/^const releasedAt =/.test(aVal)) {
        activations[aIndex] = `const releasedAt = ${newReleasedAt};`;
        changed++;
      }

      if (changed >= 2) break;
    }

    writeFileSync(activationPath, activations.join('\n'));

    // write sKeyLicense
    if (newSKeyLicense) {
      const electronVitis = readFileSync('electron.vite.config.mjs', { encoding: 'utf8' }).split('\n');
      for (const [evIndex, evVal] of electronVitis.entries()) {
        if (/\/\/ secret license key/.test(evVal)) {
          electronVitis[evIndex] = `          '${newSKeyLicense}',// secret license key`;
          break;
        }
      }
      writeFileSync('electron.vite.config.mjs', electronVitis.join('\n'));
    }

    // write releasedAt to create-released-at-file.js file
    const createReleasedAtFilePath = path.join('src', 'main', 'utils', 'create-released-at-file.mjs');
    const createReleasedAtFiles = readFileSync(createReleasedAtFilePath, { encoding: 'utf8' }).split('\n');

    for (const [crafIndex, crafVal] of createReleasedAtFiles.entries()) {
      if (/^const releasedAt =/.test(crafVal)) {
        createReleasedAtFiles[crafIndex] = `const releasedAt = ${newReleasedAt};`;
        break;
      }
    }

    writeFileSync(createReleasedAtFilePath, createReleasedAtFiles.join('\n'));
  } catch (err) {
    console.dir(err);
  } finally {
    await pool.end();
    spinner.stop();
  }
}

prepareRelease();
