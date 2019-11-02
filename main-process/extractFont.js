const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

module.exports = class img2wordWindow {
  constructor() {
    this.win = null;
    this.createWindow();
    this.initIPC();
    this.initWindowEvent();
  }

  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: false,
      fullscreen: false,
      maximizable: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        devTools: true
      }
    });
    this.win.loadURL(
      path.join(
        "file://",
        __dirname,
        "./../renderer-process/extractFont/index.html"
      )
    );
    this.win.setMenuBarVisibility(false);
    this.win.webContents.openDevTools();
  }

  initIPC() {
    ipcMain.on("font-source", (event, path) => {
      console.log(path);
    });
  }

  initWindowEvent() {
    this.win.setFullScreenable(false);
    this.win.setMaximizable(false);
    this.win.isResizable(false);
    this.win.on("closed", () => {
      ipcMain.removeAllListeners("font-source");
    });
  }

  initWindowWebContent() {
    this.win.webContents.on("did-finish-load", () => {
      this.win.webContents.setZoomFactor(1);
      this.win.webContents.setVisualZoomLevelLimits(1, 1);
      this.win.webContents.setLayoutZoomLevelLimits(0, 0);
    });
  }

  close() {
    this.win.close();
  }
};
