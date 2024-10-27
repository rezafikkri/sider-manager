import SettingsForm from './SettingsForm';
import Locale from './Locale';

export default function SettingsApp() {
  return (
    <Locale
      getResources={window.settings.getLocaleResources}
      getSettings={window.settings.getSettings}
      saveSettings={window.settings.saveSettings}
    >
      <main className="p-8">
        <SettingsForm />
      </main>
    </Locale>
  );
}
