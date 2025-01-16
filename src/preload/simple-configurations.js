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
  readMLManagers: () => ipcRenderer.invoke('readMLManagers'),
  readGraphicsMenu: () => ipcRenderer.invoke('readGraphicsMenu'),
  isMLManagerConfigActivated: () => ipcRenderer.invoke('isMLManagerConfigActivated'),
  isGraphicsMenuConfigActivated: () => ipcRenderer.invoke('isGraphicsMenuConfigActivated'),
  toggleMLManagerConfig: () => ipcRenderer.invoke('toggleMLManagerConfig'),
  toggleGraphicsMenuConfig: () => ipcRenderer.invoke('toggleGraphicsMenuConfig'),
  chooseMLManager: (mlManager) => ipcRenderer.invoke('chooseMLManager', mlManager),
  chooseGraphicMenu: (graphicMenu) => ipcRenderer.invoke('chooseGraphicMenu', graphicMenu),
  saveMLManager: (name, directory) => ipcRenderer.invoke('saveMLManager', name, directory),
  saveGraphicMenu: (name, directory) => ipcRenderer.invoke('saveGraphicMenu', name, directory),
  chooseNewSimpleConfigDirectory: (title) => ipcRenderer.invoke('chooseNewSimpleConfigDirectory', title),
  deleteMLManager: (name) => ipcRenderer.invoke('deleteMLManager', name),
  deleteGraphicMenu: (name) => ipcRenderer.invoke('deleteGraphicMenu', name),
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
