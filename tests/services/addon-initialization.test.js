import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  vi,
  expect,
} from 'vitest';
import log from 'electron-log/main';
import path from 'node:path';
import decompress from 'decompress';
import {
  addonInitialization,
  chooseInitializationFile,
} from '../../src/main/services/addon-initialization';

beforeAll(() => {
  vi.mock('../../src/main/services/settings', () => ({
    getSettingsPath: () => 'settingsPath',
    getSettings: () => ({ pesDirectory: 'pesDirectory', pesExecutable: ['pesExe'] }),
  }));

  vi.mock('../../src/main/services', () => ({
    getFileSize: () => 1000,
    isFile: vi.fn(),
  }));

  vi.mock('../../src/main/utils', () => ({
    generateErrorLogMessage: () => 'This is error log',
    translate: () => 'translation',
  }));

  vi.mock('electron', () => {
    return {
      dialog: {
        showOpenDialog: vi.fn(),
      },
      app: {
        getVersion: () => '9.0.10',
      },
    };
  });

  log.error = vi.fn();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('chooseInitializationFile function', () => {
  beforeAll(() => {
    vi.mock('../../src/main/services/locale', () => ({
      getLocaleResources: () => {},
    }));
  });

  it('should call showOpenDialog function correctly and return fileName, fileSize and filePath when choose initialization file not cancelled', async () => {
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: false, filePaths: ['/others/addon-initialization.zip'] });

    const result = await chooseInitializationFile();

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({
      title: 'translation',
      properties: ['openFile'],
      filters: [
        { name: '*.zip', extensions: ['zip'] },
      ],
    });
    expect(result).toEqual({
      fileName: 'addon-initialization.zip',
      fileSize: 1000,
      filePath: '/others/addon-initialization.zip' });
  });

  it('should return false when choose initialization file cancelled', async () => {
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: true });

    const result = await chooseInitializationFile();

    expect(result).toBe(false);
  });
});

describe('addonInitialization function', () => {
  beforeAll(() => {
    vi.mock('decompress', () => ({
      default: vi.fn(),
    }));

    vi.mock('node:fs', () => ({
      existsSync: vi.fn(),
      mkdirSync: vi.fn(),
      readdirSync: vi.fn(),
      cpSync: vi.fn(),
      renameSync: vi.fn(),
      rmSync: vi.fn(),
    }));
  });

  // backup
  it('should call mkdirSync and not call cpSync and renameSync function when backupPath is not found and all folder and file is has in ignoreList', async () => {
    const { existsSync, mkdirSync, cpSync, renameSync, readdirSync } = await import('node:fs');
    existsSync.mockReturnValue(false);
    readdirSync.mockImplementation((dirPath) => {
      if (dirPath === 'pesDirectory') {
        return [ 'Uninstall', 'anilag.cfg', 'CPY.ini', 'lua51.dll' ];
      }
    });

    await addonInitialization('/others/addon-initialization.zip');

    expect(mkdirSync).toHaveBeenCalledWith(path.join('pesDirectory', 'backup'));
    expect(cpSync).not.toHaveBeenCalledWith(
      path.join('pesDirectory', 'Uninstall'),
      path.join('pesDirectory', 'backup'),
      { recursive: true },
    );
    expect(renameSync).not.toHaveBeenCalled();
  });

  it('should not call mkdirSync and call renameSync function correctly when backupPath is found and fileName type is file', async () => {
    const { existsSync, mkdirSync, renameSync, readdirSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readdirSync.mockImplementation((dirPath) => {
      if (dirPath === 'pesDirectory') {
        return [ 'test.txt' ];
      }
    });
    const { isFile } = await import('../../src/main/services');
    const fullPath = path.join('pesDirectory', 'test.txt');
    isFile.mockImplementation((filePath) => {
      if (filePath === fullPath) {
        return true;
      }
    });

    await addonInitialization('/others/addon-initialization.zip');

    expect(mkdirSync).not.toHaveBeenCalled();
    expect(renameSync).toHaveBeenCalledWith(
      fullPath,
      path.join('pesDirectory', 'backup', 'test.txt'),
    );
  });

  it('should not call renameSync function and call cpSync and rmSync function correctly when fileName type is not file', async () => {
    const { existsSync, renameSync, cpSync, readdirSync, rmSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readdirSync.mockImplementation((dirPath) => {
      if (dirPath === 'pesDirectory') {
        return [ 'test2' ];
      }
    });
    const { isFile } = await import('../../src/main/services');
    const fullPath = path.join('pesDirectory', 'test2');
    isFile.mockImplementation((filePath) => {
      if (filePath === fullPath) {
        return false;
      }
    });

    await addonInitialization('/others/addon-initialization.zip');

    const dest = path.join('pesDirectory', 'backup', 'test2');
    expect(renameSync).not.toHaveBeenCalledWith(fullPath, dest);
    expect(cpSync).toHaveBeenCalledWith(fullPath, dest, { recursive: true });
    expect(rmSync).toHaveBeenCalledWith(fullPath, { recursive: true, force: true });
  });
  // backup end

  it('should call decompress, cpSync, rmSync function correctly for move folder to appData and call function renameSync correctly, not call cpSync function when fileName type is file, call rmSync function correctly and return true for move folder and file to PES installation directory', async () => {
    const { existsSync, renameSync, cpSync, readdirSync, rmSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    const extractPath = path.join('/others', 'addon-initialization');
    readdirSync.mockImplementation((dirPath) => {
      if (dirPath === 'pesDirectory') {
        return [ 'test2' ];
      } else if (dirPath === extractPath) {
        return [ 'test3.txt' ];
      }
    });
    const { isFile } = await import('../../src/main/services');
    const fullPath = path.join(extractPath, 'test3.txt');
    isFile.mockImplementation((filePath) => {
      if (filePath === fullPath) {
        return true;
      }
    });

    const filePath = path.join('/others','addon-initialization.zip');
    const result = await addonInitialization(filePath);

    const srcMLManager = path.join(extractPath, 'ML Manager');
    const destMLManager = path.join('settingsPath', 'ml-manager');
    const srcGraphicsMenu = path.join(extractPath, 'Graphics Menu');
    const destGraphicsMenu = path.join('settingsPath', 'graphics-menu');
    const srcTeamPressRoom = path.join(extractPath, 'Press Room');
    const destTeamPresRoom = path.join('settingsPath', 'press-room');

    expect(decompress).toHaveBeenCalledWith(filePath, path.dirname(filePath));
    expect(cpSync).toHaveBeenCalledWith(srcMLManager, destMLManager, { recursive: true });
    expect(cpSync).toHaveBeenCalledWith(srcGraphicsMenu, destGraphicsMenu, { recursive: true });
    expect(cpSync).toHaveBeenCalledWith(srcTeamPressRoom, destTeamPresRoom, { recursive: true });
    expect(rmSync).toHaveBeenCalledWith(srcMLManager, { recursive: true, force: true });
    expect(rmSync).toHaveBeenCalledWith(srcGraphicsMenu, { recursive: true, force: true });
    expect(rmSync).toHaveBeenCalledWith(srcTeamPressRoom, { recursive: true, force: true });

    const dest = path.join('pesDirectory', 'test3.txt');
    expect(renameSync).toHaveBeenCalledWith(fullPath, dest);
    expect(cpSync).not.toHaveBeenCalledWith(fullPath, dest, { recursive: true });
    expect(rmSync).toHaveBeenCalledWith(extractPath, { recursive: true, force: true });
    expect(result).toBe(true);
  });

  it('should not call renameSync function and call cpSync function when fileName type is not file and return true for move folder and file to PES installation directory', async () => {
    const { existsSync, renameSync, cpSync, readdirSync, rmSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    const extractPath = path.join('/others', 'addon-initialization');
    readdirSync.mockImplementation((dirPath) => {
      if (dirPath === 'pesDirectory') {
        return [ 'test2' ];
      } else if (dirPath === extractPath) {
        return [ 'test4' ];
      }
    });
    const { isFile } = await import('../../src/main/services');
    const fullPath = path.join(extractPath, 'test4');
    isFile.mockImplementation((filePath) => {
      if (filePath === fullPath) {
        return false;
      }
    });

    const result = await addonInitialization('/others/addon-initialization.zip');

    const dest = path.join('pesDirectory', 'test4');
    expect(renameSync).not.toHaveBeenCalledWith(fullPath, dest);
    expect(cpSync).toHaveBeenCalledWith(fullPath, dest, { recursive: true });
    expect(rmSync).toHaveBeenCalledWith(extractPath, { recursive: true, force: true });
    expect(result).toBe(true);
  });

  it('should not call decompress and cpSync function, call log.error function correctly and return false', async () => {
    const { existsSync, cpSync } = await import('node:fs');
    existsSync.mockReturnValue(true);

    const filePath = path.join('/others','addon-initialization.zip');
    const result = await addonInitialization(filePath);

    expect(log.error).toHaveBeenCalledWith('This is error log');
    expect(decompress).not.toHaveBeenCalled();
    expect(cpSync).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
