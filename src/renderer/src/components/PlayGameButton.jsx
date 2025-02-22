import { useState, useContext } from 'react';
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
    <section className="col-span-2 mb-5">
      <button
        className="btn bg-green-500 hover:bg-green-400 font-bold text-xl rounded-2xl px-4 py-6 active:scale-[0.96] shadow-lg text-d-bg flex justify-center items-center w-full"
        onClick={handlePlayGame}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2 text-d-bg/90" width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"/></svg>
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
    </section>
  );
}
