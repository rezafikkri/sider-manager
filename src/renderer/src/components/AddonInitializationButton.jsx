import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AddonInitializationButton() {
  const {locale, resources} = useContext(LocaleContext);

  function handleShowAddonInitializationWindow() {
    window.sm.createAddonInitializationWindow();
  }

  return (
    <section className="shadow-lg">
      <button
        className="bg-green-500 font-bold text-xl w-full px-3 py-4 rounded-t-3xl hover:bg-green-400 outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 transition-colors duration-100 text-d-bg"
        onClick={handleShowAddonInitializationWindow}
      >
        <svg className="icon me-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" /></svg>
        <span>{translate(locale, 'addonInitializationBtn.btnText', resources)}</span>
      </button>
      <small className="block bg-d-bg-light text-white/70 px-2 py-3 rounded-b-3xl">
        {translate(locale, 'addonInitializationBtn.smallText', resources)}
      </small>
    </section>
  );
}
