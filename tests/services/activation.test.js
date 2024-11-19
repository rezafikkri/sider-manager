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
import { activate, isActivated } from '../../src/main/services/activation';
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

  it('should return true when activationKey and checkKey is valid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue("{}");
    jwt.verify = () => ({ version: '2.20.0' });

    const result = isActivated();

    expect(result).toBe(true);
  });

  it('should call log.error function and return false when activationKey is invalid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{ "aKey": "wrong" }');
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: activationKey is invalid');
    log.error = vi.fn();

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: activationKey is invalid');
    expect(result).toBe(false);
  });

  it('should call log.error function and return false when version in activationKey is invalid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{}');
    jwt.verify = () => ({ version: '20.0.10' });
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: Version in activationKey is invalid');
    log.error = vi.fn();

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: Version in activationKey is invalid');
    expect(result).toBe(false);
  });

  it('should call log.error function and return false when checkKey is invalid', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(JSON.stringify({ cKey: 'check-key' }));
    jwt.verify = (cKey) => {
      if (cKey === 'check-key') {
        throw new JsonWebTokenError;
      }
      return { version: appVersion };
    }
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('isActivated: checkKey is invalid');

    const result = isActivated();

    expect(log.error).toHaveBeenCalledWith('isActivated: checkKey is invalid');
    expect(result).toBe(false);
  });
});

describe('activate function', () => {
  it('should call query function (with START TRANSACTION, correctly update argument, COMMIT and without ROLLBACK), call client.release function, save activationKey to file and return true when activation type is online and activationKey is valid', async () => {
    jwt.verify = () => ({ type: 'online', version: appVersion });
    jwt.sign = () => 'test-check-key';
    const { writeFileSync } = await import('node:fs');
    const activationKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [{ id: 1, used: 0 }] }),
      release: vi.fn(),
    });
    const client = await pool.connect();
    const updateActivationKeyUsedText = 'UPDATE activation_key set used = $1 WHERE id = $2';
    const updateActivationKeyUsedValue = [1, 1];
    const keyFilePath = path.join('sider-manager', 'key.json');

    const result = await activate(activationKey);

    expect(client.query).toHaveBeenCalledWith('START TRANSACTION');
    expect(client.query).toHaveBeenCalledWith('COMMIT');
    expect(client.query).toHaveBeenCalledWith(
      updateActivationKeyUsedText,
      updateActivationKeyUsedValue,
    );
    expect(client.query).not.toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      keyFilePath,
      JSON.stringify({ aKey: activationKey, cKey: 'test-check-key' }),
    );
    expect(result).toBe(true);
  });

  it('should not call query function, not call client.release function, save activationKey to file and return true when activation type is offline and activationKey is valid', async () => {
    jwt.verify = () => ({ type: 'offline', version: appVersion });
    jwt.sign = () => 'test-check-key';
    const { writeFileSync } = await import('node:fs');
    const activationKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    });
    const client = await pool.connect();
    const keyFilePath = path.join('sider-manager', 'key.json');

    const result = await activate(activationKey);

    expect(client.query).not.toHaveBeenCalled();
    expect(client.release).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      keyFilePath,
      JSON.stringify({ aKey: activationKey, cKey: 'test-check-key' }),
    );
    expect(result).toBe(true);
  });

  it('should not call query function, call log.error function, not save activationKey to file and return activationKeyInvalid when activationKey is invalid', async () => {
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('activate: activationKey is invalid');
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
    expect(log.error).toHaveBeenCalledWith('activate: activationKey is invalid');
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('activationKeyInvalid');
  });

  it('should not call query function, call log.error function and return activationKeyInvalid when version in activationKey is invalid', async () => {
    jwt.verify = () => ({ version: '20.10.0' });
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('activate: version in activationKey invalid')
    log.error = vi.fn();

     // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate('activation-key');

    expect(client.query).not.toHaveBeenCalled();
    expect(log.error).toHaveBeenCalledWith('activate: version in activationKey invalid');
    expect(result).toBe('activationKeyInvalid');
  });

  it('should call query function (with ROLLBACK and without COMMIT), not save activationKey to file and return activationKeyInvalid when activation type is online and activationKey not found in DB', async () => {
    jwt.verify = () => ({ type: 'online', version: appVersion });
    const { writeFileSync } = await import('node:fs');
    const activationKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [] }),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate(activationKey);

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.query).not.toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('activationKeyInvalid');
  });

  it('should call query function (with ROLLBACK and without COMMIT), not save activationKey to file and return activationKeyHasBeenUsed when activation type is online and activationKey has been used', async () => {
    jwt.verify = () => ({ type: 'online', version: appVersion });
    const { writeFileSync } = await import('node:fs');
    const activationKey = 'activation-key';
    // setup node-postgres
    pool.connect = vi.fn().mockResolvedValue({
      query: vi.fn().mockReturnValue({ rows: [{ used: 1 }] }),
      release: vi.fn(),
    });
    const client = await pool.connect();

    const result = await activate(activationKey);

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.query).not.toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(result).toBe('activationKeyHasBeenUsed');
  });

  it('should return false when unknown error throwed', async () => {
    // setup throw unknown error
    jwt.verify = () => { throw new Error('Unknown error') };

    const result = await activate('activation-key');

    expect(result).toBe(false);
  });
});
