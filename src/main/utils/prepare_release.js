const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function prepareRelease() {
  const activation = readFileSync(path.join('src', 'main', 'services', 'activation.js'), 'utf8');
  console.dir(activation.split('\n'));
  const newSKeyLicense = crypto.randomBytes(32).toString('hex');


}

prepareRelease();
