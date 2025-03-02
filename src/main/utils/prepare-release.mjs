import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import pool from './db.mjs';

async function prepareRelease() {
  let spinner;
  try {
    // write releasedAt to activation.js,
    const activationPath = path.join('src', 'main', 'services', 'activation.js');
    const activations = readFileSync(activationPath, { encoding: 'utf8' }).split('\n');
    const newReleasedAt = Math.floor(new Date().getTime() / 1000);

    spinner = ora('Proses...').start();

    for (const [aIndex, aVal] of activations.entries()) {
      if(/^const releasedAt =/.test(aVal)) {
        activations[aIndex] = `const releasedAt = ${newReleasedAt};`;
        break;
      }
    }

    writeFileSync(activationPath, activations.join('\n'));

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
