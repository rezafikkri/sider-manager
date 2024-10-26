import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AdvancedConfigurationButton() {
  const {locale, resources} = useContext(LocaleContext);

  return (
    <section>
      <div className="shadow-lg rounded-t-3xl rounded-b-2xl">
        <button className="bg-indigo-700 hover:bg-indigo-600 font-bold text-xl w-full px-3 py-4 rounded-t-3xl outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="icon me-2" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
          <span>{translate(locale, 'advancedConfigBtn.btnText', resources)}</span>
        </button>
        <small className="block bg-indigo-700/50 text-white/80 px-2 py-3 rounded-b-2xl">
          {translate(locale, 'advancedConfigBtn.smallText', resources)}
        </small>
      </div>
    </section>
  );
}
