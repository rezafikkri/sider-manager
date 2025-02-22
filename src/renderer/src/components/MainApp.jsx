import Header from './Header';
import { useContext } from 'react';
import AdvancedConfigurationButton from './AdvancedConfigurationButton';
import AddonInitializationButton from './AddonInitializationButton';
import PlayGameButton from './PlayGameButton';
import SimpleConfigurationButton from './SimpleConfigurationButton';
import Footer from './Footer';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function MainApp() {
  const {locale, resources} = useContext(LocaleContext);

  return (
    <>
      <section className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center z-0">
        <div className="bg-gradient"></div>
      </section>
      <Header type="main"/>
      <main className="p-10 text-center relative z-10">
        <PlayGameButton />
        <AddonInitializationButton />

        <section className="flex flex-wrap">
          <SimpleConfigurationButton />
          <AdvancedConfigurationButton />
          <div className="flex mt-2 text-white/70">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon me-1"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9h.01" /><path d="M11 12h1v4h1" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
            <small
              className="w-full block text-left flex-1 text-xs"
              dangerouslySetInnerHTML={{
                __html: translate(locale, 'simpleAdvancedSmallText', resources),
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
