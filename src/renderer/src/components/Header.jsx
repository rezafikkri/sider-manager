import { useContext, useEffect, useState } from 'react';
import ShowSettingsWindowButton from './ShowSettingsWindowButton';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function Header({ type }) {
  const [openHelp, setOpenHelp] = useState(false);
  const {locale, toggleLocale, resources} = useContext(LocaleContext);

  useEffect(() => {
    document.body.addEventListener('click', (e) => {
      const targetEl = e.target;
      if (
        targetEl.id !== 'toggle-help' &&
        targetEl.parentElement.id !== 'toggle-help' &&
        targetEl.parentElement.parentElement.id !== 'toggle-help'
      ) {
        setOpenHelp(false);
      }
    });
  }, []);

  function handleShowAboutWindow() {
    window.sm.createAboutWindow();
  }

  return (
    <header className="flex justify-between p-4 text-white/90 relative z-20">
      <h1 className="font-bold flex-1">Sider Manager</h1>
      <nav className="flex-none text-sm">
        <button
          type="button"
          className="me-5 hover:text-white"
          title={translate(locale, 'header.toggleLocaleBtn.title', resources)}
          onClick={toggleLocale}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-1.5" viewBox="0 0 16 16">
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
          </svg>
          <span>{locale.toUpperCase()}</span>
        </button>
        <div className="inline-block relative">
          <button
            id="toggle-help"
            className="hover:text-white"
            type="button"
            title={translate(locale, 'header.toggleHelpBtn.title', resources)}
            onClick={() => setOpenHelp(openHelp => !openHelp)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="icon">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
            </svg>
          </button>
          { openHelp && 
            <ul className="absolute right-0 left-auto top-8 w-40 backdrop-blur-xl bg-white/10 py-2 rounded-md box-shadow-sima">
              <li><a className="px-3 py-1.5 block hover:bg-white/15 hover:text-white" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                </svg>
                <span>{translate(locale, 'header.helpMenu.tutorText', resources)}</span>
              </a></li>
              <li>
                <button
                  className="px-3 py-1.5 hover:bg-white/15 w-full text-left hover:text-white"
                  type="button"
                  onClick={handleShowAboutWindow}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-2" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                  </svg>
                  <span>{translate(locale, 'header.helpMenu.aboutText', resources)}</span>
                </button>
              </li>
            </ul>
          }
        </div>
        {type === 'main' && <ShowSettingsWindowButton /> }
      </nav>
    </header>
  );
}
