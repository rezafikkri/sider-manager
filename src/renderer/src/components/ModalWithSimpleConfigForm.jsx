import { useEffect, useId, useContext, useState, useRef } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import Alert from './Alert';

export default function ModalWithSimpleConfigForm({
  onClose,
  onSubmit,
  getPreview,
}) {
  const keyInputName = useId();
  const keyInputDirectory = useId();
  const inputDirectoryRef = useRef(null);
  const {locale, resources} = useContext(LocaleContext);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [directory, setDirectory] = useState('');
  const [preview, setPreview] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  async function handleChooseNewSimpleConfigDirectory() {
    const title = translate(locale, 'modalWithSimpleConfigForm.dialogTitle', resources);
    const directoryObj = await window.sm.chooseNewSimpleConfigDirectory(title);
    if (directoryObj) {
      setName(directoryObj.name);
      setDirectory(directoryObj.directory);
      setPreview(directoryObj.preview);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (name.trim() === '' || directory.trim() === '') return false;

    setIsLoading(true);

    const isAdded = await onSubmit(name, directory);
    if (isAdded) {
      setShowSuccessAlert(true);

      // reset form
      setName('');
      setDirectory('');
      setPreview(null);
    } else {
      setShowErrorAlert(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    inputDirectoryRef.current.scrollLeft = inputDirectoryRef.current.scrollWidth;
  }, [directory]);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center overflow-auto">
        <div className="relative h-fit w-2/5 m-10 bg-indigo-950 rounded-lg shadow px-5 py-6">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-0 right-0 text-white/60 bg-sima-bg/50 hover:text-white/90 rounded-es-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-7">
              <label
                htmlFor={keyInputDirectory}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                {translate(locale, 'modalWithSimpleConfigForm.directoryLabelText', resources)}
              </label>
              <div className="flex outline outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-indigo-700 rounded-lg">
                <input
                  ref={inputDirectoryRef}
                  id={keyInputDirectory}
                  type="text"
                  className="flex-auto block w-full p-4 outline-0 bg-indigo-900/40 rounded-l-lg"
                  placeholder={translate(locale, 'modalWithSimpleConfigForm.directoryInputPlaceholder', resources)}
                  spellCheck="false"
                  name="directory"
                  value={directory}
                  readOnly
                />
                <button
                  type="button"
                  className="flex-none bg-indigo-900/70 hover:bg-indigo-900/90 rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
                  onClick={handleChooseNewSimpleConfigDirectory}
                  data-testid="choose-directory-btn"
                >
                  {translate(locale, 'modalWithSimpleConfigForm.directoryBtnText', resources)}
                </button>
              </div>
              <small className="block mt-2 mb-7 text-white/80">
                {translate(locale, 'modalWithSimpleConfigForm.directorySmallText', resources)}
              </small>
            </div>

            <div className="mb-7">
              <label
                htmlFor={keyInputName}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                {translate(locale, 'modalWithSimpleConfigForm.nameLabelText', resources)}
              </label>
              <input
                type="text"
                name="manager-name"
                id={keyInputName}
                className="block w-full p-4 outline-0 bg-indigo-900/40 rounded-lg outline outline-[3px] focus:outline-offset-2 mb-2 outline-transparent focus:outline-indigo-700"
                placeholder={translate(locale, 'modalWithSimpleConfigForm.nameInputPlaceholder', resources)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="mb-9">
              <label className="inline-block font-semibold mb-2 text-white/90">Preview</label>
              <small className="block mb-3.5 text-white/80">
                {translate(locale, 'modalWithSimpleConfigForm.previewSmallText', resources)}
              </small>
              <img
                className="border border-gray-800 rounded-lg"
                src={getPreview(preview)}
                alt={name}
              />
            </div>

            <div className="flex justify-end items-center">
              <div className="relative">
                {isLoading && 
                  <div className="absolute z-20 bg-indigo-600/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                    <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
                  </div>
                }

                <button type="submit" data-testid="submit-btn" className="font-medium rounded-lg px-4 py-3 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 shadow-lg transition-colors duration-100 ease-in">{translate(locale, 'modalWithSimpleConfigForm.submitBtnText', resources)}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-sima-bg/80 fixed inset-0 z-40"></div>

      {showSuccessAlert &&
        <div className="fixed bottom-5 right-8 left-5 text-left w-3/5 z-50">
          <Alert
            message={() => translate(locale, 'modalWithSimpleConfigForm.successAlertMsg', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      }
      {showErrorAlert &&
        <div className="fixed bottom-5 right-8 left-5 text-left z-50">
          <Alert
            message={() => translate(locale, 'modalWithSimpleConfigForm.errorAlertMsg', resources)}
            type="danger"
            onClose={() => setShowErrorAlert(false)}
          />
        </div>
      }
    </>
  );
}
