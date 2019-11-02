const { dialog } = require("electron").remote;
const Fontmin = require("fontmin");
const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");
let srcPath = "";
let workingFlag = false;

$(document).ready(function() {
  KindEditor.create("textarea.editorLeft", {
    basePath: "./../../lib/kindeditor/",
    bodyClass: "editorLeftContent",
    cssPath: "./../../lib/zui-ui/css/zui.min.css",
    cssData: "body { font-size: 17px; }",
    resizeType: 0,
    height: 370,
    allowPreviewEmoticons: false,
    allowImageUpload: false,
    items: ["fontsize"],
    afterChange: function() {
      $(".contrast-content").html(this.html());
    },
    afterCreate: function() {
      this.html(
        "《春晓》<br/>春眠不觉晓<br/>处处闻啼鸟<br/>夜来风雨声<br/>花落知多少"
      );
    }
  });

  $("#file-btn").on("change", function(e) {
    if (workingFlag) return;
    const file = e.target.files[0];
    if (file.length === 0 || String(file.name).indexOf(".ttf") < 0) {
      $(".fontPath").text(" ");
      $("#error-tip")
        .show()
        .delay(800)
        .fadeOut(500);
      $("#error-tip .content").html("上传字体文件有误");
      return;
    }
    const font = new FontFace("yourFont", "url('" + file.path + "')");
    font.load().then(function(loaded) {
      document.fonts.add(loaded);
      srcPath = file.path;
      $(".fontPath").text("当前字体路径： " + file.path);
      $(".contrast-content").css("fontFamily", "yourFont");
    }).catch(err => {
      $("#error-tip")
        .show()
        .delay(800)
        .fadeOut(500);
      $("#error-tip .content").html("上传字体文件有误");
      console.log(err);
    });
  });

  $("#extract").on("click", function() {
    if (workingFlag) return;
    workingFlag = true;
    dialog.showSaveDialog().then(res => {
      if (res.canceled) return;
      const text = $(".contrast-content").text();
      const fontmin = new Fontmin()
        .src(srcPath || path.join(__filename, "../font-default.ttf"))
        .use(
          Fontmin.glyph({
            text: text
          })
        )
        .use(Fontmin.ttf2eot({ clone: true }))
        .use(Fontmin.ttf2woff({ clone: true }))
        .use(Fontmin.ttf2svg({ clone: true }))
        .use(Fontmin.css({ base64: true }))
        .dest(res.filePath);

      $(".my-loading").show();
      fontmin.run(function(err, files) {
        let fontFamily = "webfont";
        workingFlag = false;
        $(".my-loading")
          .delay(800)
          .hide();
        if (err) {
          $("#error-tip")
            .show()
            .delay(800)
            .fadeOut(500);
          $("#error-tip .content").html(err || "解析文件出错，请重试");
          return;
        }
        try {
          fontFamily = files[0].basename.split(".")[0];
        } catch (error) {
          console.log(error);
        }
        nunjucks.render(path.join(__filename, "../template.html"), {
          fontFamily: fontFamily,
          text: text
        }, function(err, str) {
          if (err) return;
          fs.writeFileSync(path.join(res.filePath, "./demo.html"), str, "utf8");
        });
        console.log("done");
      });
    });
  });
});
