import { useState, useContext, useId, useRef, useEffect } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function PESDirectoryForm() {
  const {locale, resources} = useContext(LocaleContext);
  const [pesDirectory, setPESDirectory] = useState('');

  const keyInputDirectory = useId();
  const inputDirectoryRef = useRef(null);
  
  async function handleChooseDirectory() {
    const pesDirectory = await window.sm.choosePESDirectory();

    if (pesDirectory) {
      setPESDirectory(pesDirectory);
    }
  }

  useEffect(() => {
    inputDirectoryRef.current.scrollLeft = inputDirectoryRef.current.scrollWidth;
  }, [pesDirectory]);


  function handleSubmit(e) {
    e.preventDefault();

    // if directory is empty
    if (pesDirectory.trim() === '') return false;

    window.sm.initializeSettings(pesDirectory);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7">
      <label
        htmlFor={keyInputDirectory}
        className="inline-block font-semibold mb-3 text-white/90"
      >
        {translate(locale, 'pesDirectoryInput.directoryLabelText', resources)}
      </label>
      <div className="flex outline outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-indigo-700 rounded-lg">
        <input
          ref={inputDirectoryRef}
          id={keyInputDirectory}
          type="text"
          className="flex-auto block w-full p-4 outline-0 bg-indigo-950 rounded-l-lg"
          placeholder={translate(locale, 'pesDirectoryInput.directoryInputPlaceholder', resources)}
          spellCheck="false"
          name="directory"
          onBlur={(e) => e.target.scrollLeft = e.target.scrollWidth}
          value={pesDirectory}
          onChange={(e) => setPESDirectory(e.target.value)}
        />
        <button
          type="button"
          className="flex-none bg-[#24215D] hover:bg-[#2B286F] rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
          onClick={handleChooseDirectory}
        >
          {translate(locale, 'pesDirectoryInput.chooseBtnText', resources)}
        </button>
      </div>
      <small className="block mt-2 mb-7 text-white/80">
        {translate(locale, 'pesDirectoryInput.directorySmallText', resources)}
      </small>

      <div className="flex justify-end">
        <button type="submit" className="font-medium rounded-lg px-4 py-3 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 shadow-lg transition-colors duration-100 ease-in">
          {translate(locale, 'pesDirectoryForm.submitBtnText', resources)}
        </button>
      </div>
    </form>
  );
}
