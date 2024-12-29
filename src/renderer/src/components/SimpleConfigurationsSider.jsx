import { useCallback, useState, useContext, useEffect } from 'react';
import ConfigCardToggle from './ConfigCardToggle';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import ConfigCardInput from './ConfigCardInput';
import useSiderIni from '../hooks/useSiderIni';

export default function SimpleConfigurationsSider() {
  const {locale, resources} = useContext(LocaleContext);

  const [debug, setDebug, handleDebug] = useSiderIni();
  const [luaModule, setLuaModule, handleLuaModule] = useSiderIni();
  const [liveCpk, setLiveCpk, handleLiveCpk] = useSiderIni();
  const [lookUpCache, setLookUpCache, handleLookUpCache] = useSiderIni();
  const [closeOnExit, setCloseOnExit, handleCloseOnExit] = useSiderIni();
  const [startMinimized, setStartMinimized, handleStartMinimized] = useSiderIni();
  const [addressCache, setAddressCache, handleAddressCache] = useSiderIni();
  const [freeSelectSides, setFreeSelectSides, handleFreeSelectSides] = useSiderIni();
  const [freeFirstPlayer, setFreeFirstPlayer, handleFreeFirstPlayer] = useSiderIni();
  const [blackBar, setBlackBar, handleBlackBar] = useSiderIni();
  const [cameraDynamicWideAngle, setCameraDynamicWideAngle, handleCameraDynamicWideAngle] = useSiderIni();

  const [cameraSliders, setCameraSliders] = useState(null);
  const handleCameraSliders = useCallback((value) => {
    const newCameraSliders = { ...cameraSliders, value };
    window.sm.saveSiderIni(newCameraSliders);
    setCameraSliders(newCameraSliders);
  }, [cameraSliders]);

  useEffect(() => {
    async function loadSiderIni() {
      const { pesDirectory } = await window.sm.getSettings();
      const siderIni = await window.sm.readSiderIni(pesDirectory);

      for (const ini of siderIni) {
        let [, iniValue] = ini.split('=');
        if (!isNaN(iniValue)) iniValue = +iniValue; // convert to int

        if (/^debug =/.test(ini)) {
          setDebug({ key: 'debug', value: iniValue });
        } else if (/^lua\.enabled =/.test(ini)) {
          setLuaModule({ key: 'lua.enabled', value: iniValue })
        } else if (/^livecpk\.enabled =/.test(ini)) {
          setLiveCpk({ key: 'livecpk.enabled', value: iniValue });
        } else if (/^lookup-cache\.enabled =/.test(ini)) {
          setLookUpCache({ key: 'lookup-cache.enabled', value: iniValue });
        } else if (/^close\.on\.exit =/.test(ini)) {
          setCloseOnExit({ key: 'close.on.exit', value: iniValue });
        } else if (/^start\.minimized =/.test(ini)) {
          setStartMinimized({ key: 'start.minimized', value: iniValue });
        } else if (/^address-cache\.enabled =/.test(ini)) {
          setAddressCache({ key: 'address-cache.enabled', value: iniValue });
        } else if (/^free.select.sides =/.test(ini)) {
          setFreeSelectSides({ key: 'free.select.sides', value: iniValue });
        } else if (/^free\.first\.player =/.test(ini)) {
          setFreeFirstPlayer({ key: 'free.first.player', value: iniValue});
        } else if (/^black\.bars\.off =/.test(ini)) {
          setBlackBar({ key: 'black.bars.off', value: iniValue });
        } else if (/^camera\.sliders\.max =/.test(ini)) {
          setCameraSliders({ key: 'camera.sliders.max', value: iniValue });
        } else if (/^camera\.dynamic-wide\.angle\.enabled =/.test(ini)) {
          setCameraDynamicWideAngle({ key: 'camera.dynamic-wide.angle.enabled', value: iniValue });
        }
      }
    }

    loadSiderIni();
  }, []);

  const header = (
    <>
      <h1 className="font-bold text-xl mb-1 px-3">Sider</h1>
      <p className="text-sm mb-10 px-3 opacity-80">{translate(locale, 'simpleConfigurationsSider.pText', resources)}</p>
    </>
  );

  if (!debug) return header;

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
      {header}

      {simpleConfigs.map((config) => (
        <ConfigCardToggle {...config} key={config.id} />
      ))}

      <ConfigCardInput
        title="Camera Sliders"
        desc={translate(locale, 'simpleConfigurationsSider.sectionPDesc12', resources)}
        inputValue={cameraSliders}
        onInput={handleCameraSliders}
      />
    </>
  );
}
