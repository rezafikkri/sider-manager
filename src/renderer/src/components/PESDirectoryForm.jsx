import { useState, useContext, useId, useRef, useEffect } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function PESDirectoryForm() {
  const {locale, resources} = useContext(LocaleContext);
  const [pesDirectory, setPESDirectory] = useState('');

  const keyInputDirectory = useId();
  const inputDirectoryRef = useRef(null);

  useEffect(() => {
    inputDirectoryRef.current.scrollLeft = inputDirectoryRef.current.scrollWidth;
  }, [pesDirectory]);

  async function handleChooseDirectory() {
    const pesDirectory = await window.sm.choosePESDirectory();

    if (pesDirectory) {
      setPESDirectory(pesDirectory);
    }
  }

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
      <div className="flex outline outline-2 outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-green-700 rounded-lg">
        <input
          ref={inputDirectoryRef}
          id={keyInputDirectory}
          type="text"
          className="flex-auto block w-full p-4 outline-0 bg-d-input-bg rounded-l-lg"
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
        >
          {translate(locale, 'pesDirectoryInput.chooseBtnText', resources)}
        </button>
      </div>
      <small className="block text-white/70 flex mt-2 mb-7">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9h.01" /><path d="M11 12h1v4h1" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
        <span className="flex-1">{translate(locale, 'pesDirectoryInput.directorySmallText', resources)}</span>
      </small>

      <div className="flex justify-end">
        <button type="submit" className="btn active:scale-[0.96] font-medium rounded-lg px-4 py-3 bg-green-500 hover:bg-green-400 shadow-lg text-d-bg">
          {translate(locale, 'pesDirectoryForm.submitBtnText', resources)}
        </button>
      </div>
    </form>
  );
}
