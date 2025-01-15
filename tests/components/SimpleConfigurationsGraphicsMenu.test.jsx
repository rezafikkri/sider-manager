// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
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
      dialogTitle: 'Pilih direktori ML Manager baru yang ingin ditambahkan.',
      errorAlertMsg: 'ML Manager salah. Pastikan setelah nama direktori adalah direktori common (Reza Fikkri\\common) dan pastikan di dalam direktori common tidak terdapat file .cpk!',
      successAlertMsg: 'ML Manager berhasil ditambahkan.',
      directoryLabelText: 'Direktori',
      directoryInputPlaceholder: 'Masukkan direktori',
      directoryBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih lokasi direktori ML Manager baru yang ingin ditambahkan.',
      nameLabelText: 'Nama',
      nameInputPlaceholder: 'Masukkan nama ML Manager',
      previewSmallText: 'Jika ingin ada preview, sertakan file gambar berkestensi .png/.jpg pada direktori ML Manager.',
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

const mlManagers = [
  {
    name: 'Arrigo Sacchi',
    path: '/home/rezafikkri/.config/sider-manager/ml-manager/Arrigo Sacchi',
    preview: 'file:///home/rezafikkri/.config/sider-manager/ml-manager/Arrigo%20Sacchi/preview.png',
    active: false, 
  },
  {
    name: 'Alex Ferguson',
    path: '/home/rezafikkri/.config/sider-manager/ml-manager/Alex Ferguson',
    preview: 'file:///home/rezafikkri/.config/sider-manager/ml-manager/Alex%20Ferguson/preview.png',
    active: false,
  },
  {
    name: 'Bill Shankly',
    path: '/home/rezafikkri/.config/sider-manager/ml-manager/Bill Shankly',
    preview: null,
    active: false,
  },
  {
    name: 'Brian Clough',
    path: '/home/rezafikkri/.config/sider-manager/ml-manager/Brian Clough',
    preview: 'file:///home/rezafikkri/.config/sider-manager/ml-manager/Brian%20Clough/preview.png',
    active: false,
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
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call call toggleGraphicsMenu config function when toggle button clicked', async () => {
    window.sm.isGraphicsMenuConfigActivated.mockReturnValue(false);
    renderSimpleConfigurationsGraphicsMenu();
    const toggleGraphicsMenuConfigBtn = await screen.findByTestId('toggle-graphics-menu-config-btn');

    await userEvent.click(toggleGraphicsMenuConfigBtn);

    expect(window.sm.toggleGraphicsMenuConfig).toHaveBeenCalled()
  });
});
