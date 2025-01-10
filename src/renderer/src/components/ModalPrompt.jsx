import { useEffect } from 'react';

export default function ModalPrompt() {
  useEffect(() => {
    document.querySelector('body').classList.add('overflow-hidden');
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center">
        <div className="relative h-fit w-[47%] m-10 bg-indigo-950 rounded-lg shadow px-5 py-6">
          <button
            type="button"
            className="absolute top-0 right-0 text-white/60 bg-sima-bg/50 hover:text-white/90 rounded-es-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          </button>

          <div className="text-center">
            <svg className="mx-auto mb-4 w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>

            <h3 className="mb-6 text-lg text-white/90">Are you sure you want to delete this Manager? Manager will be delete permanently.</h3>

            <button type="button" className="bg-red-600 hover:bg-red-500 outline outline-transparent focus:outline-offset-2 focus:outline-red-600 transition-colors duration-100 ease-in font-medium rounded-lg px-4 py-3">
              Yes, I'm sure
            </button>
            <button type="button" className="font-medium rounded-lg px-4 py-3 ms-3 bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 outline outline-transparent focus:outline-offset-2 focus:outline-gray-600 transition-colors duration-100 ease-in">No, cancel</button>
          </div>
        </div>
      </div>

      <div className="bg-sima-bg/80 fixed inset-0 z-40"></div>
    </>
  );
}
