import {
  beforeAll,
  describe,
  it,
  vi,
  expect,
  afterEach,
} from 'vitest';
import path from 'node:path';
import log from 'electron-log/main';
import checkUpdate, { checkSmallerThanVersion } from '../../src/main/services/check-update';
import needle from 'needle';

const checkUpdateFilePath = path.join('temp', 'sider-manager', 'check-update.json');

beforeAll(() => {
  vi.mock('../../src/main/services/create-main-window', () => ({
    default: () => 'main-window',
  }));

  vi.mock('../../src/main/services/locale', () => ({
    getLocaleResources: () => {},
  }));
});

describe('checkUpdate function', () => {
  beforeAll(() => {
    vi.mock('../../src/main/services/settings', () => ({
      getSettings: () => ({ locale: '' }),
      getSettingsPath: () => '',
    }));

    vi.mock('needle', () => ({
      default: vi.fn(),
    }));

    vi.mock('electron', () => {
      const Notification = vi.fn();
      Notification.isSupported = () => true;
      Notification.prototype.show = vi.fn();

      return {
        app: {
          getPath: (param) => param,
          getVersion: () => '9.0.10',
        },
        Notification,
      };
    });

    vi.mock('node:fs', () => ({
      writeFileSync: vi.fn(),
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
      mkdirSync: vi.fn(),
    }));

    vi.mock('../../src/main/utils', () => ({
      generateErrorLogMessage: vi.fn(),
      translate: () => 'translate',
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create sider-manager temp dir when not exist', async () => {
    const { existsSync, mkdirSync, readFileSync } = await import('node:fs');
    existsSync.mockImplementation((tempDirPath) => {
      if (tempDirPath === path.join('temp', 'sider-manager')) {
        return false;
      }
    });
    readFileSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      }
    });
    needle.mockImplementation(async () => {
      return { statusCode: 200, body: { files: [{ name: 'v1.0.0' }] } };
    });

    await checkUpdate();

    expect(mkdirSync).toHaveBeenCalledWith(path.join('temp', 'sider-manager'), { recursive: true });
  });

  it('should return false and not call log.error function when not checking for update and versions in release data not found', async () => {
    const { readFileSync } = await import('node:fs');
    readFileSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      }
    });
    log.error = vi.fn();
    needle.mockImplementation(async (method) => {
      if (method === 'post') {
        return { statusCode: 200, body: { access_token: 'access-token' } };
      } else if (method === 'get') {
        return { statusCode: 401, body: '' };
      }
    });
    
    const check = await checkUpdate();

    expect(check).toBe(false);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should return false and call log.error function correctly when not checking for update and unknown error occurred when getting version from release data', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    readFileSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === 'gd-at.json') {
        return JSON.stringify({ accessToken: 'access-token' });
      }
    });
    existsSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === 'gd-at.json') {
        return true;
      }
    });
    log.error = vi.fn();
    needle.mockImplementation(async (method) => {
      if (method === 'post') {
        return { statusCode: 200, body: { access_token: 'access-token' } };
      } else if (method === 'get') {
        return { statusCode: 400, body: '' };
      }
    });
    const { generateErrorLogMessage } = await import('../../src/main/utils');
    generateErrorLogMessage.mockReturnValue('Versions in release data not found.');
    
    const check = await checkUpdate();

    expect(check).toBe(false);
    expect(log.error).toHaveBeenCalledWith('Versions in release data not found.');
  });

  it('should show Notification and call writeFileSync correctly when not checking for update and currentAppVersion is smaller than latestReleaseVersion', async () => {
    const { readFileSync, writeFileSync } = await import('node:fs');
    readFileSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      }
    });
    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v10.10.0'}] } });
    const { Notification } = await import('electron');
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1732017351986))
    
    await checkUpdate();

    expect(Notification).toHaveBeenCalledWith({ title: 'translate', body: 'translate' });
    expect(Notification.prototype.show).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      path.join('temp', 'sider-manager', 'check-update.json'),
      JSON.stringify({ version: '10.10.0', limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2) })
    );

    vi.useRealTimers();
  });

  it('should not show Notification and not call writeFileSync when not checking for update and currentAppVersion is not smaller than latestReleaseVersion', async () => {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
    existsSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === path.join('', 'gd-at.json')) {
        return true;
      }
    });
    readFileSync.mockImplementation((gdAtPath) => {
      if (gdAtPath === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      }
    });
    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v8.20.10'}] } });
    const { Notification } = await import('electron');

    await checkUpdate();

    expect(Notification).not.toHaveBeenCalled();
    expect(Notification.prototype.show).not.toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it('should show Notification, call writeFileSync correctly and return true when have checked for update, currentAppVersion is smaller than latestReleaseVersion and latestCheckUpdateVerion smaller than latestReleaseVersion', async () => {
    const { readFileSync, writeFileSync, existsSync } = await import('node:fs');
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === 'gd-at.json') {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '8.0.0', limitTime: 1731676764 });
      }
    });
    existsSync.mockImplementation((checkPath) => {
      if (checkPath === checkUpdateFilePath) {
        return true;
      }
    });
    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v11.10.0'}] } });
    const { Notification } = await import('electron');
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1732022463884))
    
    const check = await checkUpdate();

    expect(Notification).toHaveBeenCalledWith({ title: 'translate', body: 'translate' });
    expect(Notification.prototype.show).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      checkUpdateFilePath,
      JSON.stringify({ version: '11.10.0', limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 2) })
    );
    expect(check).toBe(true);

    vi.useRealTimers();
  });

  it('should return false when have checked for update and currentTime is smaller than limitCheckUpdate', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === 'gd-at.json') {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '8.0.0', limitTime: Math.floor(new Date().getTime() / 1000) + (3600 * 24 * 4) });
      }
    });
    existsSync.mockImplementation((checkPath) => {
      if (checkPath === checkUpdateFilePath) {
        return true;
      }
    });
    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v11.10.0'}] } });
    
    const check = await checkUpdate();

    expect(check).toBe(false);
  });

  it('should return false and not call log.error function when have checked for update and versions in release data not found', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === 'gd-at.json') {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '8.0.0', limitTime: 1731676764 });
      }
    });
    existsSync.mockImplementation((checkPath) => {
      if (checkPath === checkUpdateFilePath) {
        return true;
      }
    });
    log.error = vi.fn();
    needle.mockImplementation(async (method) => {
      if (method === 'post') {
        return { statusCode: 200, body: { access_token: 'access-token' } };
      } else if (method === 'get') {
        return { statusCode: 401, body: '' };
      }
    });
    
    const check = await checkUpdate();

    expect(check).toBe(false);
    expect(log.error).not.toHaveBeenCalled();
  });

  it('should not show Notification, not call writeFileSync and return false when have checked for update, currentAppVersion is not smaller than latestReleaseVersion and latestCheckUpdateVersion is smaller than latestReleaseVersion', async () => {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
    existsSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json') || pathParam === checkUpdateFilePath) {
        return true;
      }
    });
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '7.0.0', limitTime: 1732404751 });
      }
    });

    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v9.0.10'}] } });
    const { Notification } = await import('electron');

    await checkUpdate();

    expect(Notification).not.toHaveBeenCalled();
    expect(Notification.prototype.show).not.toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it('should not show Notification, not call writeFileSync and return false when have checked for update, currentAppVersion is smaller than latestReleaseVersion and latestCheckUpdateVersion is not smaller than latestReleaseVersion', async () => {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
    existsSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json') || pathParam === checkUpdateFilePath) {
        return true;
      }
    });
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '10.0.10', limitTime: 1732404751 });
      }
    });

    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v10.0.10'}] } });
    const { Notification } = await import('electron');

    await checkUpdate();

    expect(Notification).not.toHaveBeenCalled();
    expect(Notification.prototype.show).not.toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it('should not show Notification, not call writeFileSync and return false when have checked for update, currentAppVersion is not smaller than latestReleaseVersion and latestCheckUpdateVerion is not smaller than latestReleaseVersion', async () => {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
    existsSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json') || pathParam === checkUpdateFilePath) {
        return true;
      }
    });
    readFileSync.mockImplementation((pathParam) => {
      if (pathParam === path.join('', 'gd-at.json')) {
        return JSON.stringify({ accessToken: 'access-token' });
      } else if (pathParam === checkUpdateFilePath) {
        return JSON.stringify({ version: '9.0.10', limitTime: 1732404751 });
      }
    });

    needle.mockResolvedValue({ statusCode: 200, body: { files: [{name: 'v9.0.10'}] } });
    const { Notification } = await import('electron');

    await checkUpdate();

    expect(Notification).not.toHaveBeenCalled();
    expect(Notification.prototype.show).not.toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
  });
});

describe('smallerThan function', () => {
  it('should return false when Major Current is not smaller than Major Latest and Major Current is not equal to Major Latest', () => {
    const check = checkSmallerThanVersion('10.0.10', '9.40.0');
    expect(check).toBe(false);
  });

  it('should return true when Major Current is smaller than Major Latest', () => {
    const check = checkSmallerThanVersion('9.10.0', '10.0.0');
    expect(check).toBe(true);
  });

  it('should return false when Major Current is equal to Major Latest, Minor Current is not smaller than Minor Latest and Minor Current is not equal to Minor Latest', () => {
    const check = checkSmallerThanVersion('10.20.0', '10.2.101');
    expect(check).toBe(false);
  });

  it('should return true when Major Current is equal to Major Latest and Minor Current is smaller than Minor Latest', () => {
    const check = checkSmallerThanVersion('10.2.0', '10.10.101');
    expect(check).toBe(true);
  });

  it('should return false when Major Current is equal to Major Latest, Minor Current is not smaller than Minor Latest, Minor Current is equal to Minor Latest and Path Current is not smaller than Path Latest', () => {
    const check = checkSmallerThanVersion('10.2.101', '10.2.10');
    expect(check).toBe(false);
  });

  it('should return true when Major Current is equal to Major Latest, Minor Current is not smaller than Minor Latest, Minor Current is equal to Minor Latest and Path Current is smaller than Path Latest', () => {
    const check = checkSmallerThanVersion('10.2.11', '10.2.12');
    expect(check).toBe(true);
  });
});