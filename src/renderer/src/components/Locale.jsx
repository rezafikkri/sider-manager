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

  function setWindowTitle(locale) {
    if (window.initializations) {
      window.initializations.setTitle(translate(locale, 'initializationsWindow.title', resources));
    }
  }

  function toggleLocale() {
    setLocale((prevLocale) => {
      const locale = prevLocale === 'id' ? 'en' : 'id';
      // save locale to settings file
      saveSettings({locale});
      setWindowTitle(locale);
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
