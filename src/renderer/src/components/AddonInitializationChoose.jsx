import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AddonInitializationChoose({ onChoose }) {
  const {locale, resources} = useContext(LocaleContext);

  return (
    <section className="p-10 text-center rounded-lg border-4 border-d-bg-light bg-d-input-bg border-dashed mb-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="icon mb-2 text-lime-200" viewBox="0 0 16 16"><path d="M8.5 9.438V8.5h-1v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.93-.62-.4-1.598a1 1 0 0 1-.03-.243"/><path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m2.5 8.5v.938l-.4 1.599a1 1 0 0 0 .416 1.074l.93.62a1 1 0 0 0 1.109 0l.93-.62a1 1 0 0 0 .415-1.074l-.4-1.599V8.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1m1-5.5h-1v1h1v1h-1v1h1v1H9V6H8V5h1V4H8V3h1V2H8V1H6.5v1h1z"/></svg>
      <p className="mb-2">
        {translate(locale, 'addonInitializationChoose.pChooseFileText1', resources)}
        <strong> addon-initialization.zip </strong>
        {translate(locale, 'addonInitializationChoose.pChooseFileText2', resources)}
      </p>
      <button
        onClick={onChoose}
        type="button"
        className="font-medium rounded-lg text-sm px-4 py-2.5 bg-green-600 hover:bg-green-500 transition-colors duration-300 outline outline-transparent focus:outline-offset-2 focus:outline-green-600 text-d-bg"
      >
        {translate(locale, 'addonInitializationChoose.chooseFileBtnText', resources)}
      </button>
    </section>
  );
}
