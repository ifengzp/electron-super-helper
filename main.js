// require("update-electron-app")({
//   repo: "github-user/repo",
//   updateInterval: "1 hour",
//   logger: require("electron-log")
// });

const { app, BrowserWindow } = require("electron");

let mainWindow = null;

function initialize() {
  makeSingleInstance();

  function createMainWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadFile("index.html");

    mainWindow.webContents.openDevTools();

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

initialize();
