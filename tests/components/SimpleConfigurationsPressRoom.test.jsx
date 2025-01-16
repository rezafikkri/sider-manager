// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import path from 'node:path';
import url from 'node:url';
import Locale from '../../src/renderer/src/components/Locale';
import SimpleConfigurationsPressRoom from '../../src/renderer/src/components/SimpleConfigurationsPressRoom';

expect.extend(matchers);

const resources = {
  id: {
    simpleConfigurationsPressRoom: {
      desc: 'Pilih Press Room yang ingin kamu gunakan.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addPressRoomBtnText: 'Tambah',
      successAlertMsg: {
        choosed: 'Press Room berhasil dipilih.',
        changed: 'Press Room berhasil diubah.',
      },
      successDeleteAlertMsg: 'Press Room berhasil dihapus.',
    },
    modalWithSimpleConfigForm: {
      dialogTitle: 'Pilih direktori :param baru yang ingin ditambahkan.',
      errorAlertMsgWithCpk: ':param salah. Pastikan setelah nama direktori adalah direktori common (contoh: <strong>Reza Fikkri\\common</strong>) dan pastikan di dalam direktori common tidak terdapat file .cpk!',
      errorAlertMsgWithoutCpk: ':param salah. Pastikan setelah nama direktori adalah direktori common (contoh: <strong>Reza Fikkri\\common</strong>)!',
      successAlertMsg: ':param berhasil ditambahkan.',
      directoryLabelText: 'Direktori',
      directoryInputPlaceholder: 'Masukkan direktori',
      directoryBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih lokasi direktori :param baru yang ingin ditambahkan.',
      nameLabelText: 'Nama',
      nameInputPlaceholder: 'Masukkan nama :param',
      previewSmallText: 'Jika ingin ada preview, sertakan file gambar berkestensi <strong>.png</strong> atau <strong>.jpg</strong> pada direktori :param.',
      submitBtnText: 'Simpan',
    },
    modalPrompt: {
      msgPrefix: 'Apakah kamu yakin ingin menghapus',
      msgEnding: 'akan dihapus secara permananen.',
      yesBtnText: 'Ya, saya yakin',
      cancelBtnText: 'Tidak, batal',
    },
  },
};

const pressRooms = [
  {
    name: 'Atlas Warriors',
    path: '/home/rezafikkri/.config/sider-manager/press-room/Atlas Warriors',
    preview: 'file:///home/rezafikkri/.config/sider-manager/press-room/Atlas%20Warriors/preview.png',
    active: false
  },
  {
    name: 'Dragon Slayer',
    path: '/home/rezafikkri/.config/sider-manager/press-room/Dragon Slayer',
    preview: 'file:///home/rezafikkri/.config/sider-manager/press-room/Dragon%20Slayer/preview.png',
    active: false
  },
  {
    name: 'Garuda Power',
    path: '/home/rezafikkri/.config/sider-manager/press-room/Garuda Power',
    preview: 'file:///home/rezafikkri/.config/sider-manager/press-room/Garuda%20Power/preview.png',
    active: false
  },
  {
    name: 'Titan Legion',
    path: '/home/rezafikkri/.config/sider-manager/press-room/Titan Legion',
    preview: 'file:///home/rezafikkri/.config/sider-manager/press-room/Titan%20Legion/preview.png',
    active: false
  },
];

function renderSimpleConfigurationsPressRoom() {
  render(
    <Locale
      getResources={async () => resources}
      getSettings={async () => ({locale: 'id'})}
      saveSettings={async () => {}}
    >
      <SimpleConfigurationsPressRoom />
    </Locale>
  );
}

describe('SimpleConfigurationsPresRoom component', () => {
  beforeAll(() => {
    window.sm = {
      togglePressRoomConfig: vi.fn(),
      isPressRoomConfigActivated: vi.fn(),
      readPressRooms: vi.fn(),
      choosePressRoom: vi.fn(),
      savePressRoom: vi.fn(),
      chooseNewSimpleConfigDirectory: vi.fn(),
      deletePressRoom: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call call togglePressRoom config function when toggle button clicked', async () => {
    window.sm.isPressRoomConfigActivated.mockReturnValue(false);
    renderSimpleConfigurationsPressRoom();
    window.sm.readPressRooms.mockResolvedValue(pressRooms);
    const togglePressRoomConfigBtn = await screen.findByTestId('toggle-press-room-config-btn');

    await userEvent.click(togglePressRoomConfigBtn);

    expect(window.sm.togglePressRoomConfig).toHaveBeenCalled()
  });
});
