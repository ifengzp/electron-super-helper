const { ipcRenderer } = require("electron");
$(document).ready(function() {
  let editor = KindEditor.create("textarea.kindeditorSimple", {
    basePath: "./../lib/kindeditor/",
    bodyClass: "article-content",
    cssPath: "./../lib/zui-ui/css/zui.min.css",
    resizeType: 1,
    height: 280,
    allowPreviewEmoticons: false,
    allowImageUpload: false,
    items: [
      "fontname",
      "fontsize",
      "|",
      "forecolor",
      "hilitecolor",
      "bold",
      "italic",
      "underline",
      "removeformat",
      "|",
      "justifyleft",
      "justifycenter",
      "justifyright",
      "insertorderedlist",
      "insertunorderedlist"
    ]
  });

  $(".paste-area__preview").on("paste", function(event) {
    $("body").addClass("loading");
    ipcRenderer.send("send-ocr-event");
  });

  $(".paste-area__preview")
    .on("dragover", false)
    .on("drop", function(event) {
      let files =
        event.originalEvent.dataTransfer &&
        event.originalEvent.dataTransfer.files;
      if (!files) {
        $("#error-tip")
          .show()
          .delay(800)
          .fadeOut(500);
        $("#error-tip .content").html("没有文件");
        return;
      }
      if (files.length !== 1) {
        $("#error-tip")
          .show()
          .delay(800)
          .fadeOut(500);
        $("#error-tip .content").html("暂时不支持多文件上传");
        return;
      }
      if (files[0].type.indexOf("image") < 0) {
        $("#error-tip")
          .show()
          .delay(800)
          .fadeOut(500);
        $("#error-tip .content").html("请上传图片文件");
        return;
      }
      $("body").addClass("loading");
      ipcRenderer.send("send-ocr-event", files[0].path);
    });
  ipcRenderer.on("render-ocr-event", (event, res, path) => {
    $("body").removeClass("loading");
    let { words_result: list } = res;
    $(".paste-area__preview").html(
      "<img src='" + path + "' class='upload-image'>"
    );
    editor.html(list.map(item => "<p>" + item.words + "</p>").join(""));
  });
  ipcRenderer.on("render-ocr-error", (event, msg) => {
    $("body").removeClass("loading");
    $("#error-tip")
      .show()
      .delay(800)
      .fadeOut(500);
    $("#error-tip .content").html(msg || "解析文件出错，请重试");
  });
});
