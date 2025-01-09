import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  choosePESDirectory,
  getSettingsFilePath,
  isPESDirectorySetup,
  choosePESDirectory,
  getSettings,
  saveSettings,
  initializeSettings,
  deleteSetting,
} from '../../src/main/services/settings';
import path from 'node:path';

beforeAll(() => {
  vi.mock('electron', () => {
    return {
      app: {
        getPath: () => ''
      },
      dialog: {
        showOpenDialog: vi.fn(),
      },
      BrowserWindow: {
        getFocusedWindow: vi.fn().mockReturnValue({ close: vi.fn() }),
      },
    };
  });

  vi.mock('node:fs', () => ({
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getSettingsFilePath function', () => {
  it('should return correct setting file path', () => {
    const settingFilePath = getSettingsFilePath();

    expect(settingFilePath).toBe(path.join('sider-manager', 'settings.json'));
  });
});

describe('isPESDirectorySetup function', () => {
  it('should return true when pesDirectory is in the setting object', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(JSON.stringify({ pesDirectory: 'pes-directory' }));

    const result = isPESDirectorySetup();

    expect(result).toBe(true);
  });

  it('should return false when pesDirecotry is not in the setting object', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(JSON.stringify({ wrong: 'wrong' }));

    const result = isPESDirectorySetup();

    expect(result).toBe(false);
  });
});

describe('choosePESDirectory function', () => {
  beforeAll(() => {
    vi.mock('../../src/main/utils', () => ({
      translate: () => 'translate',
    }));
  });
  
  it('should call showOpenDialog function correctly and return pes directory when choose pes directory not canceled', async () => {
    const pesDirectory = 'pes-directory';
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: false, filePaths: [pesDirectory] });

    const result = await choosePESDirectory();

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({title: 'translate', properties: ['openDirectory']});
    expect(result).toBe(pesDirectory);
  });

  it('should return false when choose pes directory canceled', async () => {
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: true });

    const result = await choosePESDirectory();

    expect(result).toBe(false);
  });
});

describe('getSettings function', () => {
  it('should return settings object when settings file is exist', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue('{"language":"id"}');

    const settings = getSettings();

    expect(settings).toEqual({language:"id"});
  });
});

describe('saveSettings function', () => {
  it('should call writeFileSync correctly and return true when save success', async () => {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
    existsSync.mockReturnValue(true);
    const oldSettings = {
      language: 'id',
      pesDirectory: 'pes-directory',
      pesExecutable: ['pes-exe', 'sider-exe'],
    };
    readFileSync.mockReturnValue(JSON.stringify(oldSettings));
    const newSettings = {
      pesDirectory: 'pes-directory-change',
    };
    const settingsFilePath = path.join('sider-manager', 'settings.json');

    const isSaved = saveSettings(newSettings);

    expect(writeFileSync).toHaveBeenCalledWith(
      settingsFilePath,
      JSON.stringify({...oldSettings, ...newSettings}),
    );
    expect(isSaved).toBe(true);
  });
});

describe('initializeSettings function', () => {
  it('should call writeFileSync correctly, close and createMainWindow function and return true', async () => {
    const { readFileSync, writeFileSync } = await import('node:fs');
    readFileSync.mockReturnValue("{}");
    const pesDirectory = 'pes-directory';
    vi.mock('../../src/main/services/create-main-window', () => ({
      default: () => 'main-window',
    }));
    const mainWindowObj = { mainWindow: 'empty' };
    const { BrowserWindow } = await import('electron');
    const settingsFilePath = path.join('sider-manager', 'settings.json');

    const initialize = initializeSettings(pesDirectory, mainWindowObj);
    
    expect(writeFileSync).toHaveBeenCalledWith(settingsFilePath, JSON.stringify({
      pesDirectory: pesDirectory,
      pesExecutable: ['PES2017.exe', 'sider.exe'],
    }));
    expect(BrowserWindow.getFocusedWindow().close).toHaveBeenCalled();
    expect(mainWindowObj.mainWindow).toBe('main-window');
    expect(initialize).toBe(true);
  });
});

describe('deleteSetting function', () => {
  it('should call writeFileSync function correctly and return true', async () => {
    const { readFileSync, writeFileSync } = await import('node:fs');
    const oldSettings = {
      language: 'id',
      pesDirectory: 'pes-directory',
      pesExecutable: ['pes-exe', 'sider-exe'],
      activeMLManager: { name: 'Test' },
    };
    readFileSync.mockReturnValue(JSON.stringify(oldSettings));

    const result = deleteSetting('activeMLManager');

    const newSettings = oldSettings;
    delete newSettings.activeMLManager;
    expect(writeFileSync).toHaveBeenCalledWith(
      path.join('sider-manager', 'settings.json'),
      JSON.stringify(newSettings),
    );
    expect(result).toBe(true);
  });
});
