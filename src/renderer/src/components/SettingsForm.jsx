import { useEffect, useId, useState, useContext, useRef } from 'react';
import Alert from './Alert';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function SettingsForm() {
  const {locale, resources} = useContext(LocaleContext);
  const keyInputPESExe = useId();
  const keyInputSiderExe = useId();
  const keyInputDirectory = useId();
  const keyInputAdvancedExe = useId();
  const [pesDirectory, setPESDirectory] = useState('');
  const [pesExe, setPESExe] = useState('');
  const [siderExe, setSiderExe] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [advancedExe, setAdvancedExe] = useState('');

  const [errors, setErrors] = useState([]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    // check if executable file is in the pes directory
    let error = false;

    if (advancedExe.trim() === '') {
      setErrors(errors => [
        ...errors,
        { id: errors.length + 1, message: translate(locale, 'advancedExeInput.error', resources) },
      ]);
      error = true;
    }

    if (!await window.sm.isPESExecutableExist(pesDirectory, pesExe)) {
      setErrors(errors => [
        ...errors,
        { id: errors.length + 1, message: translate(locale, 'settingsForm.error.pesExe', resources) },
      ]);
      error = true;
    }

    if (!await window.sm.isPESExecutableExist(pesDirectory, siderExe)) {
      setErrors(errors => [
        ...errors,
        { id: errors + 1, message: translate(locale, 'settingsForm.error.siderExe', resources) },
      ]);
      error = true;
    }

    if (error) return false;

    const isSaved = await window.sm.saveSettings({
      pesDirectory,
      pesExecutable: [pesExe, siderExe],
      advancedExe,
    });
    if (isSaved) {
      setErrors([]);
      setShowSuccessAlert(true);
    }
  }

  async function handleChooseDirectory() {
    const pesDirectory = await window.sm.choosePESDirectory();

    if (pesDirectory) {
      setPESDirectory(pesDirectory);
    }
  }

  async function handleChooseAdvancedExe() {
    const advancedExe = await window.sm.chooseAdvancedExecutable();

    if (advancedExe) {
      setAdvancedExe(advancedExe);
    }
  }

  function handleOnChangePESExeInput(e) {
    setPESExe(e.target.value);
  }

  function handleOnChangeSiderExeInput(e) {
    setSiderExe(e.target.value);
  }

  useEffect(() => {
    async function getSettings() {
      const settings = await window.sm.getSettings();
      setPESDirectory(settings.pesDirectory);
      setPESExe(settings.pesExecutable[0]);
      setSiderExe(settings.pesExecutable[1]);
      if (settings.advancedExe) setAdvancedExe(settings.advancedExe);
    }
    getSettings();
  }, []);

  const inputDirectoryRef = useRef(null);
  const advancedExeInputRef = useRef(null);
  useEffect(() => {
    if (pesDirectory !== '') {
      inputDirectoryRef.current.scrollLeft = inputDirectoryRef.current.scrollWidth;
    }
    if (advancedExe !== '') {
      advancedExeInputRef.current.scrollLeft = advancedExeInputRef.current.scrollWidth;
    }
  }, [pesDirectory, advancedExe]);

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center mb-7">
          <div className="flex-1 me-5">
            <label
              htmlFor={keyInputDirectory}
              className="inline-block font-semibold mb-2 text-white/90"
            >
              {translate(locale, 'pesDirectoryInput.directoryLabelText', resources)}
            </label>
            <small className="block text-white/80">
              {translate(locale, 'pesDirectoryInput.directorySmallText', resources)}
            </small>
          </div>
          <div className="flex outline outline-2 outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-green-700 rounded-lg w-80">
            <input
              ref={inputDirectoryRef}
              id={keyInputDirectory}
              type="text"
              className="flex-auto block w-full px-3 py-2 outline-0 bg-d-input-bg rounded-l-lg"
              placeholder={translate(locale, 'pesDirectoryInput.directoryInputPlaceholder', resources)}
              spellCheck="false"
              name="directory"
              onBlur={(e) => e.target.scrollLeft = e.target.scrollWidth}
              value={pesDirectory}
              onChange={(e) => setPESDirectory(e.target.value)}
            />
            <button
              type="button"
              className="flex-none bg-[#1B191F] hover:bg-[#1D1B22] rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
              onClick={handleChooseDirectory}
              data-testid="chooseDirectory"
            >
              {translate(locale, 'pesDirectoryInput.chooseBtnText', resources)}
            </button>
          </div>
        </div>

        <div className="flex items-center mb-7">
          <div className="flex-1 me-5">
            <label
              htmlFor={keyInputPESExe}
              className="inline-block font-semibold mb-3 text-white/90"
            >
              {translate(locale, 'settingsForm.pesExeLabelText', resources)}
            </label>
            <small className="block text-white/80">
              {translate(locale, 'settingsForm.pesExeSmallText', resources)}
            </small>
          </div>
          <input
            type="text"
            id={keyInputPESExe}
            className="block w-60 px-3 py-2 bg-d-input-bg rounded-lg outline outline-2 focus:outline-offset-2 outline-transparent focus:outline-green-700"
            name="pesExe"
            placeholder={translate(locale, 'settingsForm.pesExeInputPlaceholder', resources)}
            value={pesExe}
            onChange={handleOnChangePESExeInput}
            spellCheck="false"
          />
        </div>

        <div className="flex items-center mb-7">
          <div className="flex-1 me-5">
            <label
              htmlFor={keyInputSiderExe}
              className="inline-block font-semibold mb-3 text-white/90"
            >
              {translate(locale, 'settingsForm.siderExeLabelText', resources)}
            </label>
            <small className='block text-white/80'>
              {translate(locale, 'settingsForm.siderExeSmallText', resources)}
            </small>
          </div>
          <input
            type="text"
            id={keyInputSiderExe}
            className="block w-60 px-3 py-2 bg-d-input-bg rounded-lg outline outline-2 focus:outline-offset-2 mb-2 outline-transparent focus:outline-green-700"
            name="pesExe"
            placeholder={translate(locale, 'settingsForm.siderExeInputPlaceholder', resources)}
            value={siderExe}
            onChange={handleOnChangeSiderExeInput}
            spellCheck="false"
          />
        </div>

        <div className="flex items-center mb-7">
          <div className="flex-1 me-5">
            <label
              htmlFor={keyInputAdvancedExe}
              className="inline-block font-semibold mb-2 text-white/90"
            >
              {translate(locale, 'advancedExeInput.labelText', resources)}
            </label>
            <small className="block text-white/80">
              {translate(locale, 'advancedExeInput.smallText', resources)}
            </small>
          </div>
          <div className="flex outline outline-2 outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-green-700 rounded-lg w-80">
            <input
              ref={advancedExeInputRef}
              id={keyInputAdvancedExe}
              type="text"
              className="flex-auto block w-full px-3 py-2 outline-0 bg-d-input-bg rounded-l-lg"
              placeholder={translate(locale, 'advancedExeInput.inputPlaceholder', resources)}
              spellCheck="false"
              name="advancedExe"
              onBlur={(e) => e.target.scrollLeft = e.target.scrollWidth}
              value={advancedExe}
              onChange={(e) => setAdvancedExe(e.target.value)}
            />
            <button
              type="button"
              className="flex-none bg-[#1B191F] hover:bg-[#1D1B22] rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
              onClick={handleChooseAdvancedExe}
              data-testid="chooseFile"
            >
              {translate(locale, 'advancedExeInput.chooseBtnText', resources)}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button type="submit" className="btn active:scale-[0.96] font-medium rounded-lg px-4 py-3 bg-green-500 hover:bg-green-400 shadow-lg text-d-bg">{translate(locale, 'settingsForm.submitBtnText', resources)}</button>
        </div>
      </form>
      {(showSuccessAlert || errors.length > 0) ?
      <div className="absolute bottom-0 right-0 left-0 text-left flex flex-col gap-2 w-3/4">
        {showSuccessAlert ?
          <Alert
            message={() => translate(locale, 'settingsForm.successAlertMsg', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        : errors.map(error =>
          <Alert
            key={error.id}
            message={() => error.message}
            type="danger"
            onClose={() => setErrors(errors => errors.filter(nowError => nowError.id !== error.id))}
          />
        )}
      </div>
      : null}
    </div>
  );
}
