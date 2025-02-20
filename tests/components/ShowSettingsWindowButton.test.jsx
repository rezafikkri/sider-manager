// @vitest-environment jsdom

import { describe, vi, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import ShowSettingsWindowButton from '../../src/renderer/src/components/ShowSettingsWindowButton';
import Locale from '../../src/renderer/src/components/Locale';

expect.extend(matchers);

const resources = {
  id: {
    showSettingsWindowBtn: {
      title: 'Pengaturan',
    },
  },
};

describe('ShowSettingsWindowButton component', () => {
  it('should call createSettingsWindow function when settings button clicked', async () => {
    window.sm = { createSettingsWindow: vi.fn() };
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <ShowSettingsWindowButton />
      </Locale>
    );
    const settingsButton = await screen.findByRole('button');

    await userEvent.click(settingsButton);

    expect(window.sm.createSettingsWindow).toHaveBeenCalled();
  });
});

