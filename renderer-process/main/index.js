const { ipcRenderer } = require("electron");
$(document).ready(function() {
  $("#img2word").click(e => {
    ipcRenderer.send("createImg2wordWindow");
  });
  $("#pdf2img").click(e => {
    ipcRenderer.send("createPdf2imgWindow");
  });
  $("#extractFont").click(e => {
    ipcRenderer.send("createExtractFontWindow");
  });
});
