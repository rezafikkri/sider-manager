import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { readSiderIni, saveSiderIni } from '../../src/main/services/simple-config';
import path from 'node:path';
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
  'cpk.root = ".\\content\\Live CPK\\GraphicsMenu"',
  'lua.enabled = 1',
  'lua.module = "Effect - NoRealEye.lua"',
  'lua.module = "Server - Scoreboard Plus.lua"',
  'lua.module = "Server - Scoreboard.lua"',
  'lua.module = "Server - TrophyServer.lua"',
  'lua.module = "Server - Stadium.lua"',
  '; lua.module = "Event Tracer.lua"',
  '; lua.module = "Effect - Condition.lua"',
];

beforeAll(() => {
  vi.mock('../../src/main/services/settings', () => ({
    getSettings: () => ({ pesDirectory: 'pesDirectory' }),
  }));
  vi.mock('node:fs', () => ({
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
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
    readFileSync.mockReturnValue(siderIni.map((ini) => {
      if (ini === 'lua.module = "Server - TrophyServer.lua"') return '; lua.module = "Server - TrophyServer.lua"';
      return ini;
    }).join('\n'));

    const result = saveSiderIni({ key: 'lua.module', value: '"Server - TrophyServer.lua"' });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === '; lua.module = "Server - TrophyServer.lua"') return 'lua.module = "Server - TrophyServer.lua"';
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
    const targetSiderIni = 'cpk.root = ".\\content\\Live CPK\\GraphicsMenu"';
    readFileSync.mockReturnValue(siderIni.map((ini) => {
      if (ini === targetSiderIni) return `; ${targetSiderIni}`;
      return ini;
    }).join('\n'));

    const result = saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\GraphicsMenu"' });

    const newSiderIni = siderIni.map((ini) => {
      if (ini === `; ${targetSiderIni}`) return targetSiderIni;
      return ini;
    }).join('\n');
    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), newSiderIni);
    expect(result).toBe(true);
  });

  it('should call writeFileSync correctly and return true when what need to be update is cpk.root and lua.module is not found', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(siderIni.join('\n'));

    const result = saveSiderIni({ key: 'cpk.root', value: '".\\content\\Live CPK\\Test"' });

    const newSiderIni = siderIni.toSpliced(15, 0, 'cpk.root = ".\\content\\Live CPK\\Test"').join('\n');
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
