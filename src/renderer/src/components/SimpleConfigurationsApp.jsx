import { useState, useContext } from 'react';
import SimpleConfigurationsSider from './SimpleConfigurationsSider';
import SimpleConfigurationsMLManager from './SimpleConfigurationsMLManager';
import Alert from './Alert';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import SimpleConfigurationsGraphicsMenu from './SimpleConfigurationsGraphicsMenu';
import SimpleConfigurationsPressRoom from './SimpleConfigurationsPressRoom';

export default function SimpleConfigurationsApp() {
  const {locale, resources} = useContext(LocaleContext);
  const [config, setConfig] = useState('sider');
  const [warning, setWarning] = useState('warning');

  function handleConfig(e) {
    e.preventDefault();
    const id = e.target.id;
    setConfig(id);
  }

  function activeMenu(menu) {
    return menu === config ?
      'bg-d-alert-bg-hover hover:bg-d-alert-bg-hover font-medium' :
      'opacity-80 hover:bg-d-alert-bg';
  }

  return (
    <>
      {warning &&
        <div className="fixed bottom-5 right-5 left-5 text-left z-30">
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
                className={activeMenu('sider')}
              >
                Sider
              </a>
            </li>
            <li>
              <a
                href="#"
                id="ml-manager"
                onClick={handleConfig}
                className={activeMenu('ml-manager')}
              >
                ML Manager
              </a>
            </li>
            <li>
              <a
                href="#"
                id="press-room"
                onClick={handleConfig}
                className={activeMenu('press-room')}
              >
                Press Room
              </a>
            </li>
            <li>
              <a
                href="#"
                id="graphics-menu"
                onClick={handleConfig}
                className={activeMenu('graphics-menu')}
              >
                Graphics Menu
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="py-5 px-3 min-h-full flex-1">
        {config === 'sider' ? <SimpleConfigurationsSider /> :
        config === 'ml-manager' ? <SimpleConfigurationsMLManager /> :
        config === 'press-room' ? <SimpleConfigurationsPressRoom /> :
        config === 'graphics-menu' ? <SimpleConfigurationsGraphicsMenu /> : null}
      </main>
    </>
  );
}
