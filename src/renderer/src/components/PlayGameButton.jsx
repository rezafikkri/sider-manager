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
        <img src={soccerLogo} className="w-8 me-2"/>
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
