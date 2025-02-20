// @vitest-environment jsdom

import { afterEach, describe, vi, it, expect, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import PlayGameButton from '../../src/renderer/src/components/PlayGameButton';
import Locale from '../../src/renderer/src/components/Locale';

expect.extend(matchers);

const resources = {
  id: {
    playGameBtn: {
      btnText: 'Bermain Game',
      error: {
        pesExeNotFound: 'Pada direktori instalasi PES 2017, tidak ditemukan file PES2017.exe, jika kamu pernah mengubah nama file PES2017.exe sebelumnya, kamu harus mengatur nama filenya pada menu Pengaturan!',
        siderExeNotFound: 'Pada direktori instalasi PES 2017, tidak ditemukan file sider.exe, pastikan kamu telah menginstall Addon melalui fitur Pasang Addon, atau jika kamu pernah mengubah nama file sider.exe, kamu harus mengatur nama filenya pada menu Pengaturan!',
        runApp: 'Terjadi kesalahan pada saat menjalankan aplikasi PES 2017 dan atau Sider.',
      },
    },
  },
};

describe('PlayGameButton component', () => {
  beforeEach(() => {
    window.sm = { playGame: vi.fn() };
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >

        <PlayGameButton />
      </Locale>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call playGame function when play game button clicked', async () => {
    window.sm.playGame.mockResolvedValue(false);
    const playGameButton = await screen.findByRole('button');

    await userEvent.click(playGameButton);

    expect(window.sm.playGame).toHaveBeenCalled();
  });

  it('should show alert when play game button clicked and sider executable not found', async () => {
    window.sm.playGame.mockResolvedValue('siderExeNotFound');
    const playGameButton = await screen.findByRole('button');

    await userEvent.click(playGameButton);

    const alert = screen.queryByText(resources.id.playGameBtn.error.siderExeNotFound);
    expect(alert).toBeInTheDocument();
  });

  it('should show alert when play game button clicked and pes2017 executable not found', async () => {
    window.sm.playGame.mockResolvedValue('pesExeNotFound');
    const playGameButton = await screen.findByRole('button');

    await userEvent.click(playGameButton);

    const alert = screen.queryByText(resources.id.playGameBtn.error.pesExeNotFound);
    expect(alert).toBeInTheDocument();
  });

  it('should show alert when play game button clicked and an error occurred maybe while run pes2017 and or sider application', async () => {
    window.sm.playGame.mockResolvedValue(false);
    const playGameButton = await screen.findByRole('button');

    await userEvent.click(playGameButton);

    const alert = screen.queryByText(resources.id.playGameBtn.error.runApp);
    expect(alert).toBeInTheDocument();
  });
});
