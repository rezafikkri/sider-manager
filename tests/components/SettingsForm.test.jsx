// @vitest-environment jsdom

import { afterEach, describe, vi, it, expect, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import SettingsForm from '../../src/renderer/src/components/SettingsForm';
import Locale from '../../src/renderer/src/components/Locale';

expect.extend(matchers);

const resources = {
  id: {
    pesDirectoryInput: {
      directoryLabelText: 'Direktori PES 2017',
      directoryInputPlaceholder: 'Masukkan direktori',
      chooseBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih atau masukkan direktori di mana kamu menginstall PES 2017.',
      dialogTitle: 'Pilih direktori PES 2017',
    },
    settingsForm: {
      error: {
        pesExe: 'Nama file executable PES tidak ada di dalam direktori instalasi PES 2017',
        siderExe: 'Nama file executable Sider tidak ada di dalam direktori instalasi PES 2017',
      },
      pesExeLabelText: 'Executable PES 2017',
      pesExeInputPlaceholder: 'Masukkan nama file executable PES',
      pesExeSmallText: 'Pastikan file executable PES berada di dalam direktori instalasi PES 2017.',
      siderExeLabelText: 'Executable Sider',
      siderExeInputPlaceholder: 'Masukkan nama file executable Sider',
      siderExeSmallText: 'Pastikan file executable Sider berada di dalam direktori instalasi PES 2017.',
      submitBtnText: 'Simpan',
      successAlertMsg: 'Pengaturan berhasil disimpan.',
    },
  },
};
const oldSettings = { pesDirectory: 'pes-directory', pesExecutable: ['pesExe', 'siderExe'] };

describe('SettingsForm component', () => {
  beforeEach(() => {
    window.sm = {
      getSettings: async () => oldSettings,
      choosePESDirectory: vi.fn(),
      isPESExecutableExist: vi.fn(),
      saveSettings: vi.fn(),
    };
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <SettingsForm />
      </Locale>
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should show oldSettings value in settings-form input', async () => {
    const pesDirectoryInput = await screen.findByPlaceholderText(resources.id.pesDirectoryInput.directoryInputPlaceholder);
    const pesExeInput = await screen.findByPlaceholderText(resources.id.settingsForm.pesExeInputPlaceholder);
    const siderExeInput = await screen.findByPlaceholderText(resources.id.settingsForm.siderExeInputPlaceholder);

    expect(pesDirectoryInput).toHaveValue(oldSettings.pesDirectory);
    expect(pesExeInput).toHaveValue(oldSettings.pesExecutable[0]);
    expect(siderExeInput).toHaveValue(oldSettings.pesExecutable[1]);
  });

  it('should call choosePESDirectory function when choose PES directory button clicked', async () => {
    const chooseButton = await screen.findByText(resources.id.pesDirectoryInput.chooseBtnText);
    await userEvent.click(chooseButton);
    
    expect(window.sm.choosePESDirectory).toHaveBeenCalled();
  });

  it('should show pesExe error when pesExe is not in pesDirectory and submit button clicked', async () => {
    window.sm.isPESExecutableExist.mockImplementation(async (exePath) => {
      if (exePath === `${oldSettings.pesDirectory}/${oldSettings.pesExecutable[0]}`) return false;
    });
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);

    await userEvent.click(submitButton);

    const pesExeError = screen.queryByText(resources.id.settingsForm.error.pesExe);
    expect(pesExeError).toBeInTheDocument();
  });

  it('should show siderExe error when siderExe is not in pesDirectory and submit button clicked', async () => {
    window.sm.isPESExecutableExist.mockImplementation(async (exePath) => {
      if (exePath === `${oldSettings.pesDirectory}/${oldSettings.pesExecutable[1]}`) return false;
    });
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);

    await userEvent.click(submitButton);

    const siderExeError = screen.queryByText(resources.id.settingsForm.error.siderExe);
    expect(siderExeError).toBeInTheDocument();
  });

  it('should show pesExe error and siderExe error when both of them are not in pesDirectory and submit button clicked', async () => {
    window.sm.isPESExecutableExist.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);

    await userEvent.click(submitButton);

    const pesExeError = screen.queryByText(resources.id.settingsForm.error.pesExe);
    const siderExeError = screen.queryByText(resources.id.settingsForm.error.siderExe);
    expect(pesExeError).toBeInTheDocument();
    expect(siderExeError).toBeInTheDocument();
  });

  it('should not call saveSettings function when error occur when submit button clicked', async () => {
    window.sm.isPESExecutableExist.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);

    await userEvent.click(submitButton);
    
    expect(window.sm.saveSettings).not.toHaveBeenCalled();
  });

  it('should call saveSettings correctly when submit button clicked', async () => {
    window.sm.isPESExecutableExist.mockResolvedValue(true);
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);
    const pesDirectoryInput = screen.getByPlaceholderText(resources.id.pesDirectoryInput.directoryInputPlaceholder);
    await userEvent.type(pesDirectoryInput, 'new');
    const pesExeInput = screen.getByPlaceholderText(resources.id.settingsForm.pesExeInputPlaceholder);
    await userEvent.type(pesExeInput, 'new');
    const siderExeInput = screen.getByPlaceholderText(resources.id.settingsForm.siderExeInputPlaceholder);
    await userEvent.type(siderExeInput, 'new');

    await userEvent.click(submitButton);

    expect(window.sm.saveSettings).toHaveBeenCalledWith({
      pesDirectory: `${oldSettings.pesDirectory}new`,
      pesExecutable: [`${oldSettings.pesExecutable[0]}new`, `${oldSettings.pesExecutable[1]}new`],
    });
  });

  it('should show success alert and remove error when submit button clicked and save settings success', async () => {
    window.sm.isPESExecutableExist.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.settingsForm.submitBtnText);
    // first click to trigger error
    await userEvent.click(submitButton);

    window.sm.saveSettings.mockResolvedValue(true);
    window.sm.isPESExecutableExist.mockResolvedValue(true);
    // second click to make save settings success
    await userEvent.click(submitButton);

    const pesExeError = screen.queryByText(resources.id.settingsForm.error.pesExe);
    const siderExeError = screen.queryByText(resources.id.settingsForm.error.siderExe);
    expect(pesExeError).not.toBeInTheDocument();
    expect(siderExeError).not.toBeInTheDocument();
    const successAlert = screen.queryByText(resources.id.settingsForm.successAlertMsg);
    expect(successAlert).toBeInTheDocument();
  });
});
