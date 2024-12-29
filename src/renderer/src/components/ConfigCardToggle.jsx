import { memo } from 'react';
import Toggle from './Toggle';

function ConfigCardToggle({
  title,
  desc,
  toggleValue,
  onToggle,
}) {
  return (
    <section className="flex items-center mb-5 [&_code]:bg-indigo-950 [&_code]:p-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:hover:bg-indigo-900 hover:bg-indigo-950 px-3 py-1.5 rounded-lg">
      <div className="flex-1 me-10">
        <h2 className="font-semibold mb-1">{title}</h2>
        <div className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <Toggle value={!!toggleValue.value} onToggle={onToggle} />
    </section>
  );
};

export default memo(ConfigCardToggle);
