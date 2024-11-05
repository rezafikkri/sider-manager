import { useContext, useState } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import AddonInitializationChoose from './AddonInitializationChoose';
import AddonInitializationFile from './AddonInitializationFile';

export default function AddonInitializationApp() {
  const {locale, resources} = useContext(LocaleContext);
  const [file, setFile] = useState(null);

  return (
    <main className="p-5">
      { file ? <AddonInitializationFile /> : <AddonInitializationChoose /> }
      <small className="mb-6 block">
        <strong>{translate(locale, 'addonInitializationApp.smallStrongText', resources)}</strong>:
        {' ' + translate(locale, 'addonInitializationApp.smallText', resources) + ' '}
        <code className="bg-indigo-950 p-1 rounded">PES 2017/backup</code>.
      </small>
      <form className="flex justify-end">
        <button
          type="button"
          className="py-2.5 px-4 me-2 font-medium rounded-lg outline outline-transparent focus:outline-offset-2 focus:outline-gray-800 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-300"
        >
          {translate(locale, 'addonInitializationApp.cancelBtnText', resources)}
        </button>
        <button
          type="submit"
          className="font-medium rounded-lg px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-300"
        >
          {translate(locale, 'addonInitializationApp.initializationBtnText', resources)}
        </button>
      </form>
    </main>
  );
}
