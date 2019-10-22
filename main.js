require("update-electron-app")({
  repo: "git@github.com:ifengzp/electron-super-helper.git",
  updateInterval: "1 hour",
  logger: require("electron-log")
});

const { app, BrowserWindow, ipcMain } = require("electron");
const Img2wordWindow = require("./main-process/img2word");
const Pdf2imgWindow = require("./main-process/pdf2img");

const path = require("path");
const glob = require("glob");

let mainWindow = null;
let img2wordWindow = null;
let pdf2imgWindow = null;

function initialize() {
  makeSingleInstance();
  loadMainProcess();
  initIpc();

  function createMainWindow() {
    mainWindow = new BrowserWindow({
      width: 256,
      height: 256,
      resizable: false,
      fullscreen: false,
      maximizable: false,
      fullscreenable: false,
      // frame: false,
      // transparent: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("./renderer-process/main/index.html");

    // mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
      app.quit();
    });
  }

  app.on("ready", createMainWindow);
  app.on("activate", () => {
    if (mainWindow === null) createMainWindow();
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

function makeSingleInstance() {
  app.requestSingleInstanceLock();
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Require each JS file in the main-process dir
function loadMainProcess() {
  const files = glob.sync(path.join(__dirname, "main-process/**/*.js"));
  files.forEach(file => {
    require(file);
  });
}

function initIpc() {
  ipcMain.on("createImg2wordWindow", event => {
    if (this.img2wordWindow && !this.img2wordWindow.win.isDestroyed()) {
      this.img2wordWindow.win.focus();
    } else {
      this.img2wordWindow = new Img2wordWindow();
    }
  });
  ipcMain.on("createPdf2imgWindow", event => {
    if (this.pdf2imgWindow && !this.pdf2imgWindow.win.isDestroyed()) {
      this.pdf2imgWindow.win.focus();
    } else {
      this.pdf2imgWindow = new Pdf2imgWindow();
    }
  });
}

initialize();
