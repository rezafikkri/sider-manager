import crypto from 'node:crypto';

// using crypto.randomBytes(32).toString('hex')
const key = 'e3bd81ea98ded3711c5df7761c12f420e0bb88d38073c64331d236a64460ade7';

function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const chiper = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = chiper.update(data);

  encrypted = Buffer.concat([encrypted, chiper.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data) {
  const dataParts = data.split(':');
  const iv = Buffer.from(dataParts.shift(), 'hex');
  const encryptedData = Buffer.from(dataParts.join(''), 'hex');
  const dechiper = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = dechiper.update(encryptedData);

  decrypted = Buffer.concat([decrypted, dechiper.final()]);

  return decrypted.toString();
}

export {
  encrypt,
  decrypt,
};
