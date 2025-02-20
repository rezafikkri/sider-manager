import { useEffect, useMemo, useState } from 'react';
import { LocaleProvider } from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function Locale({
  children,
  getResources: wGetResources,
  getSettings,
  saveSettings,
}) {
  const [locale, setLocale] = useState(null);
  const [resources, setResources] = useState(null);

  useEffect(() => {
    async function getResources() {
      const resources = await wGetResources();
      setResources(resources);
    }
    
    async function getLocale() {
      const settings = await getSettings();
      setLocale(settings.locale);
    }

    getResources();
    getLocale();
  }, []);

  function toggleLocale() {
    setLocale((prevLocale) => {
      const locale = prevLocale === 'id' ? 'en' : 'id';
      // save locale to settings file
      saveSettings({locale});

      // list of window with dynamic title
      const windowsDT = ['initializations'];
      if (windowsDT.includes(window.sm.windowName)) {
        window.sm.setTitle(translate(locale, `${window.sm.windowName}Window.title`, resources));
      }
      return locale;
    });
  }

  const localeContextValue = useMemo(() => ({
    locale,
    toggleLocale,
    resources,
  }), [locale]);

  if (locale === null) return null;

  return (
    <LocaleProvider value={localeContextValue}>
      {children}
    </LocaleProvider>
  );
}
