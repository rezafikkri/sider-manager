export default function Alert({ message, onClose, type='danger' }) {
  let textColor = 'text-red-400';
  let closeButtonFocusColor = 'focus:ring-red-400';
  let icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon flex-none" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>;

  if (type === 'success') {
    closeButtonFocusColor = 'focus:ring-green-400';
    textColor = 'text-green-400';
    icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon flex-none" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>;
  }

  return (
    <div className={`flex items-center p-4 rounded-lg bg-indigo-950 ${textColor}`}>
      {icon}
      <div className="ms-3 me-3 text-sm font-medium">{message()}</div>
      <button
        type="button"
        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 ${closeButtonFocusColor} p-1.5 inline-flex items-center justify-center h-8 w-8 bg-indigo-950 ${textColor} hover:bg-indigo-900/50`}
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
}
