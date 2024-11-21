import { useContext, useState } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import AddonInitializationChoose from './AddonInitializationChoose';
import AddonInitializationFile from './AddonInitializationFile';

export default function AddonInitializationApp() {
  const {locale, resources} = useContext(LocaleContext);
  const [initializationFile, setInitializationFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleChooseFile() {
    const newFile = await window.sm.chooseInitializationFile();

    if (newFile) {
      setInitializationFile(newFile);
    }
  }

  function handleRemoveFile() {
    setInitializationFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (initializationFile === null) return false;

    // show loading
    setIsLoading(true);

    await window.sm.addonInitialization(initializationFile.fileName, initializationFile.filePath);

    // hide loading
    setIsLoading(false);
  }

  return (
    <main className="p-5">
      { initializationFile ?
        <AddonInitializationFile {...initializationFile} onRemove={handleRemoveFile} /> :
        <AddonInitializationChoose onChoose={handleChooseFile} />
      }
      <small className="mb-6 block">
        <strong>{translate(locale, 'addonInitializationApp.smallStrongText', resources)}</strong>:
        {' ' + translate(locale, 'addonInitializationApp.smallText', resources) + ' '}
        <code className="bg-indigo-950 p-1 rounded">PES 2017/backup</code>.
      </small>
      <form className="flex justify-end" onSubmit={handleSubmit}>
        <div className="relative">
          {isLoading && 
            <div className="absolute z-20 bg-indigo-600/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center">
              <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin" data-testid="loading"/>
            </div>
          }
          <button
            type="submit"
            className="font-medium rounded-lg px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-300"
          >
            {translate(locale, 'addonInitializationApp.initializationBtnText', resources)}
          </button>
        </div>
      </form>
    </main>
  );
}
