import { afterEach, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import {
  chooseMLManager,
  isMLManagerConfigActivated,
  readMLManagers,
  readSiderIni,
  saveSiderIni,
  toggleMLManagerConfig,
} from '../../src/main/services/simple-config';
import path from 'node:path';
import url from 'node:url';
import log from 'electron-log/main';

const siderIni = [
  '[sider]',
  'debug = 0',
  'livecpk.enabled = 0',
  'lookup-cache.enabled = 1',
  'close.on.exit = 1',
  'start.minimized = 1',
  'address-cache.enabled = 1',
  'free.select.sides = 1',
  'free.first.player = 1',
  'camera.sliders.max = 50',
  'camera.dynamic-wide.angle.enabled = 0',
  'cpk.root = ".\\content\\Live CPK\\Font"',
  'cpk.root = ".\\content\\Live CPK\\CompSong"',
  'cpk.root = ".\\content\\Live CPK\\MLManager"',
  '; cpk.root = ".\\content\\Live CPK\\GraphicsMenu"',
  'lua.enabled = 1',
  'lua.module = "Effect - NoRealEye.lua"',
  'lua.module = "Server - Scoreboard Plus.lua"',
  'lua.module = "Server - Scoreboard.lua"',
  '; lua.module = "Server - TrophyServer.lua"',
  'lua.module = "Server - Stadium.lua"',
  '; lua.module = "Event Tracer.lua"',
  '; lua.module = "Effect - Condition.lua"',
];

beforeAll(() => {
  vi.mock('../../src/main/services/settings', () => ({
    getSettings: vi.fn(),
    getSettingsPath: () => 'settingsPath',
    saveSettings: vi.fn(),
    deleteSetting: vi.fn(),
  }));
  vi.mock('node:fs', () => ({
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    existsSync: vi.fn(),
    rmSync: vi.fn(),
    readdirSync: vi.fn(),
    cpSync: vi.fn(),
  }));
  vi.mock('electron', () => {
    return {
      app: {
        getVersion: () => '',
      },
    };
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('saveSiderIni function', () => {
  beforeEach(async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory' });
  });

  it('should call writeFileSync correctly and return true when what need to be update is common sider', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'debug', value: 1 });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === 'debug = 0') return 'debug = 1';
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is lua.module and from enabled to disabled', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'lua.module', value: '"Server - Scoreboard Plus.lua"' });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === 'lua.module = "Server - Scoreboard Plus.lua"') return '; lua.module = "Server - Scoreboard Plus.lua"';
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is lua.module and from disabled to enabled', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'lua.module', value: '"Server - TrophyServer.lua"' });

    const targetSiderIni = 'lua.module = "Server - TrophyServer.lua"';
    const newSiderIni = siderIni.map((ini) => {
      if (ini === `; ${targetSiderIni}`) return targetSiderIni;
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is lua.module and lua.module is not found', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'lua.module', value: '"test.lua"' });

    const newSiderIni = siderIni.toSpliced(21, 0, 'lua.module = "test.lua"').join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is cpk.root and from enabled to disabled', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\Font"' });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === 'cpk.root = ".\\content\\Live CPK\\Font"') return '; cpk.root = ".\\content\\Live CPK\\Font"';
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is cpk.root and from disabled to enabled', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));
    const targetSiderIni = 'cpk.root = ".\\content\\Live CPK\\GraphicsMenu"';

    const result = saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\GraphicsMenu"' });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === `; ${targetSiderIni}`) return targetSiderIni;
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is cpk.root and cpk.root is not found', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\Test"' });

    const newSiderIni = siderIni.toSpliced(14, 0, 'cpk.root = ".\\content\\Live CPK\\Test"').join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });
});

describe('readSiderIni function', () => {
  beforeAll(() => {
    vi.mock('../../src/main/utils', () => ({
      generateErrorLogMessage: () => 'This is the right error',
    }));
  });

  it('should call readFileSync function correctly and return array of sider.ini', async () => {
    const { readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = readSiderIni('pesDirectory');

    expect(readFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), { encoding: 'utf-8' });
    expect(result).toEqual(siderIni);
  });

  it('should call log.error function correctly and return empty aray when sider.ini file is not found', async () => {
    const { readFileSync } = await import('node:fs');
    readFileSync.mockImplementation(() => { throw new Error('This is error') });
    log.error = vi.fn();

    const result = readSiderIni('pesDirectory');

    expect(log.error).toHaveBeenCalledWith('This is the right error');
    expect(result).toEqual([]);
  });
});

describe('toggleMLManagerConfig function', () => {
  beforeEach(async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory' });
  });

  it('should call mkdirSync function correctly, writeFileSync function for sider.ini correctly and return true when ML Manager config is non active', async () => {
    const { writeFileSync, existsSync, mkdirSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));
    existsSync.mockReturnValue(false);

    const result = toggleMLManagerConfig();

    expect(mkdirSync).toHaveBeenCalledWith(path.join('pesDirectory', 'content', 'Live CPK', 'ML Manager'));
    const newSiderIni = siderIni.toSpliced(14, 0, 'cpk.root = ".\\content\\Live CPK\\ML Manager"').join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call rmSync function correctly, deleteSetting, writeFileSync function for sider.ini correctly and return true when ML Manager config is active', async () => {
    const { writeFileSync, existsSync, rmSync, readFileSync } = await import('node:fs');
    const newSiderIni = siderIni.toSpliced(14, 0, 'cpk.root = ".\\content\\Live CPK\\ML Manager"');
    readFileSync.mockReturnValue(newSiderIni.join('\n'));
    existsSync.mockReturnValue(true);
    const { deleteSetting } = await import('../../src/main/services/settings');

    const result = toggleMLManagerConfig();

    const mlManagerPath = path.join('pesDirectory', 'content', 'Live CPK', 'ML Manager');
    expect(rmSync).toHaveBeenCalledWith(mlManagerPath, { recursive: true, force: true });
    expect(deleteSetting).toHaveBeenCalledWith('activeMLManager');
    expect(writeFileSync).toHaveBeenCalledWith(
      path.join('pesDirectory', 'sider.ini'),
      newSiderIni.map((ini) => {
        const targetSiderIni = 'cpk.root = ".\\content\\Live CPK\\ML Manager"';
        if (ini === targetSiderIni) return `; ${targetSiderIni}`;
        return ini;
      }).join('\n'),
    );
    expect(result).toBe(true);
  });
});

describe('isMLManagerConfigActivated function', () => {
  beforeEach(async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory' });
  });

  it('should return true when ML Manager path exist and ML Manager code exist in sider.ini', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    const newSiderIni = siderIni.toSpliced(14, 0, 'cpk.root = ".\\content\\Live CPK\\ML Manager"');
    readFileSync.mockReturnValue(newSiderIni.join('\n'));
    existsSync.mockReturnValue(true);

    const result = isMLManagerConfigActivated();

    expect(result).toBe(true);
  });

  it('should return false when ML Manager path not exist and ML Manager code exist in sider.ini', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    const newSiderIni = siderIni.toSpliced(14, 0, 'cpk.root = ".\\content\\Live CPK\\ML Manager"');
    readFileSync.mockReturnValue(newSiderIni.join('\n'));
    existsSync.mockReturnValue(false);

    const result = isMLManagerConfigActivated();

    expect(result).toBe(false);
  });

  it('should return false when ML Manager path exist and ML Manager code not exist in sider.ini', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni);
    existsSync.mockReturnValue(false);

    const result = isMLManagerConfigActivated();

    expect(result).toBe(false);
  });
});

describe('readMLManager function', () => {
  it('should return correctly ML Managers when active ml manager not exist', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory' });
    const { readdirSync, existsSync } = await import('node:fs');
    existsSync.mockImplementation((preview) => {
      if (/\.jpg$/.test(preview)) return true;
      return false;
    });
    const mlManagers = ['Alex Ferguson', 'Arrigo Sacchi', 'Bill Shankly'];
    readdirSync.mockReturnValue(mlManagers);

    const result = readMLManagers();

    expect(result).toEqual(mlManagers.map((mlManager) => ({
      path: path.join('settingsPath', 'ml-manager', mlManager),
      name: mlManager,
      preview: url.pathToFileURL(path.join('settingsPath', 'ml-manager', mlManager, 'preview.jpg')).toString(),
      active: false,
    })));
  });

  it('should return correctly ML Managers when active ml manager exist', async () => {
    const mlManagers = ['Arrigo Sacchi', 'Alex Ferguson', 'Bill Shankly'];
    const mlManagerPath = path.join('settingsPath', 'ml-manager', mlManagers[1]);
    const { getSettings } = await import('../../src/main/services/settings');
    const activeMLManager = {
      name: mlManagers[1],
      path: mlManagerPath,
      preview: url.pathToFileURL(path.join(mlManagerPath, 'preview.png')).toString(),
      active: true,
    };
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory', activeMLManager });
    const { readdirSync, existsSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readdirSync.mockReturnValue(mlManagers);

    const result = readMLManagers();

    const newMLManagers = mlManagers.filter((mlManager) => mlManager !== mlManagers[1]).map((mlManager) => ({
      path: path.join('settingsPath', 'ml-manager', mlManager),
      name: mlManager,
      preview: url.pathToFileURL(path.join('settingsPath', 'ml-manager', mlManager, 'preview.png')).toString(),
      active: false,
    }));
    expect(result).toEqual([ activeMLManager, ...newMLManagers ]);
  });
});

describe('chooseMLManager function', () => {
  beforeEach(async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ pesDirectory: 'pesDirectory' });
  });

  it('should call cpSync and saveSettings function correctly and return true when active ML Manager not available yet', async () => {
    const { cpSync, existsSync } = await import('node:fs');
    existsSync.mockReturnValue(false);
    const { saveSettings } = await import('../../src/main/services/settings');
    const mlManager = {
      name: 'RezaFikkri',
      path: path.join('others', 'ml-manager-path'),
      preview: path.join('others', 'preview.jpg'),
    };
    const dest = path.join('pesDirectory', 'content', 'Live CPK', 'ML Manager', 'common');

    const result = chooseMLManager(mlManager);

    expect(cpSync).toHaveBeenCalledWith(path.join(mlManager.path, 'common'), dest, { recursive: true });
    expect(saveSettings).toHaveBeenCalledWith({ activeMLManager: { ...mlManager } });
    expect(result).toBe(true);
  });

  it('should call rmSync, cpSync and saveSettings function correctly and return true when active ML Manager available', async () => {
    const { cpSync, existsSync, rmSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    const { saveSettings } = await import('../../src/main/services/settings');
    const mlManager = {
      name: 'RezaFikkri',
      path: path.join('others', 'ml-manager-path'),
      preview: path.join('others', 'preview.jpg'),
    };
    const dest = path.join('pesDirectory', 'content', 'Live CPK', 'ML Manager', 'common');

    const result = chooseMLManager(mlManager);

    expect(rmSync).toHaveBeenCalledWith(dest, { recursive: true, force: true });
    expect(cpSync).toHaveBeenCalledWith(path.join(mlManager.path, 'common'), dest, { recursive: true });
    expect(saveSettings).toHaveBeenCalledWith({ activeMLManager: { ...mlManager } });
    expect(result).toBe(true);
  });
});
