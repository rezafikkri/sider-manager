import { useState } from 'react';
import SimpleConfigurationsSider from './SimpleConfigurationsSider';
import SimpleConfigurationsMLManager from './SimpleConfigurationsMLManager';

export default function SimpleConfigurationsApp() {
  const [config, setConfig] = useState('ml-manager');

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
