import { contextBridge, ipcRenderer } from 'electron';

const sm = {
  windowName: 'addonInitialization',
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  chooseInitializationFile: () => ipcRenderer.invoke('chooseInitializationFile'),
  addonInitialization: (fileName, filePath) => ipcRenderer.invoke('addonInitialization', fileName, filePath),
  getBackupPath: () => ipcRenderer.invoke('getBackupPath'),
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
