import { useState, useContext } from 'react';
import PESDirectoryInput from './PESDirectoryInput';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function PESDirectoryForm() {
  const {locale, resources} = useContext(LocaleContext);
  const [pesDirectory, setPESDirectory] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    // if directory is empty
    if (pesDirectory.trim() === '') return false;

    window.sm.initializeSettings(pesDirectory);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7">
      <PESDirectoryInput
        value={pesDirectory}
        onChange={setPESDirectory}
        onChoosePESDirectory={window.sm.choosePESDirectory}
      />
      <div className="flex justify-end">
        <button type="submit" className="font-medium rounded-lg px-4 py-3 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 shadow-lg transition-colors duration-100 ease-in">
          {translate(locale, 'pesDirectoryForm.submitBtnText', resources)}
        </button>
      </div>
    </form>
  );
}
