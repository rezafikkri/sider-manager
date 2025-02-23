import { contextBridge, ipcRenderer } from 'electron';

const sm = {
  windowName: 'about',
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
  getRegistered: () => ipcRenderer.invoke('getRegistered'),
  getReleasedAt: () => ipcRenderer.invoke('getReleasedAt'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('sm', sm);
  } catch (error) {
    console.error(error);
  }
} else {
  window.sm = sm;
}
