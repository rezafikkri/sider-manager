import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { chooseDirectory, getFileSize } from '../../src/main/services';

afterEach(() => {
  vi.clearAllMocks();
});

describe('getFileSize function', () => {
  beforeAll(() => {
    vi.mock('electron', () => ({
      BrowserWindow: () => '',
    }));

    vi.mock('../../src/main/services/settings', () => ({
      getSettings: vi.fn(),
    }));

    vi.mock('node:fs', () => ({
      statSync: vi.fn(),
    }));
  });

  it('should return file size in KB in english locale when file size does not reach 1 MB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'en' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 1230 });

    const result = getFileSize('test.txt');

    expect(result).toBe('1.2 KB');
  });

  it('should return file size in MB in english locale when file size reach or exceed 1 MB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'en' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 1540000 });

    const result = getFileSize('test.txt');

    expect(result).toBe('1.5 MB');
  });

  it('should return file size in GB in english locale when file size reach or exceed 1 GB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'en' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 1540000000 });

    const result = getFileSize('test.txt');

    expect(result).toBe('1.5 GB');
  });

  it('should return file size in KB in indonesian locale when file size does not reach 1 MB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'id' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 13400 });

    const result = getFileSize('test.txt');

    expect(result).toBe('13,4 KB');
  });

  it('should return file size in MB in indonesian locale when file size reach or exceed 1 MB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'id' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 1430000 });

    const result = getFileSize('test.txt');

    expect(result).toBe('1,4 MB');
  });

  it('should return file size in GB in indonesian locale when file size reach or exceed 1 GB', async () => {
    const { getSettings } = await import('../../src/main/services/settings');
    getSettings.mockReturnValue({ locale: 'id' });
    const { statSync } = await import('node:fs');
    statSync.mockReturnValue({ size: 1530000000 });

    const result = getFileSize('test.txt');

    expect(result).toBe('1,5 GB');
  });
});

describe('chooseDirectory function', () => {
  beforeAll(() => {
    vi.mock('electron', () => {
      return {
        dialog: {
          showOpenDialog: vi.fn(),
        },
      };
    });
  });

  it('should call showOpenDialog function correctly and return the directory when choose pes directory not canceled', async () => {
    const directory = 'directory';
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: false, filePaths: [directory] });

    const result = await chooseDirectory('title');

    expect(dialog.showOpenDialog).toHaveBeenCalledWith({title: 'title', properties: ['openDirectory']});
    expect(result).toBe(directory);
  });

  it('should return false when choose directory canceled', async () => {
    const { dialog } = await import('electron');
    dialog.showOpenDialog.mockReturnValue({ canceled: true });

    const result = await chooseDirectory('title');

    expect(result).toBe(false);
  });
});
