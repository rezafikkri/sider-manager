import { useEffect, useId, useState, useContext } from 'react';
import PESDirectoryInput from './PESDirectoryInput';
import Alert from './Alert';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function SettingsForm() {
  const {locale, resources} = useContext(LocaleContext);
  const keyInputPESExe = useId();
  const keyInputSiderExe = useId();
  const [pesDirectory, setPESDirectory] = useState('');
  const [pesExe, setPESExe] = useState('');
  const [pesExeError, setPESExeError] = useState(null);
  const [siderExe, setSiderExe] = useState('');
  const [siderExeError, setSiderExeError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();

    // check if executable file is in the pes directory
    let error = false;
    if (!await window.sm.isPESExecutableExist(pesDirectory, pesExe)) {
      setPESExeError(translate(locale, 'settingsForm.error.pesExe', resources));
      error = true;
    }

    if (!await window.sm.isPESExecutableExist(pesDirectory, siderExe)) {
      setSiderExeError(translate(locale, 'settingsForm.error.siderExe', resources));
      error = true;
    }

    if (error) return false;

    const isSaved = await window.sm.saveSettings({
      pesDirectory: pesDirectory,
      pesExecutable: [pesExe, siderExe],
    });
    if (isSaved) {
      setPESExeError(null);
      setSiderExeError(null);
      setShowSuccessAlert(true);
    }
  }

  function handleOnChangePESExeInput(e) {
    setPESExeError(null);
    setPESExe(e.target.value);
  }

  function handleOnChangeSiderExeInput(e) {
    setSiderExeError(null);
    setSiderExe(e.target.value);
  }

  useEffect(() => {
    async function getSettings() {
      const settings = await window.sm.getSettings();
      setPESDirectory(settings.pesDirectory);
      setPESExe(settings.pesExecutable[0]);
      setSiderExe(settings.pesExecutable[1]);
    }
    getSettings();
  }, []);

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit}>
        <PESDirectoryInput
          onChange={setPESDirectory}
          value={pesDirectory}
          onChoosePESDirectory={window.sm.choosePESDirectory}
        />

        <label
          htmlFor={keyInputPESExe}
          className="inline-block font-semibold mb-3 text-white/90"
        >
          {translate(locale, 'settingsForm.pesExeLabelText', resources)}
        </label>
        <input
          type="text"
          id={keyInputPESExe}
          className={`flex-auto block w-full p-4 outline-0 bg-indigo-950 rounded-lg outline outline-[3px] focus:outline-offset-2 mb-2 ${pesExeError ? 'outline-red-700' : 'outline-transparent focus:outline-indigo-700'}`}
          name="pesExe"
          placeholder={translate(locale, 'settingsForm.pesExeInputPlaceholder', resources)}
          value={pesExe}
          onChange={handleOnChangePESExeInput}
          spellCheck="false"
        />
        <small className={`block mb-7 ${pesExeError ? 'text-red-400' : 'text-white/80'}`}>
          {pesExeError ?? translate(locale, 'settingsForm.pesExeSmallText', resources)}
        </small>

        <label
          htmlFor={keyInputSiderExe}
          className="inline-block font-semibold mb-3 text-white/90"
        >
          {translate(locale, 'settingsForm.siderExeLabelText', resources)}
        </label>
        <input
          type="text"
          id={keyInputSiderExe}
          className={`flex-auto block w-full p-4 outline-0 bg-indigo-950 rounded-lg outline outline-[3px] focus:outline-offset-2 mb-2 ${siderExeError ? 'outline-red-700' : 'outline-transparent focus:outline-indigo-700'}`}
          name="pesExe"
          placeholder={translate(locale, 'settingsForm.siderExeInputPlaceholder', resources)}
          value={siderExe}
          onChange={handleOnChangeSiderExeInput}
          spellCheck="false"
        />
        <small className={`block ${siderExeError ? 'text-red-400' : 'text-white/80'}`}>
          {siderExeError ?? translate(locale, 'settingsForm.siderExeSmallText', resources)}
        </small>

        <div className="flex justify-end mt-8">
          <button type="submit" className="font-medium rounded-lg px-4 py-3 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 shadow-lg transition-colors duration-100 ease-in">{translate(locale, 'settingsForm.submitBtnText', resources)}</button>
        </div>
      </form>
      {showSuccessAlert &&
        <div className="absolute bottom-3 right-0 left-0 text-left">
          <Alert
            message={() => translate(locale, 'settingsForm.successAlertMsg', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      }
    </div>
  );
}
