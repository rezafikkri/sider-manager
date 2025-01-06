import { useState } from 'react';
import ConfigCardImg from './ConfigCardImg';

export default function SimpleConfigurationsMLManager() {
  const [status, setStatus] = useState(false);
  const [mlManagerActive, setMLManagerActive] = useState(null);
  const [loading, setLoading] = useState(false);

  const imgPath1 = 'sm:///home/rezafikkri/.config/sider-manager/ml-manager/Preview1.png';
  const imgPath2 = 'sm:///home/rezafikkri/.config/sider-manager/ml-manager/Preview2.png';
  const imgPath3 = 'sm:///home/rezafikkri/.config/sider-manager/ml-manager/Preview3.png';

  const [mlManager, setMLManager] = useState(null);
  function handleMLManager(mlManager) {
    setMLManager(mlManager);
  }

  return (
    <>
      <section className="px-3 flex mb-5 items-center">
        <div className="flex-1 me-5">
          <h1 className="font-bold text-xl mb-1">ML Manager</h1>
          <p className="text-sm opacity-80">Pilih manager tim yang ingin kamu gunakan ketika memainkan Master League.</p>
        </div>
        <label className="inline-flex items-center cursor-pointer w-28">
          <input
            type="checkbox"
            value={status}
            onChange={() => setStatus(status => !status)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">{status ? 'Hidup' : 'Mati'}</span>
        </label>
      </section>

      <button
        disabled={status ? false : true}
        type="button"
        className="ms-3 text-sm font-medium rounded-lg px-3 py-2 bg-gray-800 hover:bg-indigo-700 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:bg-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon me-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
        <span>Tambah Manager</span>
      </button>

      <section className="px-3 mt-10 grid grid-cols-3 gap-4">
        <ConfigCardImg
          title={'Alex Ferguson'}
          img={imgPath1}
          isChecked={mlManager === 'Alex Ferguson' ? true : false}
          onChecked={handleMLManager}
        />
        <ConfigCardImg
          title={'Jose Mourinho'}
          img={imgPath2}
          isChecked={mlManager === 'Jose Mourinho' ? true : false}
          onChecked={handleMLManager}
        />
        <ConfigCardImg
          title={'Jurgen Klopp'}
          img={imgPath3}
          isChecked={mlManager === 'Jurgen Klopp' ? true : false}
          onChecked={handleMLManager}
        />
      </section>
    </>
  );
}
