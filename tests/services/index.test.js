import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSettings } from '../../src/main/services/settings';
import { getFileSize } from '../../src/main/services';

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
});

