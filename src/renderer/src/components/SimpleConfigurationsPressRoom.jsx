import { useEffect, useState, useContext, useCallback } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import ConfigCardImg from './ConfigCardImg';
import Alert from './Alert';
import ModalWithSimpleConfigForm from './ModalWithSimpleConfigForm';
import notFoundImage from '../assets/not-found-image.svg';
import ModalPrompt from './ModalPrompt';

export default function SimpleConfigurationsPressRoom() {
  const {locale, resources} = useContext(LocaleContext);

  const [status, setStatus] = useState(null);
  const [pressRooms, setPressRooms] = useState([]);
  const [hasActivePressRoom, setHasActivePressRoom] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showModalWithSimpleConfigForm, setShowModalWithSimpleConfigForm] = useState(false);
  const [pressRoomNameToBeDeleted, setPressRoomNameToBeDeleted] = useState(null);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  async function loadPressRooms() {
    const pressRooms = await window.sm.readPressRooms();
    setPressRooms(pressRooms);
  }

  function handleTogglePressRoomConfig() {
    window.sm.togglePressRoomConfig();
    setStatus((prevStatus) => {
      const newStatus = !prevStatus;
      if (newStatus) {
        loadPressRooms();
      } else {
        setPressRooms([]);
        setHasActivePressRoom(false);
      }

      return newStatus;
    });
  }

  const handleChoosePressRoom = useCallback(async (pressRoom) => {
    await window.sm.choosePressRoom({ ...pressRoom, active: true });

    setPressRooms((prevPressRooms) => {
      for (const prevPressRoom of prevPressRooms) {
        if (prevPressRoom.active) {
          setHasActivePressRoom(true);
          break;
        }
      }

      const nextPressRooms = [...prevPressRooms];
      let pressRoomChanged = 0;
      for (const [index, nextPressRoom] of nextPressRooms.entries()) {
        if (nextPressRoom.name === pressRoom.name) {
          nextPressRooms[index] = { ...nextPressRoom, active: true };
          pressRoomChanged++;
        } else if (nextPressRoom.active) {
          nextPressRooms[index] = { ...nextPressRoom, active: false };
          pressRoomChanged++;
        }

        if (pressRoomChanged === 2) break;
      }
      
      return nextPressRooms;
    });
    setShowSuccessAlert(true);
  }, []);

  async function handleAddPressRoom(name, directory) {
    const pressRoom = await window.sm.savePressRoom(name, directory);
    if (pressRoom) {
      setPressRooms([ ...pressRooms, pressRoom ]);
      return true;
    }
    return false;
  }

  async function handleDeletePressRoom(name) {
    await window.sm.deletePressRoom(name);
    setPressRooms(pressRooms.filter((pressRoom) => 
      pressRoom.name !== name
    ));
  }

  function getPressRoomPreview(preview) {
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
    setPressRoomNameToBeDeleted(name);
    document.querySelector('body').classList.add('overflow-hidden');
  }, []);

  function closeModalDelete() {
    setPressRoomNameToBeDeleted(null);
    document.querySelector('body').classList.remove('overflow-hidden');
  }

  useEffect(() => {
    // check is graphics menu config is activated or not yet
    async function checkStatus() {
      const check = await window.sm.isPressRoomConfigActivated();
      setStatus(check);
      if (check) {
        loadPressRooms();
      }
    }

    checkStatus();
  }, []);

  return (
    <>
      <section className="px-3 flex mb-5 items-center">
        <div className="flex-1 me-5">
          <h1 className="font-bold text-xl mb-1">Press Room</h1>
          <p className="text-sm opacity-80">{translate(locale, 'simpleConfigurationsPressRoom.desc', resources)}</p>
        </div>
        <label
          className="inline-flex items-center cursor-pointer w-28"
          data-testid="toggle-press-room-config-btn"
        >
          { status !== null ? (
            <>
              <input
                type="checkbox"
                checked={status}
                onChange={handleTogglePressRoomConfig}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-700 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">{status ?
                translate(locale, 'simpleConfigurationsPressRoom.statusOn', resources) :
                translate(locale, 'simpleConfigurationsPressRoom.statusOff', resources)
              }</span>
            </>
          ) : null }
        </label>
      </section>

      { status !== null ? (
        <button
          onClick={showModalAdd}
          data-testid="show-modal-add-press-room-btn"
          disabled={status ? false : true}
          type="button"
          className="ms-3 text-sm font-medium rounded-lg px-3 py-2 bg-gray-800 hover:text-d-bg hover:bg-green-500 outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
          <span>{translate(locale, 'simpleConfigurationsPressRoom.addPressRoomBtnText', resources)}</span>
        </button>
      ) : null}

      <section className="px-3 mt-10 grid grid-cols-3 gap-4 mb-10">
        {pressRooms.map((pressRoom) => 
          <ConfigCardImg
            key={pressRoom.name}
            title={pressRoom.name}
            img={getPressRoomPreview(pressRoom.preview)}
            isChecked={pressRoom.active}
            onChoose={handleChoosePressRoom}
            dataConfig={pressRoom}
            onDelete={showModalDelete}
          />
        )}
      </section>

      <div className="fixed bottom-5 right-5 left-5 text-left flex flex-col gap-2 w-3/5 z-30">
        {(showSuccessAlert && !hasActivePressRoom) && 
          <Alert
            message={() => translate(locale, 'simpleConfigurationsPressRoom.successAlertMsg.choosed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        }

        {(showSuccessAlert && hasActivePressRoom) &&
          <Alert
            message={() => translate(locale, 'simpleConfigurationsPressRoom.successAlertMsg.changed', resources)}
            type="success"
            onClose={() => setShowSuccessAlert(false)}
          />
        }

        {showDeleteSuccessAlert &&
          <Alert
            message={() => translate(locale, 'simpleConfigurationsPressRoom.successDeleteAlertMsg', resources)}
            type="success"
            onClose={() => setShowDeleteSuccessAlert(false)}
          />
        }
      </div>

      {showModalWithSimpleConfigForm && 
        <ModalWithSimpleConfigForm
          category="Press Room"
          onClose={closeModalAdd}
          onSubmit={handleAddPressRoom}
          getPreview={getPressRoomPreview}
        />
      }

      {pressRoomNameToBeDeleted &&
        <ModalPrompt
          name={pressRoomNameToBeDeleted}
          category="Press Room"
          onDelete={handleDeletePressRoom}
          onClose={closeModalDelete}
          showSuccessAlert={() => setShowDeleteSuccessAlert(true)}
        />
      }
    </>
  );
}
