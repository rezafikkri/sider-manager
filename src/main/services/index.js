import { BrowserWindow } from 'electron';

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

export {
  handleSetTitle,
};
