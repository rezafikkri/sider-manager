// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import ModalPrompt from '../../src/renderer/src/components/ModalPrompt';

expect.extend(matchers);

const resources = {
  id: {
    modalPrompt: {
      msgPrefix: 'Apakah kamu yakin ingin menghapus',
      msgEnding: 'akan dihapus secara permananen.',
      yesBtnText: 'Ya, saya yakin',
      cancelBtnText: 'Tidak, batal',
    },
  },
};

function renderModalPrompt(props) {
  render(
    <Locale
      getResources={async () => resources}
      getSettings={async () => ({locale: 'id'})}
      saveSettings={async () => {}}
    >
      <ModalPrompt {...props} />
    </Locale>
  );
}

describe('ModalPrompt component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should show modal with name and category will be deleted correctly', async () => {
    const props = {
      name: 'Reza Fikkri',
      category: 'ML Manager',
      onDelete: () => {},
      onClose: () => {},
      showSuccessAlert: () => {},
    };
    renderModalPrompt(props);

    const msgEl = await screen.findByTestId('alert-message-delete');
    expect(msgEl).toBeInTheDocument();
    expect(msgEl.innerHTML).toBe(`${resources.id.modalPrompt.msgPrefix}<strong> ${props.category} ${props.name}</strong>? ${props.category} ${resources.id.modalPrompt.msgEnding}`);
  });

  it('should call onClose function when closeBtn clicked', async () => {
    const onClose = vi.fn();
    const props = {
      name: 'Reza Fikkri',
      category: 'ML Manager',
      onDelete: () => {},
      onClose,
      showSuccessAlert: () => {},
    };
    renderModalPrompt(props);
    const closeBtn = await screen.findByTestId('close-btn');

    await userEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose function when cancelBtn clicked', async () => {
    const onClose = vi.fn();
    const props = {
      name: 'Reza Fikkri',
      category: 'ML Manager',
      onDelete: () => {},
      onClose,
      showSuccessAlert: () => {},
    };
    renderModalPrompt(props);
    const cancelBtn = await screen.findByText(resources.id.modalPrompt.cancelBtnText);
    
    await userEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onDelete function correctly, show loading, disable closeBtn and cancelBtn, and call onClose and showSuccessAlert function when yesBtn clicked', async () => {
    const onDelete = vi.fn().mockReturnValue(new Promise((resolve) => {
      setTimeout(() => resolve(true), 400);
    }));
    const onClose = vi.fn();
    const showSuccessAlert = vi.fn();
    const props = {
      name: 'Reza Fikkri',
      category: 'ML Manager',
      onDelete,
      onClose,
      showSuccessAlert,
    };
    renderModalPrompt(props);
    const yesBtn = await screen.findByText(resources.id.modalPrompt.yesBtnText);

    await userEvent.click(yesBtn);

    expect(onDelete).toHaveBeenCalledWith(props.name);
    const loadingEl = await screen.findByTestId('loading');
    expect(loadingEl).toBeInTheDocument();
    const cancelBtn = await screen.findByText(resources.id.modalPrompt.cancelBtnText);
    const closeBtn = await screen.findByTestId('close-btn');
    expect(cancelBtn).toBeDisabled();
    expect(closeBtn).toBeDisabled();
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(showSuccessAlert).toHaveBeenCalled();
    });
  });
});
