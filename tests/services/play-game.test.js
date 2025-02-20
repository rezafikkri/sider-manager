import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import util from 'node:util';
import log from 'electron-log/main';
import { playGame } from '../../src/main/services/play-game';
import path from 'node:path';

describe('playGame function', () => {
  beforeAll(() => {
    vi.mock('node:fs', () => ({
      existsSync: vi.fn(),
      readFileSync: () => '{"pesDirectory":"pes-directory","pesExecutable":["PES2017.exe","sider.exe"]}',
    }));

    vi.mock('../../src/main/services/settings', () => ({
      getSettingsFilePath: () => '',
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call execFile function correctly and return true when no error occurred', async () => {
    util._promisify = util.promisify;
    const execFile = vi.fn(async () => true);
    util.promisify = () => execFile;
    const { existsSync } = await import('node:fs');
    existsSync.mockReturnValue(true);

    const result = await playGame();

    expect(execFile).toHaveBeenCalled('pes-directory/sider.exe');
    expect(execFile).toHaveBeenCalled('pes-directory/PES2017.exe');
    expect(result).toBe(true);

    util.promisify = util._promisify;
    delete util._promisify;
  });

  it('should return siderExeNotFound if sider.exe is not in pes directory', async () => {
    const { existsSync } = await import('node:fs');
    const siderFilePath = path.join('pes-directory', 'sider.exe');
    existsSync.mockImplementation((arg) => arg === siderFilePath ? false : true);

    const result = await playGame();

    expect(result).toBe('siderExeNotFound');
  });

  it('should return pesExeNotFound if PES2017.exe is not in pes directory', async () => {
    const { existsSync } = await import('node:fs');
    const pes2017FilePath = path.join('pes-directory/PES2017.exe');
    existsSync.mockImplementation((arg) => arg === pes2017FilePath ? false : true);

    const result = await playGame();

    expect(result).toBe('pesExeNotFound');
  });

  it('should call log.error function and return false when error occur', async () => {
    vi.mock('electron', () => ({
      app: {
        getVersion: () => '',
      },
    }));
    log.error = vi.fn();
    vi.mock('../../src/main/utils', () => ({
      generateErrorLogMessage: () => 'This is error log',
    }));
    const { existsSync } = await import('node:fs');
    existsSync.mockReturnValue(true);

    const result = await playGame();

    expect(log.error).toHaveBeenCalledWith('This is error log');
    expect(result).toBe(false);
  });
});
