// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ActivationForm from '../../src/renderer/src/components/ActivationForm';
import Locale from '../../src/renderer/src/components/Locale';

expect.extend(matchers);

// locale resources
const resources = {
  id: {
    activationForm: {
      error: {
        licenseKeyInvalid: 'Kunci lisensi salah.',
        licenseKeyHasBeenUsed: 'Kunci lisensi telah digunakan.',
        mustUpgradeLicenseKey: 'Kunci lisensi yang digunakan saat ini tidak bisa digunakan untuk versi aplikasi ini.',
        mustUpgradeLicenseKeyForm: 'Kunci lisensi tidak bisa digunakan untuk versi aplikasi ini.',
        tryAgain: 'Terjadi masalah, silahkan coba lagi!',
      },
      keyLabelText: 'Kunci lisensi',
      keyTextareaPlaceholder: 'Masukkan kunci lisensi',
      keySmallText: 'Jika terjadi masalah, silahkan hubungi kontak yang tertera pada menu Bantuan \u00bb Tentang kami.',
      submitBtnText: 'Berikutnya',
    },
  },
};

describe('ActivationForm component', () => {
  let mockOnActive;

  beforeAll(() => {
    mockOnActive = vi.fn();
    window.sm = {
      activate: vi.fn(),
      isPESDirectorySetup: vi.fn(),
      initializeMainWindow: vi.fn(),
      checkLicenseKeyHasBeenUsed: vi.fn(),
    };
  });

  beforeEach(() => {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <ActivationForm onActivate={mockOnActive} />
      </Locale>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call checkLicenseKeyHasBeenUsed function and not show must upgrade error', async () => {
    await waitFor(() => {
      expect(window.sm.checkLicenseKeyHasBeenUsed).toHaveBeenCalled();
    });
    const alert = screen.queryByText(resources.id.activationForm.error.mustUpgradeLicenseKey);
    expect(alert).not.toBeInTheDocument();
  });

  it('should call checkLicenseKeyHasBeenUsed function and show must upgrade license key error when the currently used license key cannot be used for this version of application', async () => {
    window.sm.checkLicenseKeyHasBeenUsed.mockResolvedValue('mustUpgradeLicenseKey');
    await waitFor(() => {
      expect(window.sm.checkLicenseKeyHasBeenUsed).toHaveBeenCalled();
    });
    const alert = await screen.findByText(resources.id.activationForm.error.mustUpgradeLicenseKey);
    expect(alert).toBeInTheDocument();
  });

  it('should not call activate function when next button clicked and activation-input is empty', async () => {
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);

    await userEvent.click(submitButton);

    expect(window.sm.activate).not.toHaveBeenCalled();
  });

  it('should call activate function correctly and call initializeMainWindow function when next button clicked, license key is valid and PES directory is setup yet', async () => {
    window.sm.activate.mockResolvedValue(true);
    window.sm.isPESDirectorySetup.mockResolvedValue(true);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    expect(window.sm.activate).toHaveBeenCalledWith('This is license key');
    expect(window.sm.initializeMainWindow).toHaveBeenCalled();
  });

  it('should call activate function correctly and call onActive function when next button clicked, license key is valid and PES directory is not setup yet', async () => {
    window.sm.activate.mockResolvedValue(true);
    window.sm.isPESDirectorySetup.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    expect(window.sm.activate).toHaveBeenCalledWith('This is license key');
    expect(mockOnActive).toHaveBeenCalled();
  });

  it('should show loading when next button clicked and activation-input is not empty', async () => {
    window.sm.activate.mockReturnValue(new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 700);
    }));
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    const loadingEl = screen.queryByTestId('loading');
    expect(loadingEl).toBeInTheDocument();
  });

  it('should show error message (with licenseKeyIsInvalid) when next button clicked and license key is invalid', async () => {
    window.sm.activate.mockResolvedValue('licenseKeyInvalid');
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.licenseKeyInvalid);
    expect(alert).toBeInTheDocument();
  });

  it('should show error message (with licenseKeyHasBeenUsed) when next button clicked and license key has been used', async () => {
    window.sm.activate.mockResolvedValue('licenseKeyHasBeenUsed');
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.licenseKeyHasBeenUsed);
    expect(alert).toBeInTheDocument();
  });

  it('should show error message (with tryAgain) when next button clicked and activate false alias unkown error coccurred', async () => {
    window.sm.activate.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.tryAgain);
    expect(alert).toBeInTheDocument();
  });

  it('should show error message (with mustUpgradeLicenseKey) when next button clicked and license cannot be used for this version of application', async () => {
    window.sm.activate.mockResolvedValue('mustUpgradeLicenseKey');
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is license key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.mustUpgradeLicenseKeyForm);
    expect(alert).toBeInTheDocument();
  });
});
