import { useId } from "react";

export default function ConfigCardImg({
  title,
  img,
  isChecked,
  onChecked,
}) {
  const configId = useId();
  return (
    <label htmlFor={configId} className="cursor-pointer border border-gray-800 rounded-lg has-[:checked]:border-indigo-600">
      <img src={img} alt={title} className="rounded-t-lg" loading="lazy" width="1360" height="768" decoding="async" />
      <div className="flex justify-between px-3 py-2 border-t border-gray-800">
        <div className="inline-flex items-center">
          <label className="relative flex items-center cursor-pointer">
            <input name="config" type="radio" className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border checked:border-8 border-gray-600 hover:border-gray-500 bg-gray-700 checked:!border-indigo-600 transition-all duration-75" id={configId}/>
            <span className="absolute bg-white w-1.5 h-1.5 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-75 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            </span>
          </label>
          <span className="ml-2 text-gray-300 text-sm">{title}</span>
        </div>

        <button type="button" className="text-white/40 hover:text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16"><path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/></svg>
        </button>
      </div>
    </label>
  );
}