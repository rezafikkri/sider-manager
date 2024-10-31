import './assets/base.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Locale from './components/Locale';
import MainApp from './components/MainApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Locale
      getResources={window.main.getLocaleResources}
      getSettings={window.main.getSettings}
      saveSettings={window.main.saveSettings}
    >
      <MainApp />
    </Locale>
  </React.StrictMode>
);
