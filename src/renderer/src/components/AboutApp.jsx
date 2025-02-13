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
      const appVersion = await window.sm.getAppVersion();
      setAppVersion(appVersion);
    }
    getAppVersion();
  }, []);

  return (
    <main className="p-8">
      <img alt="Sider Manager Logo" width={100} height={100} src={smLogo} className="mx-auto" />
      <h1 className="text-center text-2xl font-bold mt-3">Sider Manager</h1>
      <h2 className="text-center text-lg font-medium mt-1.5">{appVersion && `v${appVersion}`}</h2>

      <section className="mt-14">
        <h2 className="mb-4 font-bold text-lg">{translate(locale, 'aboutWindow.powered', resources)}</h2>

        <ul className="flex gap-10">
          <li>
            <img src={priskoLogo} width={60} height={60} alt="Prisko Jr Mod Logo" />
            <h3 className="mt-2">Prisko Jr Mod</h3>
          </li>
          <li>
            <img src={rezaLogo} width={60} height={60} alt="RezaFikkri Logo" />
            <h3 className="mt-2">RezaFikkri</h3>
          </li>
        </ul>
      </section>
      <section className="mt-14 mb-5">
        <h2 className="font-bold mb-4 text-lg">{translate(locale, 'aboutWindow.contact.title', resources)}</h2>
        <p className="text-white/90" dangerouslySetInnerHTML={{__html: translate(locale, 'aboutWindow.contact.desc', resources)}}/>
        <h3 className="mt-3 mb-1.5 font-semibold">Email</h3>
        <p className="text-white/90"><a href="mailto:fikkri.reza@gmail.com" target="_blank">fikkri.reza@gmail.com</a></p>
        <h4 className="mt-3 mb-1.5 font-semibold">WhatsApp</h4>
        <p className="text-white/90">+62 85758438583</p>
      </section>
    </main>
  );
}
