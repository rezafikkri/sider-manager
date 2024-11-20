// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
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
        activationKeyInvalid: 'Kunci aktivasi salah.',
        activationKeyHasBeenUsed: 'Kunci aktivasi telah digunakan.',
        tryAgain: 'Terjadi masalah, silahkan coba lagi!',
      },
      keyLabelText: 'Kunci aktivasi',
      keyTextareaPlaceholder: 'Masukkan kunci aktivasi',
      keySmallText: 'Jika terjadi masalah, silahkan hubungi kontak yang tertera pada menu Bantuan \u00bb Tentang kami.',
      submitBtnText: 'Berikutnya',
    },
  },
};

describe('ActivationForm component', () => {
  let mockOnActive;

  beforeAll(() => {
    mockOnActive = vi.fn();
    window.sm = { activate: vi.fn(), isPESDirectorySetup: vi.fn(), initializeMainWindow: vi.fn() };
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
    vi.resetAllMocks();
    cleanup();
  });

  it('should not call activate function when next button clicked and activation-input is empty', async () => {
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);

    await userEvent.click(submitButton);

    expect(window.sm.activate).not.toHaveBeenCalled();
  });

  it('should call activate function correctly and call initializeMainWindow function when next button clicked, activation key is valid and PES directory is setup yet', async () => {
    window.sm.activate.mockResolvedValue(true);
    window.sm.isPESDirectorySetup.mockResolvedValue(true);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    await userEvent.click(submitButton);

    expect(window.sm.activate).toHaveBeenCalledWith('This is activation key');
    expect(window.sm.initializeMainWindow).toHaveBeenCalled();
  });

  it('should call activate function correctly and call onActive function when next button clicked, activation key is valid and PES directory is not setup yet', async () => {
    window.sm.activate.mockResolvedValue(true);
    window.sm.isPESDirectorySetup.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    await userEvent.click(submitButton);

    expect(window.sm.activate).toHaveBeenCalledWith('This is activation key');
    expect(mockOnActive).toHaveBeenCalled();
  });

  it('should show loading when next button clicked and activation-input is not empty', async () => {
    window.sm.activate.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    });
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    userEvent.click(submitButton);

    const loading = await screen.findByTestId('loading');
    expect(loading).toBeInTheDocument();
  });

  it('should show error message (with activationKeyIsInvalid) when next button clicked and activation key is invalid', async () => {
    window.sm.activate.mockResolvedValue('activationKeyInvalid');
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.activationKeyInvalid);
    expect(alert).toBeInTheDocument();
  });

  it('should show error message (with activationKeyHasBeenUsed) when next button clicked and activation key has been used', async () => {
    window.sm.activate.mockResolvedValue('activationKeyHasBeenUsed');
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.activationKeyHasBeenUsed);
    expect(alert).toBeInTheDocument();
  });

  it('should show error message (with tryAgain) when next button clicked and activate false alias unkown error coccurred', async () => {
    window.sm.activate.mockResolvedValue(false);
    const submitButton = await screen.findByText(resources.id.activationForm.submitBtnText);
    const activationInput = screen.getByRole('textbox');
    await userEvent.type(activationInput, 'This is activation key');

    await userEvent.click(submitButton);

    const alert = await screen.findByText(resources.id.activationForm.error.tryAgain);
    expect(alert).toBeInTheDocument();
  });
});
