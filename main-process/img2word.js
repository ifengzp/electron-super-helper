const { ipcMain, clipboard } = require("electron");
const AipOcrClient = require("aip-node-sdk").ocr;

const APP_ID = "10403470";
const API_KEY = "cf0iE3yKa2u4CFMpDzKwrfAC";
const SECRET_KEY = "3EQwCWo6Itm0QUCzx6KOoemFxnO4V13k";

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

ipcMain.on("send-ocr-event", event => {
  const image = clipboard.readImage("clipboard");
  const base64Img = image.toPNG().toString("base64");
  client.generalBasic(base64Img).then(res => {
    event.sender.send("render-ocr-event", res, image.toDataURL());
  });
});
