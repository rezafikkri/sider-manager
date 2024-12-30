// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import SimpleConfigurationsSider from '../../src/renderer/src/components/SimpleConfigurationsSider';

expect.extend(matchers);

const resources = {
  id: {
    simpleConfigurationsSider: {
      pText: 'Konfigurasi Sider kamu dengan mudah.',
      sectionPDesc1: 'Membuat Sider mengeluarkan beberapa informasi tambahan ke dalam file log <code>sider.log</code>. Tetapi harap diingat ini dapat memperlambat permainan.',
      sectionPDesc2: 'Mengaktifkan/menonaktifkan dukungan skrip.',
      sectionPDesc3: 'Mengaktifkan/menonaktifkan fungsionalitas LiveCPK dari Sider.',
      sectionPDesc5: 'Membuat Sider akan menutup sendiri, ketika keluar dari game.',
      sectionPDesc6: 'Membuat Sider akan mulai dengan jendela yang diperkecil.',
      sectionPDesc8: 'Memungkinkan gerakan bebas pengontrol. Biasanya, itu hanya mungkin dalam mode Exhibition, tetapi dengan mengaktifkan fitur ini, Anda juga dapat memindahkan pengontrol di mode kompetisi.',
      sectionPDesc9: 'Memungkinkan pengontrol pertama dipindahkan ke tengah, menonaktifkannya secara efektif.',
      sectionPDesc10: 'Matikan bilah hitam (<i>letterboxing</i>) di bagian atas dan bawah layar, atau di kiri/kanan.',
      sectionPDesc11: 'Mengaktifkan slider "Angle" untuk kamera "Dynamic Wide". Fitur ini agak eksperimental.',
      sectionPDesc12: 'Ini memungkinkan untuk memperluas jangkauan slider kamera: Zoom, Height, Angle. Saat ini, ini hanya berfungsi untuk kamera "Kustom". Setel ke <code>0</code> untuk menonaktifkan fitur ini.',
    },
  },
};

const siderIni = [
  '[sider]',
  'debug = 0',
  'livecpk.enabled = 1',
  'lookup-cache.enabled = 1',
  'close.on.exit = 1',
  'start.minimized = 1',
  'address-cache.enabled = 1',
  'free.select.sides = 1',
  'free.first.player = 1',
  'camera.sliders.max = 50',
  'camera.dynamic-wide.angle.enabled = 0',
  'black.bars.off = 1',
  'lua.enabled = 1',
]

describe('SimpleConfigurationsSider function', () => {
  beforeAll(() => {
    window.sm = {
      getSettings: async () => ({ pesDirectory: 'pesDirectory' }),
      readSiderIni: async () => siderIni,
      saveSiderIni: vi.fn(),
    };
  });

  beforeEach(() => {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <SimpleConfigurationsSider />
      </Locale>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should show old sider.ini configuration', async () => {
    const debugToggle = await screen.findByTestId(siderIni[1].replace(' = ', ''));
    const liveCpkToggle = await screen.findByTestId(siderIni[2].replace(' = ', ''));
    const cameraSlidersMax = await screen.findByTestId(siderIni[9].replace(' = ', ''));

    expect(debugToggle).not.toBeChecked();
    expect(liveCpkToggle).toBeChecked();
    expect(cameraSlidersMax).toHaveValue(50);
  });

  it('should call saveSiderIni function and show toggle correctly based on new toggle value when toggle button clicked', async () => {
    const debugToggle = await screen.findByTestId(siderIni[1].replace(' = ', ''));

    await userEvent.click(debugToggle);

    expect(window.sm.saveSiderIni).toHaveBeenCalledWith({ key: 'debug', value: 1 });
    expect(debugToggle).toBeChecked();
  });

  it('should call saveSiderIni function correctly, settimeout and clearTimeout function and show new input value when value of input is changed', async () => {
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const cameraSlidersMax = await screen.findByTestId(siderIni[9].replace(' = ', ''));

    fireEvent.change(cameraSlidersMax, {target:{value:30}});

    await waitFor(() => expect(window.sm.saveSiderIni).toHaveBeenCalledWith({ key: 'camera.sliders.max', value: '30' }));
    expect(setTimeoutSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(cameraSlidersMax).toHaveValue(30);
  });
});
