// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import SimpleConfigurationsMLManager from '../../src/renderer/src/components/SimpleConfigurationsMLManager';

expect.extend(matchers);

const resources = {
  id: {
    simpleConfigurationsMLManager: {
      desc: 'Pilih manager tim yang ingin kamu gunakan ketika memainkan Master League.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addMLManagerBtnText: 'Tambah Manager',
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
    preview: 'file:///home/rezafikkri/.config/sider-manager/ml-manager/Bill%20Shankly/preview.png',
    active: false,
  },
  {
    name: 'Brian Clough',
    path: '/home/rezafikkri/.config/sider-manager/ml-manager/Brian Clough',
    preview: 'file:///home/rezafikkri/.config/sider-manager/ml-manager/Brian%20Clough/preview.png',
    active: false,
  },
];

describe('SimpleConfigurationsMLManager component', () => {
  beforeAll(() => {
    window.sm = {
      readMLManagers: vi.fn(),
      toggleMLManagerConfig: vi.fn(),
      chooseMLManager: vi.fn(),
      isMLManagerConfigActivated: vi.fn(),
    };
  });

  function renderSimpleConfigurationsMLManager() {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <SimpleConfigurationsMLManager />
      </Locale>
    );
  }

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should not show ML Managers and disable add ml manager button when config ml manager status is false', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(false);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers);
    const addMLManagerBtn = await screen.findByTestId('add-ml-manager-btn');
    const mlManagerCard = screen.queryByTestId('config-card-Arrigo Sacchi');

    expect(mlManagerCard).not.toBeInTheDocument();
    expect(addMLManagerBtn).toBeDisabled();
  });

  it('should show ML Managers correctly and enable add ml manager button when config ml manager status is true', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers);
    const addMLManagerBtn = await screen.findByTestId('add-ml-manager-btn');

    for (const mlManager of mlManagers) {
      const mlManagerCard = await screen.findByTestId(`config-card-${mlManager.name}`);
      expect(mlManagerCard).toBeInTheDocument();
      expect(mlManagerCard).toHaveClass('cursor-pointer');
      expect(mlManagerCard.querySelector('input[name="config"]')).not.toBeChecked();
      expect(mlManagerCard.querySelector('button')).toBeInTheDocument();
    }
    expect(addMLManagerBtn).toBeEnabled();
  });

  it('should call toggleMLManager config function, enable add ml manager button, show toggle button correctly and show ML Managers correctly when toggle ml manager config button clicked and from off to on', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(false);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers);
    const addMLManagerBtn = await screen.findByTestId('add-ml-manager-btn');
    const toggleMLManagerConfigBtn = await screen.findByTestId('toggle-ml-manager-config-btn');

    await userEvent.click(toggleMLManagerConfigBtn);

    expect(window.sm.toggleMLManagerConfig).toHaveBeenCalled();
    expect(addMLManagerBtn).toBeEnabled();
    for (const mlManager of mlManagers) {
      const mlManagerCard = await screen.findByTestId(`config-card-${mlManager.name}`);
      expect(mlManagerCard).toBeInTheDocument();
      expect(mlManagerCard.querySelector('input[name="config"]')).not.toBeChecked();
    }
  });

  it('should call toggleMLManager config function, disable add ml manager button, show toggle button correctly and not show ML Managers when toggle ml manager config button clicked and from on to off', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers);
    const addMLManagerBtn = await screen.findByTestId('add-ml-manager-btn');
    const toggleMLManagerConfigBtn = await screen.findByTestId('toggle-ml-manager-config-btn');
    const mlManagerCard = await screen.findByTestId('config-card-Alex Ferguson');

    await userEvent.click(toggleMLManagerConfigBtn);

    expect(window.sm.toggleMLManagerConfig).toHaveBeenCalled();
    expect(mlManagerCard).not.toBeInTheDocument();
    expect(addMLManagerBtn).toBeDisabled();
  });

  it('should call chooseMLManager function correctly and activate card of ml manager choosed correctly when card clicked', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers);
    const mlManagerCard = await screen.findByTestId(`config-card-${mlManagers[3].name}`);

    await userEvent.click(mlManagerCard);

    expect(window.sm.chooseMLManager).toHaveBeenCalledWith({ ...mlManagers[3], active: true });
    expect(mlManagerCard).not.toHaveClass('cursor-pointer');
    expect(mlManagerCard.querySelector('input[name="config"]')).toBeChecked();
    expect(mlManagerCard.querySelector('button')).not.toBeInTheDocument();
  });

  it('should not call chooseMLManager function when card clicked and the clicked card is card of ml manager has been active', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers.map((mlManager) => {
      if (mlManager.name === 'Alex Ferguson') return { ...mlManager, active: true };
      return mlManager;
    }));
    const mlManagerCard = await screen.findByTestId('config-card-Alex Ferguson');

    await userEvent.click(mlManagerCard);

    expect(window.sm.chooseMLManager).not.toHaveBeenCalled();
    expect(mlManagerCard).not.toHaveClass('cursor-pointer');
    expect(mlManagerCard.querySelector('input[name="config"]')).toBeChecked();
    expect(mlManagerCard.querySelector('button')).not.toBeInTheDocument();
  });

  it('should call chooseMLManager function correctly, unactive card of ml manager has been active and activate card of ml manager choosed when it card clicked', async () => {
    window.sm.isMLManagerConfigActivated.mockResolvedValue(true);
    renderSimpleConfigurationsMLManager();
    window.sm.readMLManagers.mockResolvedValue(mlManagers.map((mlManager) => {
      if (mlManager.name === 'Alex Ferguson') return { ...mlManager, active: true };
      return mlManager;
    }));
    const mlManagerCardAlex = await screen.findByTestId('config-card-Alex Ferguson');
    const mlManagerCardBill = await screen.findByTestId('config-card-Bill Shankly');

    await userEvent.click(mlManagerCardBill);

    expect(window.sm.chooseMLManager).toHaveBeenCalledWith({ ...mlManagers[2], active: true });
    expect(mlManagerCardAlex).toHaveClass('cursor-pointer');
    expect(mlManagerCardBill).not.toHaveClass('cursor-pointer');
    expect(mlManagerCardAlex.querySelector('input[name="config"]')).not.toBeChecked();
    expect(mlManagerCardBill.querySelector('input[name="config"]')).toBeChecked();
    expect(mlManagerCardAlex.querySelector('button')).toBeInTheDocument();
    expect(mlManagerCardBill.querySelector('button')).not.toBeInTheDocument();
  });
});
