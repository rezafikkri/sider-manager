import './assets/base.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Locale from './components/Locale';
import AddonInitializationApp from './components/AddonInitializationApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Locale
      getResources={window.sm.getLocaleResources}
      getSettings={window.sm.getSettings}
      saveSettings={window.sm.saveSettings}
    >
      <AddonInitializationApp />
    </Locale>
  </React.StrictMode>
);
