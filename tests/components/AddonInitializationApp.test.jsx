// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import AddonInitializationApp from '../../src/renderer/src/components/AddonInitializationApp';

expect.extend(matchers);

const resources = {
  id: {
    addonInitializationApp: {
      smallStrongText: 'Catatan',
      smallText: 'berkas Sider yang lama akan dibackup di',
      cancelBtnText: 'Batal',
      initializationBtnText: 'Inisialisasi',
      successAlertMsg: 'Inisialisasi Addon selesai.',
      errorAlertMsg: 'Inisialisasi Addon gagal, silahkan coba lagi!',
    },
    addonInitializationChoose: {
      pChooseFileText1: 'Pilih berkas',
      pChooseFileText2: 'yang telah kamu unduh.',
      chooseFileBtnText: 'Pilih',
      dialogTitle: 'Pilih berkas addon-initialization.zip yang telah kamu unduh.',
    },
  },
};

describe('AddonInitializationApp component', () => {
  beforeAll(() => {
    window.sm = {
      chooseInitializationFile: vi.fn(),
      addonInitialization: vi.fn(),
      getBackupPath: () => 'backupPath',
    };
  });

  beforeEach(() => {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <AddonInitializationApp />
      </Locale>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should show backupPath in small text', async () => {
    const backupPathEl = await screen.findByText('backupPath');

    expect(backupPathEl).toBeInTheDocument();
  });

  it('should show information of file correctly when choose btn clicked and choose file is not cancelled', async () => {
    const file = {
      fileName: 'addon-initialization-test.zip',
      fileSize: '300 MB',
    };
    window.sm.chooseInitializationFile.mockResolvedValue(file);
    const chooseFileBtn = await screen.findByText(resources.id.addonInitializationChoose.chooseFileBtnText);

    await userEvent.click(chooseFileBtn);

    const fileNameEl = await screen.findByText(file.fileName);
    const fileSizeEl = await screen.findByText(file.fileSize);

    expect(fileNameEl).toBeInTheDocument();
    expect(fileSizeEl).toBeInTheDocument();
  });

  it('should not show AddonInitializationFile component when choose btn clicked and choose file is cancelled', async () => {
    window.sm.chooseInitializationFile.mockResolvedValue(false);
    const chooseFileBtn = await screen.findByText(resources.id.addonInitializationChoose.chooseFileBtnText);

    await userEvent.click(chooseFileBtn);

    const addonInitializationFileEl = screen.queryByTestId('addon-initialization-file');
    expect(addonInitializationFileEl).not.toBeInTheDocument();
  });

  it('should remove file choosed correctly when remove btn clicked', async () => {
    const file = {
      fileName: 'addon-initialization-test.zip',
      fileSize: '300 MB',
    };
    window.sm.chooseInitializationFile.mockResolvedValue(file);
    const chooseFileBtn = await screen.findByText(resources.id.addonInitializationChoose.chooseFileBtnText);
    await userEvent.click(chooseFileBtn);
    const removeFileBtn = await screen.findByTestId('remove-file');

    await userEvent.click(removeFileBtn);

    const addonInitializationFileEl = screen.queryByTestId('addon-initialization-file');
    expect(addonInitializationFileEl).not.toBeInTheDocument();
  });

  it('should not remove file choosed when submit btn has been clicked and than remove btn clicked', async () => {
    const file = {
      fileName: 'addon-initialization-test.zip',
      fileSize: '300 MB',
    };
    window.sm.chooseInitializationFile.mockResolvedValue(file);
    window.sm.addonInitialization.mockReturnValue(new Promise((resolve) => {
      setTimeout(() => resolve(false), 500);
    }));
    const chooseFileBtn = await screen.findByText(resources.id.addonInitializationChoose.chooseFileBtnText);
    await userEvent.click(chooseFileBtn);
    const removeFileBtn = await screen.findByTestId('remove-file');
    const initializationBtn = await screen.findByTestId('initialization');

    await userEvent.click(initializationBtn);
    await userEvent.click(removeFileBtn);

    const addonInitializationFileEl = screen.queryByTestId('addon-initialization-file');
    expect(addonInitializationFileEl).toBeInTheDocument();
  });

  it('should call addonInitialization function correctly and show loading when file is choosed and submit btn clicked', async () => {
    const file = {
      fileName: 'addon-initialization-test.zip',
      fileSize: '300 MB',
      filePath: 'others/addon-initialization-test.zip',
    };
    window.sm.chooseInitializationFile.mockResolvedValue(file);
    window.sm.addonInitialization.mockReturnValue(new Promise((resolve) => {
      setTimeout(() => resolve(false), 300);
    }));
    const chooseFileBtn = await screen.findByText(resources.id.addonInitializationChoose.chooseFileBtnText);
    await userEvent.click(chooseFileBtn);
    const initializationBtn = await screen.findByTestId('initialization');

    await userEvent.click(initializationBtn);

    const loadingEl = screen.queryByTestId(('loading'));
    expect(window.sm.addonInitialization).toHaveBeenCalledWith(file.filePath);
    expect(loadingEl).toBeInTheDocument();
  });

  it('should not call addonInitialization function when file is not choosed and submit btn clicked', async () => {
    const initializationBtn = await screen.findByTestId('initialization');

    await userEvent.click(initializationBtn);

    const loadingEl = screen.queryByTestId(('loading'));
    expect(window.sm.addonInitialization).not.toHaveBeenCalledWith();
    expect(loadingEl).not.toBeInTheDocument();

  });
});
