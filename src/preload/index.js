import { contextBridge, ipcRenderer } from 'electron';

const main = {
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  playGame: () => ipcRenderer.invoke('playGame'),
  // createSettingsWindow: () => ipcRenderer.invoke('createSettingsWindow'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('main', main);
  } catch (error) {
    console.error(error);
  }
} else {
  window.main = main;
}
