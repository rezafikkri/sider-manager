import './assets/base.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Locale from './components/Locale';
import AboutApp from './components/AboutApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Locale
      getResources={window.sm.getLocaleResources}
      getSettings={window.sm.getSettings}
      saveSettings={window.sm.saveSettings}
    >

      <AboutApp />
    </Locale>
  </React.StrictMode>
);
