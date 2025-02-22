import { useId, useState, useContext, useEffect } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import Alert from './Alert';

export default function ActivationForm({ onActivate }) {
  const keyTextAreaId = useId();
  const [key, setKey] = useState('');
  const [activateError, setActivateError] = useState(null);
  const [mustUpgradeError, setMustUpgradeError] = useState(null);
  const {locale, resources} = useContext(LocaleContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // if license key is empty
    if (key.trim() === '') return false;

    // show loading
    setIsLoading(true);

    const activate = await window.sm.activate(key);
    if (activate === true) {
      // set step inilialization
      const isPESDirectorySetup = await window.sm.isPESDirectorySetup();
      if (isPESDirectorySetup) {
        await window.sm.initializeMainWindow();
      } else {
        onActivate('choose-pes-folder');
      }
    } else if (activate === 'mustUpgradeLicenseKey') {
      setActivateError('mustUpgradeLicenseKeyForm');
    } else if (activate !== false) {
      setActivateError(activate);
    } else {
      setActivateError('tryAgain');
    }
    // hide loading
    setIsLoading(false);
  }

  useEffect(() => {
    async function checkLicenseKeyStatus() {
      const licenseKeyStatus = await window.sm.checkLicenseKeyHasBeenUsed();
      if (licenseKeyStatus !== true && licenseKeyStatus !== false) {
        setMustUpgradeError(licenseKeyStatus);
      }
    }
    checkLicenseKeyStatus();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor={keyTextAreaId} className="inline-block font-semibold mb-3 text-white/90">
          {translate(locale, 'activationForm.keyLabelText', resources)}
        </label>
        <div className="overflow-hidden rounded-lg shadow outline outline-2 has-[:focus]:outline-offset-2 ${activateError outline-transparent has-[:focus]:outline-green-600">
          <textarea
            id={keyTextAreaId}
            rows={6}
            className={`block p-4 w-full bg-d-input-bg resize-none outline-0 text-white`}
            spellCheck="false"
            name="key"
            placeholder={translate(locale, 'activationForm.keyTextareaPlaceholder', resources)}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <small className="block text-white/70 flex mt-2 mb-7">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9h.01" /><path d="M11 12h1v4h1" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
          <span
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: translate(locale, 'activationForm.keySmallText', resources) }}
          />
        </small>

        <div className="flex justify-end">
          <div className="relative">
            {isLoading &&
              <div className="absolute z-20 bg-green-500/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
              </div>
            }
            <button
              type="submit"
              className="btn active:not-disabled:scale-[0.96] font-medium rounded-lg px-4 py-2.5 bg-green-500 hover:not-disabled:bg-green-400 text-d-bg disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {translate(locale, 'activationForm.submitBtnText', resources)}
            </button>
          </div>
        </div>
      </form>
      <div className="absolute bottom-28 right-4 left-4 text-left flex flex-col gap-2">
        {activateError &&
          <Alert
            message={() => translate(locale, `activationForm.error.${activateError}`, resources)}
            type="danger"
            onClose={() => setActivateError(null)}
          />
        }
        {mustUpgradeError &&
          <Alert
            message={() => translate(locale, `activationForm.error.${mustUpgradeError}`, resources)}
            type="warning"
            onClose={() => setMustUpgradeError(null)}
          />
        }
      </div>
    </>
  );
}
