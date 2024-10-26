import Locale from './Locale';
import Header from './Header';
import AdvancedConfigurationButton from './AdvancedConfigurationButton';
import InstallAddonButton from './InstallAddonButton';
import PlayGameButton from './PlayGameButton';
import SimpleConfigurationButton from './SimpleConfigurationButton';
import Footer from './Footer';

export default function MainApp() {
  return (
    <Locale
      getResources={window.main.getLocaleResources}
      getSettings={window.main.getSettings}
      saveSettings={window.main.saveSettings}
    >
      <section className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center z-0">
        <div className="bg-gradient"></div>
      </section>
      <Header type="main"/>
      <main className="grid grid-cols-3 gap-5 p-10 text-center relative z-10">
        <InstallAddonButton />
        <PlayGameButton />
        <AdvancedConfigurationButton />
        <SimpleConfigurationButton />
      </main>
      <Footer />
    </Locale>
  );
}
