export default function Toggle({ value, onToggle, testid }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
     <input type="checkbox" data-testid={testid} checked={value} className="sr-only peer" onChange={onToggle}/>
      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-700 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-green-600"/>
    </label>
  );
}
