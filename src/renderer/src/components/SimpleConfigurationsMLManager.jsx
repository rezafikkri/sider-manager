import { useEffect, useState, useContext, useCallback } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import ConfigCardImg from './ConfigCardImg';
import Alert from './Alert';
import ModalWithSimpleConfigForm from './ModalWithSimpleConfigForm';
import ModalPrompt from './ModalPrompt';

export default function SimpleConfigurationsMLManager() {
  const {locale, resources} = useContext(LocaleContext);

  const [status, setStatus] = useState(null);
  const [mlManagers, setMLManagers] = useState([]);
  const [hasActiveMLManager, setHasActiveMLManager] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  async function loadMLManagers() {
    const mlManagers = await window.sm.readMLManagers();
    setMLManagers(mlManagers);
  }

  function handleToggleMLManagerConfig() {
    window.sm.toggleMLManagerConfig();
    setStatus((prevStatus) => {
      const newStatus = !prevStatus;
      if (newStatus) {
        loadMLManagers();
      } else {
        setMLManagers([]);
        setHasActiveMLManager(false);
      }

      return newStatus;
    });
  }

  const handleChooseMLManager = useCallback(async (mlManager) => {
    await window.sm.chooseMLManager({ ...mlManager, active: true });

    setMLManagers((prevMLManagers) => {
      for (const prevMLManager of prevMLManagers) {
        if (prevMLManager.active) {
          setHasActiveMLManager(true);
          break;
        }
      }

      const nextMLManagers = [...prevMLManagers];
      let mlManagerChanged = 0;
      for (const [index, nextMLManager] of nextMLManagers.entries()) {
        if (nextMLManager.name === mlManager.name) {
          nextMLManagers[index] = { ...nextMLManager, active: true };
          mlManagerChanged++;
        } else if (nextMLManager.active) {
          nextMLManagers[index] = { ...nextMLManager, active: false };
          mlManagerChanged++;
        }

        if (mlManagerChanged === 2) break;
      }
      
      return nextMLManagers;
    });
    setShowSuccessAlert(true);
  }, []);

  useEffect(() => {
    // check is ml manager config is activated or not yet
    async function checkStatus() {
      const check = await window.sm.isMLManagerConfigActivated();
      setStatus(check);
      if (check) {
        loadMLManagers();
      }
    }

    checkStatus();
  }, []);

  return (
    <>
      <section className="px-3 flex mb-5 items-center">
        <div className="flex-1 me-5">
          <h1 className="font-bold text-xl mb-1">ML Manager</h1>
          <p className="text-sm opacity-80">{translate(locale, 'simpleConfigurationsMLManager.desc', resources)}</p>
        </div>
        <label
          className="inline-flex items-center cursor-pointer w-28"
          data-testid="toggle-ml-manager-config-btn"
        >
          { status !== null ? (
            <>
              <input
                type="checkbox"
                checked={status}
                onChange={handleToggleMLManagerConfig}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">{status ?
                translate(locale, 'simpleConfigurationsMLManager.statusOn', resources) :
                translate(locale, 'simpleConfigurationsMLManager.statusOff', resources)
              }</span>
            </>
          ) : null }
        </label>
      </section>

      { status !== null ? (
        <button
          data-testid="add-ml-manager-btn"
          disabled={status ? false : true}
          type="button"
          className="ms-3 text-sm font-medium rounded-lg px-3 py-2 bg-gray-800 hover:bg-indigo-700 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
          <span>{translate(locale, 'simpleConfigurationsMLManager.addMLManagerBtnText', resources)}</span>
        </button>
      ) : null}

      <section className="px-3 mt-10 grid grid-cols-3 gap-4">
        {mlManagers.map((mlManager) => 
          <ConfigCardImg
            key={mlManager.name}
            title={mlManager.name}
            img={mlManager.preview.replace('file', 'sm')}
            isChecked={mlManager.active}
            onChoose={handleChooseMLManager}
            mlManager={mlManager}
          />
        )}
      </section>

      <div className="fixed bottom-5 right-5 left-5 text-left flex flex-col gap-2 w-3/4 z-30">
        {(showSuccessAlert && !hasActiveMLManager) ? 
          <Alert
            message={() => translate(locale, 'simpleConfigurationsMLManager.successAlertMsg.choosed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        : (showSuccessAlert && hasActiveMLManager) ?
          <Alert
            message={() => translate(locale, 'simpleConfigurationsMLManager.successAlertMsg.changed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        : null}
      </div>

      <ModalWithSimpleConfigForm />
      {/* <ModalPrompt /> */}
    </>
  );
}
