import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  vi,
  expect,
} from 'vitest';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import log from 'electron-log/main';
import { activate, checkLicenseKeyHasBeenUsed, isActivated } from '../../src/main/services/activation';
import pool from '../../src/main/utils/db';
import path from 'node:path';

const appVersion = '2.1.0';

beforeAll(() => {
  vi.mock('../../src/main/services/create-main-window', () => ({
    default: () => 'main-window',
  }));

  vi.mock('electron', () => {
    return {
      app: {
        getPath: () => '',
        getVersion: () => appVersion,
      },
    }
  });

  vi.mock('node:fs', () => ({
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  }));

  vi.mock('../../src/main/utils', () => ({
    generateErrorLogMessage: vi.fn(),
  }));
});

beforeEach(() => {
  jwt._verify = jwt.verify;
  jwt._sign = jwt.sign;
  pool._connect = pool.connect;
});

afterEach(() => {
  vi.clearAllMocks();

  jwt.verify = jwt._verify;
  jwt.sign = jwt._sign;
  pool.connect = pool._connect;
  delete jwt._verify;
  delete jwt._sign;
  delete pool._connect;
});

describe('isActivated function', () => {
  it('should return false when key.json file is not exist', async () => {
    const { existsSync } = await import('node:fs');
    existsSync.mockReturnValue(false);

    const result = isActivated();

    expect(result).toBe(false);
  });

  it('should return true when licenseKey and checkKey is valid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue("{}");
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 7);
    jwt.verify = () => ({ iat });

    const result = isActivated();

    expect(result).toBe(true);
  });

  it('should call log.error function and return false when licenseKey is invalid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{ "aKey": "wrong" }');
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: licenseKey is invalid');
    log.error = vi.fn();

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: licenseKey is invalid');
    expect(result).toBe(false);
  });

  it('should call log.error function and return false when licenseKey cannot be used for this version of application', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{}');
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 468);
    jwt.verify = () => ({ iat });
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: licenseKey cannot be used for this version of application');
    log.error = vi.fn();

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: licenseKey cannot be used for this version of application');
    expect(result).toBe(false);
  });

  it('should call log.error function and return false when checkKey is invalid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(JSON.stringify({ cKey: 'check-key' }));
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 20);
    jwt.verify = (cKey) => {
      if (cKey === 'check-key') {
        throw new JsonWebTokenError;
      }
      return { iat };
    }
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: checkKey is invalid');

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: checkKey is invalid');
    expect(result).toBe(false);
  });
});

describe('activate function', () => {
  it('should call query function (with START TRANSACTION, correctly update argument, COMMIT and without ROLLBACK), call client.release function, save licenseKey to file and return true when activation type is online and licenseKey is valid', async () => {
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 150);
    jwt.verify = () => ({ type: 'online', iat });
    jwt.sign = () => 'test-check-key';
    const { writeFileSync } = await import('node:fs');
    const licenseKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [{ id: '12345fdg', used_for_activate: false }] }),
      release: vi.fn(),
    });
    const client = await pool.connect();
    const updateLicenseKeyUsedText = 'UPDATE license_key set used_for_activate = $1 WHERE id = $2';
    const updateLicenseKeyUsedValue = [true, '12345fdg'];
    const keyFilePath = path.join('sider-manager', 'key.json');

    const result = await activate(licenseKey);

    expect(client.query).toHaveBeenCalledWith('START TRANSACTION');
    expect(client.query).toHaveBeenCalledWith('COMMIT');
    expect(client.query).toHaveBeenCalledWith(
      updateLicenseKeyUsedText,
      updateLicenseKeyUsedValue,
    );
    expect(client.query).not.toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      keyFilePath,
      JSON.stringify({ aKey: licenseKey, cKey: 'test-check-key' }),
    );
    expect(result).toBe(true);
  });

  it('should not call query function, not call client.release function, save licenseKey to file and return true when activation type is offline and licenseKey is valid', async () => {
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 50);
    jwt.verify = () => ({ type: 'offline', iat });
    jwt.sign = () => 'test-check-key';
    const { writeFileSync } = await import('node:fs');
    const licenseKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    });
    const client = await pool.connect();
    const keyFilePath = path.join('sider-manager', 'key.json');

    const result = await activate(licenseKey);

    expect(client.query).not.toHaveBeenCalled();
    expect(client.release).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      keyFilePath,
      JSON.stringify({ aKey: licenseKey, cKey: 'test-check-key' }),
    );
    expect(result).toBe(true);
  });

  it('should not call query function, call log.error function, not save licenseKey to file and return licenseKeyInvalid when licenseKey is invalid', async () => {
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('activate: licenseKey is invalid');
    log.error = vi.fn();
    const { writeFileSync } = await import('node:fs');
     // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate('activation-key');

    expect(client.query).not.toHaveBeenCalled();
    expect(log.error).toHaveBeenCalledWith('activate: licenseKey is invalid');
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('licenseKeyInvalid');
  });

  it('should not call query function, call log.error function and return mustUpgradeLicenseKey when license key cannot be used for this version of application', async () => {
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 450);
    jwt.verify = () => ({ iat });
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('activate: licenseKey cannot be used for this version of app')
    log.error = vi.fn();

     // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate('activation-key');

    expect(client.query).not.toHaveBeenCalled();
    expect(log.error).toHaveBeenCalledWith('activate: licenseKey cannot be used for this version of app');
    expect(result).toBe('mustUpgradeLicenseKey');
  });

  it('should call query function (with ROLLBACK and without COMMIT), not save licenseKey to file and return licenseKeyInvalid when activation type is online and licenseKey not found in DB', async () => {
    jwt.verify = () => ({ type: 'online', version: appVersion });
    const { writeFileSync } = await import('node:fs');
    const licenseKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [] }),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate(licenseKey);

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.query).not.toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('licenseKeyInvalid');
  });

  it('should call query function (with ROLLBACK and without COMMIT), not save licenseKey to file and return licenseKeyHasBeenUsed when activation type is online and licenseKey has been used', async () => {
    jwt.verify = () => ({ type: 'online', version: appVersion });
    const { writeFileSync } = await import('node:fs');
    const licenseKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [{ used_for_activate: true }] }),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate(licenseKey);

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.query).not.toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('licenseKeyHasBeenUsed');
  });

  it('should return false when unknown error throwed', async () => {
    // setup throw unknown error
    jwt.verify = () => { throw new Error('Unknown error') };

    const result = await activate('activation-key');

    expect(result).toBe(false);
  });
});

describe('checkLicenseKeyHasBeenUsed', () => {
  it('should return false when key.json file is not exist', async () => {
    const { existsSync } = await import('node:fs');
    existsSync.mockReturnValue(false);

    const result = checkLicenseKeyHasBeenUsed();

    expect(result).toBe(false);
  });

  it('should return mustUpgradeLicenseKey when currently used license key cannot be used for this version of application', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{}');
    const iat = Math.floor(new Date().getTime() / 1000) - (3600 * 24 * 368);
    jwt.verify = () => ({ iat });

    const result = checkLicenseKeyHasBeenUsed();

    expect(result).toBe('mustUpgradeLicenseKey');
  });
});
