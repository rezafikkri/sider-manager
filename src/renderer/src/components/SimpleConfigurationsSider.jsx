import { useCallback, useState } from 'react';
import ConfigCardToggle from './ConfigCardToggle';

export default function SimpleConfigurationsSider() {
  const [debug, setDebug] = useState(false);
  const handleDebug = useCallback(() => setDebug((debug) => !debug), []);

  const [luaModule, setLuaModule] = useState(true);
  const handleLuaModule = useCallback(() => setLuaModule((luaModule) => !luaModule), []);

  const [liveCpk, setLiveCpk] = useState(true);
  const handleLiveCpk = useCallback(() => setLiveCpk((liveCpk) => !liveCpk), []);

  const [lookUpCache, setLookUpCache] = useState(true);
  const handleLookUpCache = useCallback(() => setLookUpCache((lookUpCache) => !lookUpCache), []);

  const [closeOnExit, setCloseOnExit] = useState(true);
  const handleCloseOnExit = useCallback(() => setCloseOnExit((closeOnExit) => !closeOnExit), []);

  const [startMinimized, setStartMinimized] = useState(true);
  const handleStartMinimized = useCallback(() => setStartMinimized((startMinimized) => !startMinimized), []);

  const [addressCache, setAddressCache] = useState(true);
  const handleAddressCache = useCallback(() => setAddressCache((addressCache) => !addressCache), []);

  const [freeSelectSides, setFreeSelectSides] = useState(true);
  const handleFreeSelectSides = useCallback(() => setFreeSelectSides((freeSelectSides) => !freeSelectSides), []);

  const [freeFirstPlayer, setFreeFirstPlayer] = useState(true);
  const handleFreeFirstPlayer = useCallback(() => setFreeFirstPlayer((freeFirstPlayer) => !freeFirstPlayer), []);

  const [blackBar, setBlackBar] = useState(true);
  const handleBlackBar = useCallback(() => setBlackBar((blackBar) => !blackBar), []);

  const [cameraSliders, setCameraSliders] = useState(50);
  const handleCameraSliders = useCallback((e) => setCameraSliders(e.target.value), []);

  const [cameraDynamicWideAngle, setCameraDynamicWideAngle] = useState(true);
  const handleCameraDynamicWideAngle = useCallback(() => setCameraDynamicWideAngle((cameraSliders) => !cameraSliders), []);

  const simpleConfigs = [
    {
      id: 1,
      title: 'Debug',
      desc: 'Membuat Sider mengeluarkan beberapa informasi tambahan ke dalam file log <code>sider.log</code>. Tetapi harap ingat logging ekstra dapat memperlambat game,',
      toggleValue: debug,
      onToggle: handleDebug,
    },
    {
      id: 2,
      title: 'Lua Modules',
      desc: 'Mengaktifkan/menonaktifkan dukungan scripting.',
      toggleValue: luaModule,
      onToggle: handleLuaModule,
    },
    {
      id: 3,
      title: 'Live CPK',
      desc: 'Mengaktifkan/menonaktifkan fungsionalitas LiveCPK dari Sider.',
      toggleValue: liveCpk,
      onToggle: handleLiveCpk,
    },
    {
      id: 4,
      title: 'Look Up Cache',
      desc: '-',
      toggleValue: lookUpCache,
      onToggle: handleLookUpCache,
    },
    {
      id: 5,
      title: 'Close On Exit',
      desc: 'Membuat Sider akan menutup sendiri, ketika keluar dari game.',
      toggleValue: closeOnExit,
      onToggle: handleCloseOnExit,
    },
    {
      id: 6,
      title: 'Start Minimized',
      desc: 'Membuat Sider akan mulai dengan jendela yang diminimalkan',
      toggleValue: startMinimized,
      onToggle: handleStartMinimized,
    },
    {
      id: 7,
      title: 'Address Cache',
      desc: '-',
      toggleValue: addressCache,
      onToggle: handleAddressCache,
    },
    {
      id: 8,
      title: 'Free Select Sides',
      desc: 'Memungkinkan gerakan bebas pengontrol. Biasanya, itu hanya mungkin dalam mode Exhibition, tetapi dengan mengaktifkan fitur ini, Anda juga dapat memindahkan pengontrol di mode kompetisi.',
      toggleValue: freeSelectSides,
      onToggle: handleFreeSelectSides,
    },
    {
      id: 9,
      title: 'Free First Player',
      desc: 'Memungkinkan pengontrol pertama dipindahkan ke tengah, menonaktifkannya secara efektif.',
      toggleValue: freeFirstPlayer,
      onToggle: handleFreeFirstPlayer,
    },
    {
      id: 10,
      title: 'Black Bar',
      desc: 'Matikan bilah hitam (<i>letterboxing</i>) di bagian atas dan bawah layar, atau di kiri/kanan.',
      toggleValue: blackBar,
      onToggle: handleBlackBar,
    },
    {
      id: 12,
      title: 'Camera Dynamic Wide Angle',
      desc: 'Mengaktifkan slider "Angle" untuk kamera "Dynamic Wide". Fitur ini agak eksperimental.',
      toggleValue: cameraDynamicWideAngle,
      onToggle: handleCameraDynamicWideAngle,
    },
  ];

  return (
    <>
      <h1 className="font-bold text-xl mb-1 px-3">Sider</h1>
      <p className="text-sm mb-10 px-3">Config your Sider easily</p>

      {simpleConfigs.map((config) => (
        <ConfigCardToggle {...config} key={config.id} />
      ))}

      <section className="flex items-center mb-5 [&_code]:bg-indigo-950 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded px-3 py-1.5 rounded-lg hover:bg-indigo-950 [&_code]:hover:bg-indigo-900 group">
        <div className="flex-1 me-10">
          <h2 className="font-semibold mb-1">Camera Sliders</h2>
          <p className="text-sm opacity-70">Ini memungkinkan untuk memperluas jangkauan slider kamera: Zoom, Height, Angle. Saat ini, ini hanya berfungsi untuk kamera "Kustom". Setel ke <code>0</code> untuk menonaktifkan fitur ini.</p>
        </div>
        <input
          type="text"
          value={cameraSliders}
          onChange={handleCameraSliders}
          className="block w-14 px-3 py-2 outline-[3px] bg-indigo-950 rounded-lg outline outline-transparent focus:outline-offset-2 focus:outline-indigo-700 group-hover:bg-indigo-900"
        />
      </section>
    </>
  );
}
