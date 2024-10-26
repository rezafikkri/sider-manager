import { useEffect, useId, useRef, useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function PESDirectoryInput({ onChoosePESDirectory, onChange, value }) {
  const {locale, resources} = useContext(LocaleContext);
  const keyInputDirectory = useId();
  const inputRef = useRef(null);
  
  async function handleChooseDirectory() {
    const pesDirectory = await onChoosePESDirectory();

    if (pesDirectory) {
      onChange(pesDirectory);
    }
  }

  useEffect(() => {
    inputRef.current.scrollLeft = inputRef.current.scrollWidth;
  }, [value]);

  return (
    <>
      <label
        htmlFor={keyInputDirectory}
        className="inline-block font-semibold mb-3 text-white/90"
      >
        {translate(locale, 'pesDirectoryInput.directoryLabelText', resources)}
      </label>
      <div className="flex outline outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-indigo-700 rounded-lg">
        <input
          ref={inputRef}
          id={keyInputDirectory}
          type="text"
          className="flex-auto block w-full p-4 outline-0 bg-indigo-950 rounded-l-lg"
          placeholder={translate(locale, 'pesDirectoryInput.directoryInputPlaceholder', resources)}
          spellCheck="false"
          name="directory"
          onBlur={(e) => e.target.scrollLeft = e.target.scrollWidth}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
    </>
  );
}
