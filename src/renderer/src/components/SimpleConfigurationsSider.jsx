import { useCallback, useState, useContext } from 'react';
import ConfigCardToggle from './ConfigCardToggle';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import ConfigCardInput from './ConfigCardInput';

export default function SimpleConfigurationsSider() {
  const {locale, resources} = useContext(LocaleContext);

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
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc1', resources),
      toggleValue: debug,
      onToggle: handleDebug,
    },
    {
      id: 2,
      title: 'Lua Modules',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc2', resources),
      toggleValue: luaModule,
      onToggle: handleLuaModule,
    },
    {
      id: 3,
      title: 'Live CPK',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc3', resources),
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
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc5', resources),
      toggleValue: closeOnExit,
      onToggle: handleCloseOnExit,
    },
    {
      id: 6,
      title: 'Start Minimized',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc6', resources),
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
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc8', resources),
      toggleValue: freeSelectSides,
      onToggle: handleFreeSelectSides,
    },
    {
      id: 9,
      title: 'Free First Player',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc9', resources),
      toggleValue: freeFirstPlayer,
      onToggle: handleFreeFirstPlayer,
    },
    {
      id: 10,
      title: 'Black Bar',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc10', resources),
      toggleValue: blackBar,
      onToggle: handleBlackBar,
    },
    {
      id: 11,
      title: 'Camera Dynamic Wide Angle',
      desc: translate(locale, 'simpleConfigurationsSider.sectionPDesc11', resources),
      toggleValue: cameraDynamicWideAngle,
      onToggle: handleCameraDynamicWideAngle,
    },
  ];

  return (
    <>
      <h1 className="font-bold text-xl mb-1 px-3">Sider</h1>
      <p className="text-sm mb-10 px-3">{translate(locale, 'simpleConfigurationsSider.pText', resources)}</p>

      {simpleConfigs.map((config) => (
        <ConfigCardToggle {...config} key={config.id} />
      ))}

      <ConfigCardInput
        title="Camera Sliders"
        desc={translate(locale, 'simpleConfigurationsSider.sectionPDesc12', resources)}
        toggleValue={cameraSliders}
        onToggle={handleCameraSliders}
      />
    </>
  );
}
