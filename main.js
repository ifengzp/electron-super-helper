// require("update-electron-app")({
//   repo: "github-user/repo",
//   updateInterval: "1 hour",
//   logger: require("electron-log")
// });

const { app, BrowserWindow } = require("electron");
const path = require("path");
const glob = require("glob");

let mainWindow = null;

function initialize() {
  makeSingleInstance();
  loadMainProcess();

  function createMainWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: false,
      fullscreen: false,
      maximizable: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true
      }
      // titleBarStyle: "hidden"
    });
    mainWindow.loadFile("./renderer-process/index.html");

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

// Require each JS file in the main-process dir
function loadMainProcess() {
  const files = glob.sync(path.join(__dirname, "main-process/**/*.js"));
  files.forEach(file => {
    require(file);
  });
}
initialize();
