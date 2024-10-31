import './assets/base.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Locale from './components/Locale';
import InitializationsApp from './components/InitializationsApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Locale
      getResources={window.initializations.getLocaleResources}
      getSettings={window.initializations.getSettings}
      saveSettings={window.initializations.saveSettings}
    >
      <InitializationsApp />
    </Locale>
  </React.StrictMode>
);
