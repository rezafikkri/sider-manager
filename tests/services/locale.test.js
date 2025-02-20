import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLocaleResources, initializeLocale, resources } from '../../src/main/services/locale';
import path from 'node:path';

beforeAll(() => {
  vi.mock('../../src/main/services/create-main-window', () => ({
    default: () => 'main-window',
  }));
});

describe('initializeLocale function', () => {
  beforeAll(() => {
    resources.id = {ind:'resourcesId'};
    resources.en = {eng:'resourcesEn'};

    vi.mock('electron', () => ({
      app: {
        getPath: () => ''
      },
    }));
  });

  beforeEach(() => {
    vi.mock('node:fs', () => ({
      writeFileSync: vi.fn(),
      existsSync: vi.fn(),
      mkdirSync: vi.fn(),
      readFileSync: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call mkdirSync function correctly when localePath is not exist', async () => {
    const { existsSync, mkdirSync } = await import('node:fs');
    const localePath = path.join('sider-manager', 'locale');
    existsSync.mockImplementation((path) => {
      if (path === localePath) return false;
    });

    initializeLocale();

    expect(mkdirSync).toHaveBeenCalledWith(localePath, { recursive: true });
  });

  it('should not call mkdirSync function for localePath when localePath is exist', async () => {
    const { existsSync, mkdirSync } = await import('node:fs');
    const localePath = path.join('sider-manager', 'locale');
    existsSync.mockImplementation((path) => {
      if (path === localePath) return true;
    });

    initializeLocale();

    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('should call writeFileSync function correctly when settingsFilePath is not exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const settingsFilePath = path.join('sider-manager', 'settings.json');
    existsSync.mockImplementation((path) => {
      if (path === settingsFilePath) return false;
    });
    initializeLocale();

    expect(writeFileSync).toHaveBeenCalledWith(settingsFilePath, JSON.stringify({locale:'id'}));
  });

  it('should not call writeFileSync function for settingsFilePath when settingsFilePath is exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const settingsFilePath = path.join('sider-manager', 'settings.json');
    existsSync.mockImplementation((path) => {
      if (path === settingsFilePath) return true;
    });
    initializeLocale();

    expect(writeFileSync).not.toHaveBeenCalledWith(settingsFilePath, JSON.stringify({locale:'id'}));
  });

  it('should call writeFileSync function correctly when idLocalePath is not exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const idLocalePath = path.join('sider-manager', 'locale', 'id.json');
    existsSync.mockImplementation((path) => {
      if (path === idLocalePath) return false;
    });
    initializeLocale();

    expect(writeFileSync).toHaveBeenCalledWith(idLocalePath, JSON.stringify(resources.id));
  });

  it('should not call writeFileSync function for idLocalePath when idLocalePath is exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const idLocalePath = path.join('sider-manager', 'locale', 'id.json');
    existsSync.mockImplementation((path) => {
      if (path === idLocalePath) return true;
    });
    initializeLocale();

    expect(writeFileSync).not.toHaveBeenCalledWith(idLocalePath, JSON.stringify(resources.id));
  });

  it('should call writeFileSync function correctly when enLocalePath is not exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const enLocalePath = path.join('sider-manager', 'locale', 'en.json');
    existsSync.mockImplementation((path) => {
      if (path === enLocalePath) return false;
    });
    initializeLocale();

    expect(writeFileSync).toHaveBeenCalledWith(enLocalePath, JSON.stringify(resources.en));
  });

  it('should not call writeFileSync function for enLocalePath when enLocalePath is exist', async () => {
    const { existsSync, writeFileSync } = await import('node:fs');
    const enLocalePath = path.join('sider-manager', 'locale', 'en.json');
    existsSync.mockImplementation((path) => {
      if (path === enLocalePath) return true;
    });
    initializeLocale();

    expect(writeFileSync).not.toHaveBeenCalledWith(enLocalePath, JSON.stringify(resources.en));
  });
});

describe('getLocaleResources function', () => {
  it('should return resources correctly', async () => {
    const { readFileSync } = await import('node:fs');
    readFileSync.mockReturnValueOnce(JSON.stringify(resources.id));
    readFileSync.mockReturnValueOnce(JSON.stringify(resources.en));

    const localeResources = getLocaleResources();

    expect(localeResources).toEqual({
      id: resources.id,
      en: resources.en,
    });
  });
});
