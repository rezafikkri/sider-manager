import { useId, useState, useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import Alert from './Alert';

export default function ActivationForm({ onActivate }) {
  const keyTextAreaId = useId();
  const [key, setKey] = useState('');
  const [activateError, setActivateError] = useState(null);
  const {locale, resources} = useContext(LocaleContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // if activation key is empty
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
    } else if (activate !== false) {
      setActivateError(activate);
    } else {
      setActivateError('tryAgain');
    }
    // hide loading
    setIsLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor={keyTextAreaId} className="inline-block font-semibold mb-3 text-white/90">
          {translate(locale, 'activationForm.keyLabelText', resources)}
        </label>
        <div className="overflow-hidden rounded-lg shadow outline outline-[3px] has-[:focus]:outline-offset-2 ${activateError outline-transparent has-[:focus]:outline-indigo-700">
          <textarea
            id={keyTextAreaId}
            rows={6}
            className={`block p-4 w-full bg-indigo-950 resize-none outline-0`}
            spellCheck="false"
            name="key"
            placeholder={translate(locale, 'activationForm.keyTextareaPlaceholder', resources)}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <small className="mb-7 block mt-2 text-white/80">
          {translate(locale, 'activationForm.keySmallText', resources)}
        </small>

        <div className="flex justify-end">
          <div className="relative">
            {isLoading && 
              <div className="absolute z-20 bg-indigo-600/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
              </div>
            }
            <button
              type="submit"
              className="font-medium rounded-lg px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-300"
              disabled={isLoading}
            >
              {translate(locale, 'activationForm.submitBtnText', resources)}
            </button>
          </div>
        </div>
      </form>
      {activateError &&
        <div className="absolute bottom-28 right-0 left-4 text-left flex flex-col gap-2 w-4/5">
          <Alert
            message={() => translate(locale, `activationForm.error.${activateError}`, resources)}
            type="danger"
            onClose={() => setActivateError(null)}
          />
        </div>
      }
    </>
  );
}
