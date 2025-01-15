// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import path from 'node:path';
import url from 'node:url';
import Locale from '../../src/renderer/src/components/Locale';
import SimpleConfigurationsGraphicsMenu from '../../src/renderer/src/components/SimpleConfigurationsGraphicsMenu';

expect.extend(matchers);

const resources = {
  id: {
    simpleConfigurationsGraphicsMenu: {
      desc: 'Choose Graphic Menu that you want to use.',
      statusOn: 'On',
      statusOff: 'Off',
      addMLManagerBtnText: 'Add',
      successAlertMsg: {
        choosed: 'Graphic Menu successfully choosed.',
        changed: 'Graphic Menu successfully changed.',
      },
      successDeleteAlertMsg: 'ML Manager successfully deleted.',
    },
    simpleConfigurationsMLManager: {
      desc: 'Pilih manager tim yang ingin kamu gunakan ketika memainkan Master League.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addMLManagerBtnText: 'Tambah Manager',
      successAlertMsg: {
        choosed: 'Manager berhasil dipilih.',
        changed: 'Manager berhasil diubah.',
      },
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

const graphicsMenu = [
  {
    name: 'Al Hilal SC',
    path: '/home/rezafikkri/.config/sider-manager/graphics-menu/Al Hilal SC',
    preview: 'file:///home/rezafikkri/.config/sider-manager/graphics-menu/Al%20Hilal%20SC/preview.png',
    active: true
  },
  {
    name: 'Gabuci',
    path: '/home/rezafikkri/.config/sider-manager/graphics-menu/Gabuci',
    preview: 'file:///home/rezafikkri/.config/sider-manager/graphics-menu/Gabuci/preview.png',
    active: false
  },
  {
    name: 'Gabuto',
    path: '/home/rezafikkri/.config/sider-manager/graphics-menu/Gabuto',
    preview: 'file:///home/rezafikkri/.config/sider-manager/graphics-menu/Gabuto/preview.png',
    active: false
  },
  {
    name: 'Leonardo',
    path: '/home/rezafikkri/.config/sider-manager/graphics-menu/Leonardo',
    preview: 'file:///home/rezafikkri/.config/sider-manager/graphics-menu/Leonardo/preview.png',
    active: false
  },
];

function renderSimpleConfigurationsGraphicsMenu() {
  render(
    <Locale
      getResources={async () => resources}
      getSettings={async () => ({locale: 'id'})}
      saveSettings={async () => {}}
    >
      <SimpleConfigurationsGraphicsMenu />
    </Locale>
  );
}

describe('simpleConfigurationsGraphicsMenu component', () => {
  beforeAll(() => {
    window.sm = {
      toggleGraphicsMenuConfig: vi.fn(),
      isGraphicsMenuConfigActivated: vi.fn(),
      readGraphicsMenu: vi.fn(),
      chooseGraphicMenu: vi.fn(),
      saveGraphicMenu: vi.fn(),
      chooseNewSimpleConfigDirectory: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call call toggleGraphicsMenu config function when toggle button clicked', async () => {
    window.sm.isGraphicsMenuConfigActivated.mockReturnValue(false);
    renderSimpleConfigurationsGraphicsMenu();
    window.sm.readGraphicsMenu.mockResolvedValue(graphicsMenu);
    const toggleGraphicsMenuConfigBtn = await screen.findByTestId('toggle-graphics-menu-config-btn');

    await userEvent.click(toggleGraphicsMenuConfigBtn);

    expect(window.sm.toggleGraphicsMenuConfig).toHaveBeenCalled()
  });

  it('should call chooseMLManager function correctly when card clicked', async () => {
    window.sm.isGraphicsMenuConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsGraphicsMenu();
    window.sm.readGraphicsMenu.mockResolvedValue(graphicsMenu);
    const graphicMenuCard = await screen.findByTestId(`config-card-${graphicsMenu[3].name}`);

    await userEvent.click(graphicMenuCard);
    
    expect(window.sm.chooseGraphicMenu).toHaveBeenCalledWith({ ...graphicsMenu[3], active: true });
  });

  it('should call saveGraphicMenu correctly when submit button for ad graphic menu clicked', async () => {
    renderSimpleConfigurationsGraphicsMenu();
    const showModalBtn = await screen.findByTestId('show-modal-add-graphic-menu-btn');
    await userEvent.click(showModalBtn);

    const directoryObj = {
      name: 'Reza Fikkri',
      directory: path.join('others', 'Graphic menu new'),
      preview: url.pathToFileURL(path.join('others', 'Graphic menu new', 'preview.jpg')).toString(),
    };
    window.sm.chooseNewSimpleConfigDirectory.mockReturnValue(directoryObj);
    const chooseDirectoryBtn = await screen.findByTestId('choose-directory-btn');
    const submitBtn = await screen.findByTestId('submit-btn');

    await userEvent.click(chooseDirectoryBtn);
    await userEvent.click(submitBtn);

    expect(window.sm.saveGraphicMenu).toHaveBeenCalledWith(directoryObj.name, directoryObj.directory);
  });
});
