import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { saveSiderIni } from '../../src/main/services/simple-config';
import path from 'node:path';

describe('saveSiderIni function', () => {
  beforeAll(() => {
    vi.mock('node:fs', () => ({
      writeFileSync: vi.fn(),
      readFileSync: vi.fn(),
    }));

    vi.mock('../../src/main/services/settings', () => ({
      getSettings: () => ({ pesDirectory: 'pesDirectory' }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call writeFileSync correctly and return true', async () => {
    const { writeFileSync, readFileSync } = await import('node:fs');
    readFileSync.mockReturnValue(`[sider]\ndebug = 0\nlivecpk.enabled = 1\nlookup-cache.enabled = 1\nclose.on.exit = 1\nstart.minimized = 1\naddress-cache.enabled = 1`);

    const result = saveSiderIni({ key: 'debug', value: 1 });

    expect(writeFileSync).toHaveBeenCalledWith(path.join('pesDirectory', 'sider.ini'), `[sider]\ndebug = 1\nlivecpk.enabled = 1\nlookup-cache.enabled = 1\nclose.on.exit = 1\nstart.minimized = 1\naddress-cache.enabled = 1`);
    expect(result).toBe(true);
  });
});
