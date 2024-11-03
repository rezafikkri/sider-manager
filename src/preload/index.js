import { contextBridge, ipcRenderer } from 'electron';

const sm = {
  windowName: 'main',
  getLocaleResources: () => ipcRenderer.invoke('getLocaleResources'),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  saveSettings: (settings) => ipcRenderer.invoke('saveSettings', settings),
  playGame: () => ipcRenderer.invoke('playGame'),
  createSettingsWindow: () => ipcRenderer.invoke('createSettingsWindow'),
  createAboutWindow: () => ipcRenderer.invoke('createAboutWindow'),
  createAddonInitializationWindow: () => ipcRenderer.invoke('createAddonInitializationWindow'),
  createSimpleConfigurationsWindow: () => ipcRenderer.invoke('createSimpleConfigurationsWindow'),
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
