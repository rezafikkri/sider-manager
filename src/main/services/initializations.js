import { BrowserWindow } from 'electron';

function initializeMainWindow(createMainWindow, mainWindowObj) {
  // close initilization window and show main window
  BrowserWindow.getFocusedWindow().close(); 
  mainWindowObj.mainWindow = createMainWindow();
  return true;
}

export {
  initializeMainWindow,
};
