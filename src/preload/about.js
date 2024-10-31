import { contextBridge, ipcRenderer } from 'electron';

const about = {
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('about', about);
  } catch (error) {
    console.error(error);
  }
} else {
  window.about = about;
}
