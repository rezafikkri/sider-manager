import { useEffect, useId, useContext, useState, useRef } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import Alert from './Alert';

export default function ModalWithSimpleConfigForm({
  category,
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
    const title = translate(locale, 'modalWithSimpleConfigForm.dialogTitle', resources, category);
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

  let errorAlertMsg;
  if (showErrorAlert && category !== 'ML Manager') {
    errorAlertMsg = translate(locale, 'modalWithSimpleConfigForm.errorAlertMsgWithoutCpk', resources, category);
  } else if (showErrorAlert) {
    errorAlertMsg = translate(locale, 'modalWithSimpleConfigForm.errorAlertMsgWithCpk', resources, category);
  }

  useEffect(() => {
    inputDirectoryRef.current.scrollLeft = inputDirectoryRef.current.scrollWidth;
  }, [directory]);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center overflow-auto">
        <div className="relative h-fit w-2/5 m-10 bg-d-bg-light rounded-lg shadow px-5 py-6">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-0 right-0 text-white/60 bg-d-alert-bg hover:text-white/90 rounded-es-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-7">
              <label
                htmlFor={keyInputDirectory}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                {translate(locale, 'modalWithSimpleConfigForm.directoryLabelText', resources, category)}
              </label>
              <div className="flex outline outline-2 outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-green-700 rounded-lg">
                <input
                  ref={inputDirectoryRef}
                  id={keyInputDirectory}
                  type="text"
                  className="flex-auto block w-full p-4 outline-0 bg-d-input-bg-light rounded-l-lg"
                  placeholder={translate(locale, 'modalWithSimpleConfigForm.directoryInputPlaceholder', resources, category)}
                  spellCheck="false"
                  name="directory"
                  value={directory}
                  readOnly
                />
                <button
                  type="button"
                  className="flex-none bg-[#2A2731] hover:bg-[#2E2A35] rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
                  onClick={handleChooseNewSimpleConfigDirectory}
                  data-testid="choose-directory-btn"
                >
                  {translate(locale, 'modalWithSimpleConfigForm.directoryBtnText', resources, category)}
                </button>
              </div>
              <small className="block mt-2 mb-7 text-white/80">
                {translate(locale, 'modalWithSimpleConfigForm.directorySmallText', resources, category)}
              </small>
            </div>

            <div className="mb-7">
              <label
                htmlFor={keyInputName}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                {translate(locale, 'modalWithSimpleConfigForm.nameLabelText', resources, category)}
              </label>
              <input
                type="text"
                name="manager-name"
                id={keyInputName}
                className="block w-full p-4 outline-0 bg-d-input-bg-light rounded-lg outline outline-[3px] focus:outline-offset-2 mb-2 outline-transparent focus:outline-green-700"
                placeholder={translate(locale, 'modalWithSimpleConfigForm.nameInputPlaceholder', resources, category)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="mb-9">
              <label className="inline-block font-semibold mb-2 text-white/90">Preview</label>
              <small
                className="block mb-3.5 text-white/80"
                dangerouslySetInnerHTML={{ __html: translate(locale, 'modalWithSimpleConfigForm.previewSmallText', resources, category) }}
              />
              <img
                className="border border-gray-800 rounded-lg"
                src={getPreview(preview)}
                alt={name}
              />
            </div>

            <div className="flex justify-end items-center">
              <div className="relative">
                {isLoading && 
                  <div className="absolute z-20 bg-green-500/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                    <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
                  </div>
                }

                <button type="submit" data-testid="submit-btn" className="font-medium rounded-lg px-4 py-3 bg-green-500 hover:bg-green-400 outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 shadow-lg transition-colors duration-100 ease-in text-d-bg">{translate(locale, 'modalWithSimpleConfigForm.submitBtnText', resources, category)}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-d-bg/80 fixed inset-0 z-40"></div>

      {showSuccessAlert &&
        <div className="fixed bottom-5 right-8 left-5 text-left w-3/5 z-50" data-testid="modal-with-simple-config-form-success-alert">
          <Alert
            message={() => translate(locale, 'modalWithSimpleConfigForm.successAlertMsg', resources, category)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      }
      {showErrorAlert &&
        <div className="fixed bottom-5 right-8 left-5 text-left z-50" data-testid="modal-with-simple-config-form-error-alert">
          <Alert
            message={() => errorAlertMsg}
            type="danger"
            onClose={() => setShowErrorAlert(false)}
          />
        </div>
      }
    </>
  );
}
