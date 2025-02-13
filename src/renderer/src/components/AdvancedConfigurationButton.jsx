import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AdvancedConfigurationButton() {
  const {locale, resources} = useContext(LocaleContext);

  return (
    <section className="shadow-lg">
      <button className="bg-green-500 hover:bg-green-400 font-bold text-xl w-full px-3 py-4 rounded-t-3xl outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 transition-colors duration-100 text-d-bg flex justify-center items-center">
        <svg className="icon me-2" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
        <span>{translate(locale, 'advancedConfigBtn.btnText', resources)}</span>
      </button>
      <small className="block bg-d-bg-light text-white/70 px-2 py-3 rounded-b-3xl">
        {translate(locale, 'advancedConfigBtn.smallText', resources)}
      </small>
    </section>
  );
}
