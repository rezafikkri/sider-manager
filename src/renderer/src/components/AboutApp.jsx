import { useEffect, useState, useContext } from 'react';
import dayjs from 'dayjs';
import smLogo from '../assets/sm-logo.png';
import rezaLogo from '../assets/reza-logo.svg';
import priskoLogo from '../assets/PriskoJrMod.png';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';
import 'dayjs/locale/id';

export default function AboutApp() {
  const [appVersion, setAppVersion] = useState(null);
  const {locale, resources} = useContext(LocaleContext);
  const [registered, setRegistered] = useState(null);
  const [releasedAt, setReleasedAt] = useState(null);

  useEffect(() => {
    async function getRegistered() {
      const registered = await window.sm.getRegistered();
      if (registered) {
        const dayjsAtObj = dayjs.unix(registered.at);
        const dayjsUntilObj = dayjs.unix(registered.until);

        let at = dayjsAtObj.format('MMMM DD, YYYY');
        let until = dayjsUntilObj.format('MMMM DD, YYYY');
        if (locale === 'id') {
          dayjs.locale('id');
          at = dayjsAtObj.format('DD MMMM YYYY');
          until = dayjsUntilObj.format('DD MMMM YYYY');
        }

        setRegistered({ ...registered, at, until });
      } else {
        setRegistered(false);
      }
    }
    getRegistered();
    async function getAppVersion() {
      const appVersion = await window.sm.getAppVersion();
      setAppVersion(appVersion);
    }
    getAppVersion();

    // get released at of  installed application
    async function getReleasedAt() {
      let releasedAt = await window.sm.getReleasedAt();
      const dayjsRAObj = dayjs.unix(releasedAt);
      releasedAt = dayjsRAObj.format('MMMM DD, YYYY');
      if (locale === 'id') releasedAt = dayjsRAObj.format('DD MMMM YYYY');
      setReleasedAt(releasedAt);
    }
    getReleasedAt();
  }, []);

  return (
    <>
      <main className="p-8">
        <img alt="Sider Manager Logo" width={100} height={100} src={smLogo} className="mx-auto" />
        <h1 className="text-center mt-3">
          <span className="text-2xl font-bold me-1.5">Sider Manager</span>
          <span className="text-lg font-medium">- {appVersion && `v${appVersion}`}</span>
        </h1>
        <small className="text-center block">
          {translate(locale, 'aboutWindow.releasedAtText', resources)} {releasedAt && releasedAt}
        </small>

        <section className="mt-14">
          <h2 className="mb-4 font-bold text-lg">
            {translate(locale, 'aboutWindow.registeredAs.title', resources)}
          </h2>
          {registered !== null && registered !== false ? (
            <div className="text-white/90">
              <p><b>{translate(locale, 'aboutWindow.registeredAs.name', resources)}</b>: {registered.name}</p>
              <p><b>{translate(locale, 'aboutWindow.registeredAs.email', resources)}</b>: {registered.email}</p>
              <p><b>{translate(locale, 'aboutWindow.registeredAs.at', resources)}</b>: {registered.at}</p>
              <p><b>{translate(locale, 'aboutWindow.registeredAs.until', resources)}</b>: {registered.until}</p>
              <p className="mt-2.5">
                <span>{translate(locale, 'aboutWindow.registeredAs.desc', resources, registered.until)}</span>
                <a href="" target="_blank" className="text-green-500 ms-1">
                  <span className="me-1">{translate(locale, 'aboutWindow.registeredAs.aText', resources)}</span>
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>
                </a>.
              </p>
            </div>
          ) : registered === null ?
            <p className="text-white/90">Loading...</p>
          :
            <p className="text-white/90">{translate(locale, 'aboutWindow.registeredAs.unregistered', resources)}</p>
          }
        </section>

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
      <footer className="text-white/80 text-xs p-8">
        <p>&copy; 2025 PriskoJrMod</p>
      </footer>
    </>
  );
}
