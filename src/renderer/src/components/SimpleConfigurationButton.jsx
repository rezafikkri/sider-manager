import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function SimpleConfigurationButton() {
  const {locale, resources} = useContext(LocaleContext);

  function handleShowSimpleConfigurationsWindow() {
    window.sm.createSimpleConfigurationsWindow();
  }

  return (
    <section className="shadow-lg rounded-2xl flex-1 me-1.5">
      <button
        className="bg-green-500 hover:bg-green-400 font-bold text-xl w-full px-4 py-5 rounded-2xl transition-all duration-[0.3s] active:scale-[0.96] text-d-bg"
        onClick={handleShowSimpleConfigurationsWindow}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" className="icon me-2 text-d-bg/90"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg>
        <span>{translate(locale, 'simpleConfigBtnText', resources)}</span>
      </button>
    </section>
  );
}
