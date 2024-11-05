import { memo } from 'react';

function ConfigCardInput({
  title,
  desc,
  toggleValue,
  onToggle,
}) {
  return (
    <section className="flex items-center mb-5 [&_code]:bg-indigo-950 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded px-3 py-1.5 rounded-lg hover:bg-indigo-950 [&_code]:hover:bg-indigo-900 group">
      <div className="flex-1 me-10">
        <h2 className="font-semibold mb-1">{title}</h2>
        <div className="text-sm opacity-70" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <input
        type="text"
        value={toggleValue}
        onChange={onToggle}
        className="block w-14 px-3 py-2 outline-[3px] bg-indigo-950 rounded-lg outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 group-hover:bg-indigo-900"
      />
    </section>
  );
};

export default memo(ConfigCardInput);
