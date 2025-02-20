import { memo } from 'react';
import Toggle from './Toggle';

function ConfigCardToggle({
  title,
  desc,
  toggleValue,
  onToggle,
}) {
  let checked;
  let mb = 'mb-5';
  let handleOnToggle = onToggle;
  if (toggleValue.key === 'lua.module' || toggleValue.key === 'cpk.root') {
    checked = toggleValue.checked;
    mb = 'mb-2';
    handleOnToggle = () => {
      onToggle({ key: toggleValue.key, value: toggleValue.value });
    };
  } else {
    checked = !!toggleValue.value;
  }

  return (
    <section className={`flex items-center ${mb} [&_code]:bg-d-alert-bg [&_code]:p-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:hover:bg-d-alert-bg-hover hover:bg-d-alert-bg px-3 py-1.5 rounded-lg`}>
      <div className="flex-1 me-10">
        <h2 className="font-medium mb-1">{title}</h2>
        {desc && <div className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: desc }} />}
      </div>
      <Toggle value={checked} onToggle={handleOnToggle} testid={toggleValue.key + toggleValue.value} />
    </section>
  );
};

export default memo(ConfigCardToggle);
