const { BrowserWindow, ipcMain, clipboard, nativeImage } = require("electron");
const AipOcrClient = require("aip-node-sdk").ocr;
const path = require("path");

const APP_ID = "17516130";
const API_KEY = "PUMypDGa2fgwjZBWjmj6Sbuh";
const SECRET_KEY = "0cxR78KhuOsajaNL1RVNdRQ2jxSroTOo";

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
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
        nodeIntegration: true
      }
    });
    this.win.loadURL(
      path.join(
        "file://",
        __dirname,
        "./../renderer-process/img2word/index.html"
      )
    );
    this.win.setMenuBarVisibility(false);
    this.win.webContents.openDevTools();
  }

  initIPC() {
    ipcMain.on("send-ocr-event", (event, path) => {
      const image = path
        ? nativeImage.createFromPath(path)
        : clipboard.readImage("clipboard");
      if (image.isEmpty()) {
        event.sender.send("render-ocr-error", "请上传图片文件");
      } else {
        const base64Img = image.toPNG().toString("base64");
        client.generalBasic(base64Img).then(res => {
          if (res.error_code && res.error_msg) {
            event.sender.send("render-ocr-error", res.error_msg);
          } else {
            event.sender.send("render-ocr-event", res, image.toDataURL());
          }
        });
      }
    });
  }

  initWindowEvent() {
    this.win.setFullScreenable(false);
    this.win.setMaximizable(false);
    this.win.isResizable(false);
    this.win.on("closed", () => {
      ipcMain.removeAllListeners("send-ocr-event");
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
