import { useEffect, useState, useContext } from 'react';
import smLogo from '../assets/sm-logo.png';
import rezaLogo from '../assets/reza-logo.svg';
import priskoLogo from '../assets/PriskoJrMod.png';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function AboutApp() {
  const [appVersion, setAppVersion] = useState(null);
  const {locale, resources} = useContext(LocaleContext);

  useEffect(() => {
    async function getAppVersion() {
      const appVersion = await window.about.getAppVersion();
      setAppVersion(appVersion);
    }
    getAppVersion();
  }, []);

  return (
    <main className="p-8">
      <img alt="Sider Manager Logo" width={100} height={100} src={smLogo} className="mx-auto" />
      <h1 className="text-center text-xl font-bold mt-3">Sider Manager</h1>
      <h2 className="text-center text-lg font-medium">{appVersion && `v${appVersion}`}</h2>

      <section className="w-full mt-[50px] px-2">
        <h2 className="mb-4 font-medium text-center">{translate(locale, 'aboutWindow.powered', resources)}</h2>

        <ul className="flex justify-between">
          <li>
            <img src={priskoLogo} width={60} height={60} alt="Prisko Jr Mod Logo" />
            <h3 className="mt-2 text-sm">Prisko Jr Mod</h3>
          </li>
          <li>
            <img src={rezaLogo} width={60} height={60} alt="RezaFikkri Logo" />
            <h3 className="mt-2 text-sm">RezaFikkri</h3>
          </li>
        </ul>
      </section>
    </main>
  );
}
