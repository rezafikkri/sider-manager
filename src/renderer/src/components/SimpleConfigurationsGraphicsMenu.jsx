import { useEffect, useState, useContext, useCallback } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import ConfigCardImg from './ConfigCardImg';
import Alert from './Alert';
import ModalWithSimpleConfigForm from './ModalWithSimpleConfigForm';
import notFoundImage from '../assets/not-found-image.svg';
import ModalPrompt from './ModalPrompt';

export default function SimpleConfigurationsGraphicsMenu() {
  const {locale, resources} = useContext(LocaleContext);

  const [status, setStatus] = useState(null);
  const [graphicsMenu, setGraphicsMenu] = useState([]);
  const [hasActiveGraphicMenu, setHasActiveGraphicMenu] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showModalWithSimpleConfigForm, setShowModalWithSimpleConfigForm] = useState(false);
  const [graphicMenuNameToBeDeleted, setGraphicMenuNameToBeDeleted] = useState(null);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  async function loadGraphicsMenu() {
    const graphicsMenu = await window.sm.readGraphicsMenu();
    setGraphicsMenu(graphicsMenu);
  }

  function handleToggleGraphicsMenuConfig() {
    window.sm.toggleGraphicsMenuConfig();
    setStatus((prevStatus) => {
      const newStatus = !prevStatus;
      if (newStatus) {
        loadGraphicsMenu();
      } else {
        setGraphicsMenu([]);
        setHasActiveGraphicMenu(false);
      }

      return newStatus;
    });
  }

  const handleChooseGraphicMenu = useCallback(async (graphicMenu) => {
    await window.sm.chooseGraphicMenu({ ...graphicMenu, active: true });

    setGraphicsMenu((prevGraphicsMenu) => {
      for (const prevGraphicMenu of prevGraphicsMenu) {
        if (prevGraphicMenu.active) {
          setHasActiveGraphicMenu(true);
          break;
        }
      }

      const nextGraphicsMenu = [...prevGraphicsMenu];
      let graphicMenuChanged = 0;
      for (const [index, nextGraphicMenu] of nextGraphicsMenu.entries()) {
        if (nextGraphicMenu.name === graphicMenu.name) {
          nextGraphicsMenu[index] = { ...nextGraphicMenu, active: true };
          graphicMenuChanged++;
        } else if (nextGraphicMenu.active) {
          nextGraphicsMenu[index] = { ...nextGraphicMenu, active: false };
          graphicMenuChanged++;
        }

        if (graphicMenuChanged === 2) break;
      }
      
      return nextGraphicsMenu;
    });
    setShowSuccessAlert(true);
  }, []);

  async function handleAddGraphicMenu(name, directory) {
    const graphicMenu = await window.sm.saveGraphicMenu(name, directory);
    if (graphicMenu) {
      setGraphicsMenu([ ...graphicsMenu, graphicMenu ]);
      return true;
    }
    return false;
  }

  async function handleDeleteGraphicMenu(name) {
    await window.sm.deleteGraphicMenu(name);
    setGraphicsMenu(graphicsMenu.filter((graphicMenu) => 
      graphicMenu.name !== name
    ));
  }

  function getGraphicMenuPreview(preview) {
    if (preview) return preview.replace('file', 'sm');
    return notFoundImage;    
  }

  function showModalAdd() {
    setShowModalWithSimpleConfigForm(true);
    document.querySelector('body').classList.add('overflow-hidden');
  }

  function closeModalAdd() {
    setShowModalWithSimpleConfigForm(false);
    document.querySelector('body').classList.remove('overflow-hidden');
  }

  const showModalDelete = useCallback((name) => {
    setGraphicMenuNameToBeDeleted(name);
    document.querySelector('body').classList.add('overflow-hidden');
  }, []);

  function closeModalDelete() {
    setGraphicMenuNameToBeDeleted(null);
    document.querySelector('body').classList.remove('overflow-hidden');
  }

  useEffect(() => {
    // check is graphics menu config is activated or not yet
    async function checkStatus() {
      const check = await window.sm.isGraphicsMenuConfigActivated();
      setStatus(check);
      if (check) {
        loadGraphicsMenu();
      }
    }

    checkStatus();
  }, []);

  return (
    <>
      <section className="px-3 flex mb-5 items-center">
        <div className="flex-1 me-5">
          <h1 className="font-bold text-xl mb-1">Graphics Menu</h1>
          <p className="text-sm opacity-80">{translate(locale, 'simpleConfigurationsGraphicsMenu.desc', resources)}</p>
        </div>
        <label
          className="inline-flex items-center cursor-pointer w-28"
          data-testid="toggle-graphics-menu-config-btn"
        >
          { status !== null ? (
            <>
              <input
                type="checkbox"
                checked={status}
                onChange={handleToggleGraphicsMenuConfig}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-700 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">{status ?
                translate(locale, 'simpleConfigurationsGraphicsMenu.statusOn', resources) :
                translate(locale, 'simpleConfigurationsGraphicsMenu.statusOff', resources)
              }</span>
            </>
          ) : null }
        </label>
      </section>

      { status !== null ? (
        <button
          onClick={showModalAdd}
          data-testid="show-modal-add-graphic-menu-btn"
          disabled={status ? false : true}
          type="button"
          className="ms-3 text-sm font-medium rounded-lg px-3 py-2 bg-gray-800 hover:bg-green-500 outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:bg-gray-800 hover:text-d-bg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
          <span>{translate(locale, 'simpleConfigurationsGraphicsMenu.addGraphicMenuBtnText', resources)}</span>
        </button>
      ) : null}

      <section className="px-3 mt-10 grid grid-cols-3 gap-4 mb-10">
        {graphicsMenu.map((graphicMenu) => 
          <ConfigCardImg
            key={graphicMenu.name}
            title={graphicMenu.name}
            img={getGraphicMenuPreview(graphicMenu.preview)}
            isChecked={graphicMenu.active}
            onChoose={handleChooseGraphicMenu}
            dataConfig={graphicMenu}
            onDelete={showModalDelete}
          />
        )}
      </section>

      <div className="fixed bottom-5 right-5 left-5 text-left flex flex-col gap-2 w-3/5 z-30">
        {(showSuccessAlert && !hasActiveGraphicMenu) && 
          <Alert
            message={() => translate(locale, 'simpleConfigurationsGraphicsMenu.successAlertMsg.choosed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        }

        {(showSuccessAlert && hasActiveGraphicMenu) &&
          <Alert
            message={() => translate(locale, 'simpleConfigurationsGraphicsMenu.successAlertMsg.changed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        }

        {showDeleteSuccessAlert &&
          <Alert
            message={() => translate(locale, 'simpleConfigurationsGraphicsMenu.successDeleteAlertMsg', resources)}
            type="success"
            onClose={() => setShowDeleteSuccessAlert(false)}
          />
        }
      </div>

      {showModalWithSimpleConfigForm && 
        <ModalWithSimpleConfigForm
          category={'Graphic Menu'}
          onClose={closeModalAdd}
          onSubmit={handleAddGraphicMenu}
          getPreview={getGraphicMenuPreview}
        />
      }

      {graphicMenuNameToBeDeleted &&
        <ModalPrompt
          name={graphicMenuNameToBeDeleted}
          category="Graphic Menu"
          onDelete={handleDeleteGraphicMenu}
          onClose={closeModalDelete}
          showSuccessAlert={() => setShowDeleteSuccessAlert(true)}
        />
      }
    </>
  );
}
