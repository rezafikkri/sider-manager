import { contextBridge, ipcRenderer } from 'electron';

const settings = {
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  choosePESDirectory: () => ipcRenderer.invoke('choosePESDirectory'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  isPESExecutableExist: (pesDirectory, pesExe) => ipcRenderer.invoke('isPESExecutableExist', pesDirectory, pesExe),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('settings', settings);
  } catch (error) {
    console.error(error);
  }
} else {
  window.settings = settings;
}
