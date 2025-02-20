import { useState, useContext } from 'react';
import soccerLogo from '../assets/Logo_Pro_Evolution_Soccer.svg';
import Alert from './Alert';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function PlayGameButton() {
  const {locale, resources} = useContext(LocaleContext);
  const [playGameError, setPlayGameError] = useState(null);

  async function handlePlayGame() {
    const playGame = await window.sm.playGame();
    if (playGame === false) {
      setPlayGameError('runApp');
    } else if(playGame !== true) {
      setPlayGameError(playGame);
    }
  }

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-400 font-bold text-xl rounded-3xl px-4 py-6 outline outline-2 outline-transparent focus:outline-offset-2 focus:outline-green-500 transition-colors duration-100 shadow-lg text-d-bg flex justify-center items-center"
        onClick={handlePlayGame}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"/></svg>
        <span>{translate(locale, 'playGameBtn.btnText', resources)}</span>
      </button>
      {playGameError &&
        <div className="absolute bottom-5 right-5 left-5 text-left">
          <Alert
            message={() => translate(locale, `playGameBtn.error.${playGameError}`, resources)}
            onClose={() => setPlayGameError(null)}
          />
        </div>
      }
    </>
  );
}
