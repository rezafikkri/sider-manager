import { useContext, useEffect, useState } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import AddonInitializationChoose from './AddonInitializationChoose';
import AddonInitializationFile from './AddonInitializationFile';
import Alert from './Alert';

export default function AddonInitializationApp() {
  const {locale, resources} = useContext(LocaleContext);
  const [initializationFile, setInitializationFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [backupPath, setBackupPath] = useState('');

  async function handleChooseFile() {
    const newFile = await window.sm.chooseInitializationFile();

    if (newFile) {
      setInitializationFile(newFile);
    }
  }

  function handleRemoveFile() {
    if (isLoading) return false;
    setInitializationFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (initializationFile === null) return false;

    // show loading
    setIsLoading(true);

    const isInitialized = await window.sm.addonInitialization(initializationFile.filePath);
    if (isInitialized) {
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }
    // hide loading
    setIsLoading(false);
  }

  useEffect(() => {
    async function getBackupPath() {
      const backupPath = await window.sm.getBackupPath();
      setBackupPath(backupPath);
    }
    getBackupPath();
  }, []);

  return (
    <main className="p-5 h-screen">
    <div className="relative h-full">
      { initializationFile ?
        <AddonInitializationFile {...initializationFile} onRemove={handleRemoveFile} isLoading={isLoading} /> :
        <AddonInitializationChoose onChoose={handleChooseFile} />
      }
      <small className="mb-6 block">
        <span dangerouslySetInnerHTML={{
            __html: translate(locale, 'addonInitializationApp.smallText', resources)
        }} />
        <code className="bg-d-alert-bg p-1 rounded text-nowrap">{backupPath}</code>.
      </small>
      <form className="flex justify-end" onSubmit={handleSubmit}>
        <div className="relative">
          {isLoading &&
            <div className="absolute z-20 bg-green-500/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center">
              <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin" data-testid="loading"/>
            </div>
          }
          <button
            data-testid="initialization"
            type="submit"
            className="font-medium rounded-lg px-4 py-2.5 bg-green-500 hover:bg-green-400 transition-all duration-[0.3s] active:scale-[0.96] text-d-bg"
          >
            {translate(locale, 'addonInitializationApp.initializationBtnText', resources)}
          </button>
        </div>
      </form>
      {(showSuccessAlert || showErrorAlert) &&
        <div className="absolute bottom-10 right-0 left-0 text-left flex flex-col gap-2 w-full">
          {showSuccessAlert ?
            <Alert
              message={() => translate(locale, 'addonInitializationApp.successAlertMsg', resources)}
              type="success"
              onClose={() => setShowSuccessAlert(false)}
            />
          : showErrorAlert &&
            <Alert
              message={() => translate(locale, 'addonInitializationApp.errorAlertMsg', resources)}
              type="danger"
              onClose={() => setShowErrorAlert(false)}
            />
          }
        </div>
      }
    </div>
    </main>
  );
}
