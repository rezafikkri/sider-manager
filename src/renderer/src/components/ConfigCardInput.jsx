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
    <section className="flex items-center mb-5 [&_code]:bg-indigo-950 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded px-3 py-1.5 rounded-lg hover:bg-indigo-950 [&_code]:hover:bg-indigo-900 group">
      <div className="flex-1 me-10">
        <h2 className="font-semibold mb-1">{title}</h2>
        <div className="text-sm opacity-70" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="block w-20 px-3 py-2 outline-[3px] bg-indigo-950 rounded-lg outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 group-hover:bg-indigo-900"
        data-testid={testid}
      />
    </section>
  );
};

export default memo(ConfigCardInput);
