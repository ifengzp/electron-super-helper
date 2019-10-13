const { ipcMain, clipboard, nativeImage } = require("electron");
const AipOcrClient = require("aip-node-sdk").ocr;

const APP_ID = "17516130";
const API_KEY = "PUMypDGa2fgwjZBWjmj6Sbuh";
const SECRET_KEY = "0cxR78KhuOsajaNL1RVNdRQ2jxSroTOo";

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

ipcMain.on("send-ocr-event", (event, path) => {
  const image = path ? nativeImage.createFromPath(path) : clipboard.readImage("clipboard");
  if (image) {
    const base64Img = image.toPNG().toString("base64");
    client.generalBasic(base64Img).then(res => {
      event.sender.send("render-ocr-event", res, image.toDataURL());
    });
  } else {
    event.sender.send("render-ocr-error");
  }
});
