const { ipcRenderer, shell } = require("electron");
const version = require("./../../package.json").version;

$(document).ready(function() {
  $("title").html("小工具箱 v" + version);
  $("#img2word").click(e => {
    ipcRenderer.send("createImg2wordWindow");
  });
  $("#pdf2img").click(e => {
    ipcRenderer.send("createPdf2imgWindow");
  });
  $("#extractFont").click(e => {
    ipcRenderer.send("createExtractFontWindow");
  });
  $(".report-btn").click(e => {
    e.preventDefault();
    shell.openExternal("https://github.com/ifengzp/electron-super-helper/issues");
  });
});

$.get(
  "http://super-helper.ifengzp.com/client/check_version",
  {
    version: version,
    os: process.platform === "win32" ? "win" : "mac"
  },
  res => {
    const { downloadUrl } = res;
    if (downloadUrl) {
      $("body").prepend(
        "<a id='downloadBtn' href=" +
          downloadUrl +
          ">检测到新版本，请点击下载</a>"
      );
      $("#downloadBtn").click(e => {
        e.preventDefault();
        shell.openExternal($("#downloadBtn").attr("href"));
      });
    }
  }
);
