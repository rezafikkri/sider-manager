import { useState, useContext } from 'react';
import SimpleConfigurationsSider from './SimpleConfigurationsSider';
import SimpleConfigurationsMLManager from './SimpleConfigurationsMLManager';
import Alert from './Alert';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function SimpleConfigurationsApp() {
  const {locale, resources} = useContext(LocaleContext);
  const [config, setConfig] = useState('ml-manager');
  const [warning, setWarning] = useState('warning');

  function handleConfig(e) {
    e.preventDefault();
    const id = e.target.id;
    setConfig(id);
  }

  function activeMenu(menu) {
    return menu === config ? 'bg-indigo-950 font-medium' : 'opacity-80';
  }

  return (
    <>
      {warning &&
        <div className="fixed bottom-5 right-5 left-5 text-left z-10">
          <Alert
            message={() => translate(locale, 'simpleConfigurationsApp.warning', resources)}
            type="warning"
            onClose={() => setWarning(null)}
          />
        </div>
      }
      <header>
        <nav className="p-3 w-40 min-h-screen sticky top-0">
          <ul className="[&_a]:px-3 [&_a]:py-1.5 [&_a]:my-2 [&_a]:block [&_a]:rounded-lg text-sm [&_a]">
            <li>
              <a
                href="#"
                id="sider"
                onClick={handleConfig}
                className={`hover:bg-indigo-950 ${activeMenu('sider')}`}
              >
                Sider
              </a>
            </li>
            <li>
              <a
                href="#"
                id="ml-manager"
                onClick={handleConfig}
                className={`hover:bg-indigo-950 ${activeMenu('ml-manager')}`}
              >
                ML Manager
              </a>
            </li>
            <li>
              <a
                href="#"
                id="press-room"
                onClick={handleConfig}
                className={`hover:bg-indigo-950 ${activeMenu('press-room')}`}
              >
                Press Room
              </a>
            </li>
            <li>
              <a
                href="#"
                id="graphic-menu"
                onClick={handleConfig}
                className={`hover:bg-indigo-950 ${activeMenu('graphic-menu')}`}
              >
                Graphic Menu
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="py-5 px-3 min-h-full flex-1">
        {config === 'sider' ? <SimpleConfigurationsSider /> :
        config === 'ml-manager' ? <SimpleConfigurationsMLManager /> : null}
      </main>
    </>
  );
}
