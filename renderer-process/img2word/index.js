const { ipcRenderer } = require("electron");

document.addEventListener("paste", function(event) {
  ipcRenderer.send("send-ocr-event");
  ipcRenderer.on("render-ocr-event", (event, res, path) => {
    let { words_result: list } = res;
    $("#preview").html("<img src='" + path + "' class='upload-image'>");
    $(".showResult").empty();
    $(".showResult").append(list.map(item => "<p>" + item.words + "</p>"));
    console.log(res);
  });
});
