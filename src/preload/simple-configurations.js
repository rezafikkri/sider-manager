import { contextBridge, ipcRenderer } from 'electron';

const sm = {
  windowName: 'simpleConfigurations',
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  readSiderIni: (pesDirectory) => ipcRenderer.invoke('readSiderIni', pesDirectory),
  saveSiderIni: (siderIni) => ipcRenderer.invoke('saveSiderIni', siderIni),
  readModules: (pesDirectory) => ipcRenderer.invoke('readModules', pesDirectory),
  readLiveCpks: (pesDirectory) => ipcRenderer.invoke('readLiveCpks', pesDirectory),
  readMLManager: () => ipcRenderer.invoke('readMLManager'),
  isMLManagerConfigActivated: () => ipcRenderer.invoke('isMLManagerConfigActivated'),
  activateMLManagerConfig: () => ipcRenderer.invoke('activateMLManagerConfig'),
  unactivateMLManagerConfig: () => ipcRenderer.invoke('unactivateMLManagerConfig'),
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
