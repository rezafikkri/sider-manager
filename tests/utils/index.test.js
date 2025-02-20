import { describe, expect, it } from 'vitest';
import { generateErrorLogMessage, translate } from '../../src/main/utils';

describe('generateErrorLogMessage function', () => {
  it('should return correct error log message', () => {
    const errorLogMessage = generateErrorLogMessage('Test App', 'Test OS', 'Test Electron', 'Test Error Stack');
    expect(errorLogMessage).toBe(
      'App: Test App\n\tOS: Test OS\n\tElectron: Test Electron\n\tError: Test Error Stack',
    );
  });
});

describe('translate function', () => {
  it('should return the correct translation', () => {
    const resources = {
      id: {
        showSettingsWindowBtn: {
          title: 'Pengaturan',
        },
      },
    };
    const translation = translate('id', 'showSettingsWindowBtn.title', resources);
    expect(translation).toBe(resources.id.showSettingsWindowBtn.title);
  });
});
