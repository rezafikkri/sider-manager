import Header from './Header';
import AdvancedConfigurationButton from './AdvancedConfigurationButton';
import AddonInitializationButton from './AddonInitializationButton';
import PlayGameButton from './PlayGameButton';
import SimpleConfigurationButton from './SimpleConfigurationButton';
import Footer from './Footer';

export default function MainApp() {
  return (
    <>
      <section className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center z-0">
        <div className="bg-gradient"></div>
      </section>
      <Header type="main"/>
      <main className="grid grid-cols-2 gap-5 p-10 text-center relative z-10">
        <AddonInitializationButton />
        <PlayGameButton />
        <SimpleConfigurationButton />
        <AdvancedConfigurationButton />
      </main>
      <Footer />
    </>
  );
}
