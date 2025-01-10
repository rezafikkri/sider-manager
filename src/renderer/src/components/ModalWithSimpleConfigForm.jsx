import { useEffect, useId } from 'react';
import notFoundImage from '../assets/not-found-image.svg';

export default function ModalWithSimpleConfigForm() {
  const keyInputManagerName = useId();
  const keyInputDirectory = useId();

  useEffect(() => {
    document.querySelector('body').classList.add('overflow-hidden');
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center overflow-auto">
        <div className="relative h-fit w-2/5 m-10 bg-indigo-950 rounded-lg shadow px-5 py-6">
          <button
            type="button"
            className="absolute top-0 right-0 text-white/60 bg-sima-bg/50 hover:text-white/90 rounded-es-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          </button>

          <form action="#">
            <div className="mb-7">
              <label
                htmlFor={keyInputManagerName}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                Nama
              </label>
              <input
                type="text"
                name="manager-name"
                id={keyInputManagerName}
                className="block w-full p-4 outline-0 bg-indigo-900/40 rounded-lg outline outline-[3px] focus:outline-offset-2 mb-2 outline-transparent focus:outline-indigo-700"
                placeholder="Masukkan nama Manager"
              />
            </div>

            <div className="mb-7">
              <label
                htmlFor={keyInputDirectory}
                className="inline-block font-semibold mb-3 text-white/90"
              >
                Direktori
              </label>
              <div className="flex outline outline-transparent has-[:focus]:outline-offset-2 has-[:focus]:outline-indigo-700 rounded-lg">
                <input
                  id={keyInputDirectory}
                  type="text"
                  className="flex-auto block w-full p-4 outline-0 bg-indigo-900/40 rounded-l-lg"
                  placeholder="Masukkan direktori"
                  spellCheck="false"
                  name="directory"
                />
                <button
                  type="button"
                  className="flex-none bg-indigo-900/70 hover:bg-indigo-900/90 rounded-r-lg px-4 transition-colors duration-100 font-medium text-white/90"
                  onClick={''}
                >
                  Pilih
                </button>
              </div>
              <small className="block mt-2 mb-7 text-white/80">
                Silahkan pilih atau masukkan lokasi direktori Manager baru yang ingin ditambahkan.
              </small>
            </div>

            <div className="mb-9">
              <span className="inline-block font-semibold mb-3 text-white/90">Preview</span>
              <img className="border border-gray-800 rounded-lg" src={notFoundImage} alt="" />
            </div>

            <div className="flex justify-end items-center">
              <div className="relative">
                <div className="absolute z-20 bg-indigo-600/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                  <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
                </div>

                <button type="submit" className="font-medium rounded-lg px-4 py-3 bg-indigo-700 hover:bg-indigo-600 outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 shadow-lg transition-colors duration-100 ease-in">Simpan</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-sima-bg/80 fixed inset-0 z-40"></div>
    </>
  );
}
