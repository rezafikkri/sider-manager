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

  it('should call chooseMLManager function correctly when card clicked', async () => {
    window.sm.isPressRoomConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsPressRoom();
    window.sm.readPressRooms.mockResolvedValue(pressRooms);
    const pressRoomCard = await screen.findByTestId(`config-card-${pressRooms[3].name}`);

    await userEvent.click(pressRoomCard);
    
    expect(window.sm.choosePressRoom).toHaveBeenCalledWith({ ...pressRooms[3], active: true });
  });

  it('should call savePressRoom function correctly when submit button for add press room clicked', async () => {
    window.sm.isPressRoomConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsPressRoom();
    const showModalBtn = await screen.findByTestId('show-modal-add-press-room-btn');
    await userEvent.click(showModalBtn);

    const directoryObj = {
      name: 'Reza Fikkri',
      directory: path.join('others', 'Press room new'),
      preview: url.pathToFileURL(path.join('others', 'Press room new', 'preview.jpg')).toString(),
    };
    window.sm.chooseNewSimpleConfigDirectory.mockReturnValue(directoryObj);
    const chooseDirectoryBtn = await screen.findByTestId('choose-directory-btn');
    const submitBtn = await screen.findByTestId('submit-btn');

    await userEvent.click(chooseDirectoryBtn);
    await userEvent.click(submitBtn);

    expect(window.sm.savePressRoom).toHaveBeenCalledWith(directoryObj.name, directoryObj.directory);
  });

  it('should call deletePressRoom function correctly when yesBtn for delete graphic menu clicked', async () => {
    window.sm.isPressRoomConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsPressRoom();
    window.sm.readPressRooms.mockResolvedValue(pressRooms);
    const pressRoomCardGaruda = await screen.findByTestId('config-card-Garuda Power');
    const deleteBtn = pressRoomCardGaruda.querySelector('button');

    await userEvent.click(deleteBtn);

    const yesBtn = await screen.findByText(resources.id.modalPrompt.yesBtnText);
    await userEvent.click(yesBtn);

    expect(window.sm.deletePressRoom).toHaveBeenCalledWith('Garuda Power');
  });
});
