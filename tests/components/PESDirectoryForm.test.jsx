// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import PESDirectoryForm from '../../src/renderer/src/components/PESDirectoryForm';
import Locale from '../../src/renderer/src/components/Locale';

expect.extend(matchers);

const resources = {
  id: {
    pesDirectoryForm: {
      submitBtnText: 'Selesai',
    },
    pesDirectoryInput: {
      directoryLabelText: 'Direktori PES 2017',
      directoryInputPlaceholder: 'Masukkan direktori',
      chooseBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih atau masukkan direktori di mana kamu menginstall PES 2017.',
      dialogTitle: 'Pilih direktori PES 2017',
    },
  },
};

describe('PESDirectoryForm component', () => {
  beforeAll(() => {
    window.sm = {
      initializeSettings: vi.fn(),
      choosePESDirectory: vi.fn(),
    };
  });

  beforeEach(() => {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <PESDirectoryForm />
      </Locale>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should not call initializeSettings function when directory not chosen yet when finish button clicked', async () => {
    const finishButton = await screen.findByText('Selesai');

    await userEvent.click(finishButton);

    expect(window.sm.initializeSettings).not.toHaveBeenCalled();
  });

  it('should call choosePESDirectory function when choose PES directory button clicked', async () => {
    const chooseButton = await screen.findByText(resources.id.pesDirectoryInput.chooseBtnText);
    await userEvent.click(chooseButton);
    
    expect(window.sm.choosePESDirectory).toHaveBeenCalled();
  });

  it('should call initializeSettings function correctly when finish button clicked', async () => {
    const finishButton = await screen.findByText(resources.id.pesDirectoryForm.submitBtnText);
    const directoryInput = await screen.findByPlaceholderText(resources.id.pesDirectoryInput.directoryInputPlaceholder);
    await userEvent.type(directoryInput, 'pes-directory');

    await userEvent.click(finishButton);

    expect(window.sm.initializeSettings).toHaveBeenCalledWith('pes-directory');
  });
});
