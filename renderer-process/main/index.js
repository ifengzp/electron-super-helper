const { ipcRenderer } = require("electron");
$(document).ready(function() {
  $("#img2word").click(e => {
    ipcRenderer.send("createImg2wordWindow");
  });
});