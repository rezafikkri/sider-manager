import { memo, useEffect, useState } from 'react';

function ConfigCardInput({
  title,
  desc,
  inputValue,
  onInput,
  testid,
}) {
  const [value, setValue] = useState(inputValue.value);

  useEffect(() => {
    const timeoutId = setTimeout(() => onInput(value), 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <section className="flex items-center mb-5 [&_code]:bg-bg-d-alert-bg [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded px-3 py-1.5 rounded-lg hover:bg-d-alert-bg group">
      <div className="flex-1 me-10">
        <h2 className="font-semibold mb-1">{title}</h2>
        <div className="text-sm opacity-70" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="block w-20 px-3 py-2 outline-[3px] bg-d-input-bg rounded-lg outline outline-transparent focus:outline-offset-2 focus:outline-green-700 group-hover:bg-d-bg-light"
        data-testid={testid}
      />
    </section>
  );
};

export default memo(ConfigCardInput);
