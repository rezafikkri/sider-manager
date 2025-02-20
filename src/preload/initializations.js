import { contextBridge, ipcRenderer } from 'electron';

const sm = {
  windowName: 'initializations',
  setTitle: (title) => ipcRenderer.send('set-title', title),
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  isActivated: () => ipcRenderer.invoke('isActivated'),
  checkLicenseKeyHasBeenUsed: () => ipcRenderer.invoke('checkLicenseKeyHasBeenUsed'),
  activate: (activationKey) => ipcRenderer.invoke('activate', activationKey),
  choosePESDirectory: () => ipcRenderer.invoke('choosePESDirectory'),
  initializeSettings: (pesDirectory) => ipcRenderer.invoke('initializeSettings', pesDirectory),
  initializeMainWindow: () => ipcRenderer.invoke('initializeMainWindow'),
  isPESDirectorySetup: () => ipcRenderer.invoke('isPESDirectorySetup'),
  createAboutWindow: () => ipcRenderer.invoke('createAboutWindow'),
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
