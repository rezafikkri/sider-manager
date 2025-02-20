// @vitest-environment jsdom

import { describe, vi, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import AddonInitializationButton from '../../src/renderer/src/components/AddonInitializationButton';

expect.extend(matchers);

const resources = {
  id: {
    addonInitializationBtn: {
      btnText: 'Inisialisasi Addon',
      smallText: 'Menginisialisasi Addon/Mod kamu dengan mudah',
    },
  },
};

describe('AddonInitializationButton component', () => {
  it('should call createAddonInitializationWindow function when addon initialization btn clicked', async () => {
    window.sm = { createAddonInitializationWindow: vi.fn() };
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <AddonInitializationButton />
      </Locale>
    );
    const addonInitializationBtn = await screen.findByRole('button');

    await userEvent.click(addonInitializationBtn);

    expect(window.sm.createAddonInitializationWindow).toHaveBeenCalled();
  });
});
