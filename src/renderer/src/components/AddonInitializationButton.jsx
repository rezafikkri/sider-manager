import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AddonInitializationButton() {
  const {locale, resources} = useContext(LocaleContext);

  function handleShowAddonInitializationWindow() {
    window.sm.createAddonInitializationWindow();
  }

  return (
    <section className="col-span-2 mb-4">
      <button
        className="btn shadow-lg bg-green-500 font-bold text-xl w-full px-4 py-5 rounded-2xl hover:bg-green-400 text-d-bg active:scale-[0.96]"
        onClick={handleShowAddonInitializationWindow}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="icon me-2 text-d-bg/90"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 2a3 3 0 0 1 2.995 2.824l.005 .176v1h3a2 2 0 0 1 1.995 1.85l.005 .15v3h1a3 3 0 0 1 .176 5.995l-.176 .005h-1v3a2 2 0 0 1 -1.85 1.995l-.15 .005h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-1a1 1 0 0 0 -1.993 -.117l-.007 .117v1a2 2 0 0 1 -1.85 1.995l-.15 .005h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005h1a1 1 0 0 0 .117 -1.993l-.117 -.007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005h3v-1a3 3 0 0 1 3 -3z" /></svg>
        <span>{translate(locale, 'addonInitializationBtn.btnText', resources)}</span>
      </button>
      <small className="block text-white/70 text-left text-xs flex mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9h.01" /><path d="M11 12h1v4h1" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
        <span className="flex-1">{translate(locale, 'addonInitializationBtn.smallText', resources)}</span>
      </small>
    </section>
  );
}
