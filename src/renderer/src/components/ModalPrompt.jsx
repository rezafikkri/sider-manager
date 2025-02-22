import { useState, useContext, useRef } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function ModalPrompt({
  name,
  category,
  onDelete,
  onClose,
  showSuccessAlert,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {locale, resources} = useContext(LocaleContext);
  const closeBtn = useRef(null);
  const cancelBtn = useRef(null);

  async function handleDelete() {
    setIsLoading(true);
    closeBtn.current.disabled = true;
    cancelBtn.current.disabled = true;
    await onDelete(name);
    setIsLoading(false);
    onClose();
    showSuccessAlert();
  }

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center">
        <div className="relative h-fit w-[47%] m-10 bg-d-bg-light rounded-lg shadow px-5 py-6">
          <button
            data-testid="close-btn"
            ref={closeBtn}
            type="button"
            className="absolute top-0 right-0 text-white/60 bg-d-alert-bg hover:text-white/90 rounded-es-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center disabled:text-white/40 disabled:hover:text-white/40 disabled:cursor-not-allowed"
            onClick={onClose}
          >
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          </button>

          <div className="text-center">
            <svg className="mx-auto mb-4 w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>

            <h3 className="mb-6 text-lg text-white/90" data-testid="alert-message-delete">
              {translate(locale, 'modalPrompt.msgPrefix', resources)}
              <strong> {`${category} ${name}`}</strong>? {category}
              {` ${translate(locale, 'modalPrompt.msgEnding', resources)}`}
            </h3>

            <div className="inline-block relative">
              {isLoading &&
                <div className="absolute z-20 bg-red-500/90 top-0 bottom-0 left-0 right-0 rounded-lg flex justify-center items-center" data-testid="loading">
                  <div className="w-5 h-5 border-4 border-t-white border-s-white/50 border-e-white/50 border-b-white/50 rounded-full animate-spin"/>
                </div>
              }

              <button
                onClick={handleDelete}
                type="button"
                className="btn active:scale-[0.96] bg-red-600 hover:bg-red-500 font-medium rounded-lg px-4 py-3"
              >
                {translate(locale, 'modalPrompt.yesBtnText', resources)}
              </button>
            </div>
            <button
              ref={cancelBtn}
              onClick={onClose}
              type="button"
              className="btn active:scale-[0.96] font-medium rounded-lg px-4 py-3 ms-3 bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600"
            >
              {translate(locale, 'modalPrompt.cancelBtnText', resources)}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-d-bg/80 fixed inset-0 z-40"></div>
    </>
  );
}
