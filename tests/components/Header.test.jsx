// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers'
import { beforeAll, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import Header from '../../src/renderer/src/components/Header';

expect.extend(matchers);

const resources = {
  id: {
    header: {
      toggleLocaleBtn: {
        title: 'Ubah bahasa ke bahasa Inggris',
      },
      toggleHelpBtn: {
        title: 'Bantuan',
      },
    },
  },

  en: {
    header: {
      toggleLocaleBtn: {
        title: 'Change language to Indonesian',
      },
      toggleHelpBtn: {
        title: 'Help',
      },
    },
  },
};

describe('Header component', () => {
  beforeAll(() => {
    window.sm = { windowName: 'main' };
  });

  it('Should translate correctly', async () => {
    render(
      <Locale
        getResources={async () => resources}
        getSettings={async () => ({locale: 'id'})}
        saveSettings={async () => {}}
      >
        <Header type="test" />
      </Locale>
    );
    // for check first translate when open the app
    let toggleHelpBtnId = await screen.findByTitle(resources.id.header.toggleHelpBtn.title);
    expect(toggleHelpBtnId).toBeInTheDocument();

    // for check translate when toggle to english
    const toggleToEnBtn = screen.getByTitle(resources.id.header.toggleLocaleBtn.title);
    await userEvent.click(toggleToEnBtn);

    toggleHelpBtnId = screen.queryByTitle(resources.id.header.toggleHelpBtn.title);
    let toggleHelpBtnEn = screen.queryByTitle(resources.en.header.toggleHelpBtn.title);
    expect(toggleHelpBtnId).not.toBeInTheDocument();
    expect(toggleHelpBtnEn).toBeInTheDocument();

    // for check translate when toggle back to indonesian
    const toggleToIdBtn = screen.getByTitle(resources.en.header.toggleLocaleBtn.title);
    await userEvent.click(toggleToIdBtn);

    toggleHelpBtnEn = screen.queryByTitle(resources.en.header.toggleHelpBtn.title);
    toggleHelpBtnId = screen.queryByTitle(resources.id.header.toggleHelpBtn.title);
    expect(toggleHelpBtnEn).not.toBeInTheDocument();
    expect(toggleHelpBtnId).toBeInTheDocument();
  });
});
