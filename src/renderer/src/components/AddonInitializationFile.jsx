export default function AddonInitializationFile({ fileName, fileSize, onRemove, isLoading }) {

  return (
    <section className="p-10 rounded-lg border-4 border-d-bg-light bg-d-input-bg mb-5 mt-5 flex items-center" data-testid="addon-initialization-file">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="icon me-2 text-lime-200" viewBox="0 0 16 16"><path d="M8.5 9.438V8.5h-1v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.93-.62-.4-1.598a1 1 0 0 1-.03-.243"/><path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m2.5 8.5v.938l-.4 1.599a1 1 0 0 0 .416 1.074l.93.62a1 1 0 0 0 1.109 0l.93-.62a1 1 0 0 0 .415-1.074l-.4-1.599V8.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1m1-5.5h-1v1h1v1h-1v1h1v1H9V6H8V5h1V4H8V3h1V2H8V1H6.5v1h1z"/></svg>
      <div className="flex-1">
        <h4 className="font-semibold leading-none">{fileName}</h4>
        <small className="opacity-70">{fileSize}</small>
      </div>
      <button
        onClick={onRemove}
        type="button"
        className="rounded-lg text-sm px-2 py-1.5 outline outline-transparent focus:outline-offset-2 focus:outline-red-600 bg-d-bg-light text-gray-400 hover:text-white hover:bg-red-700 transition-colors duration-300 disabled:outline-0 disabled:bg-d-alert-bg-hover disabled:text-gray-400"
        disabled={!isLoading}
        data-testid="remove-file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16"><path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/></svg>
      </button>
    </section>
  );
}
