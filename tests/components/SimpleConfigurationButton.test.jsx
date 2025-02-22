// @vitest-environment jsdom

import { describe, vi, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import SimpleConfigurationButton from '../../src/renderer/src/components/SimpleConfigurationButton';

expect.extend(matchers);

const resources = {
  id: {
    simpleConfigBtnText: 'Simple',
  },
};

describe('SimpleConfigurationButton component', () => {
  it('should call createSimpleConfigurationsWindow function when simple config button clicked', async () => {
    window.sm = { createSimpleConfigurationsWindow: vi.fn() };
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <SimpleConfigurationButton />
      </Locale>
    );
    const simpleConfigBtn = await screen.findByRole('button');

    await userEvent.click(simpleConfigBtn);

    expect(window.sm.createSimpleConfigurationsWindow).toHaveBeenCalled();
  });
});
