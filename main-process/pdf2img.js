const { BrowserWindow } = require("electron");
const path = require("path");

module.exports = class pdf2imgWindow {
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
        nodeIntegration: true
      }
    });
    this.win.loadURL(
      path.join(
        "file://",
        __dirname,
        "./../renderer-process/pdf2img/index.html"
      )
    );
    this.win.setMenuBarVisibility(false);
    this.win.webContents.openDevTools();
  }

  initIPC() {
  }

  initWindowEvent() {
    this.win.setFullScreenable(false);
    this.win.setMaximizable(false);
    this.win.isResizable(false);
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
