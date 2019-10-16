/* eslint-disable */
$(document).ready(function() {
  $("#selectAll").on("click", function() {
    const flag = $(this).get(0).checked
    $('input:checkbox').each(function() {
      $(this).get(0).checked = flag
   });
  })
  $("#file-btn").on("change", function(e) {
    const file = e.target.files[0];
    if (file.length === 0) {
      alert("出错了, 文件不能为空");
      return;
    }
    $(".my-loading").show()
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(e) {
      let typedarray = new Uint8Array(e.target.result);
      PDFJS.getDocument(typedarray).then(function(pdf) {
        if (pdf) {
          $(".header__info-name").html(file.name)
          $(".header__info-size").html(file.size + '字节')
          $(".header__info-path").html(file.path)
          $(".header__info-pages").html(pdf.numPages + "页")
          $(".all-select-btn").show()
          $(".header__drop").html('<div class="reset-btn"><button class="btn btn-primary" id="reset-btn" type="button">重传文件</button></div>')
          $("#reset-btn").on("click", function() {
            window.location.reload()
          })
          conversion(pdf)
        }
      });
    };
  });

  function conversion(pdf) {
    let container = document.getElementById("container"),
      pdfDoc = pdf,
      scale = 1,
      numPages = pdfDoc.numPages;

    let readQueue = [];
    for (let i = 0; i < numPages; i++) {
      readQueue.push(pdfDoc.getPage(i + 1));
    }
    Promise.all(readQueue).then(arr => {
      let renderQueue = arr.map((item, idx) => {
        let canvas = document.createElement("canvas");
        canvas.setAttribute('class', 'img-thumbnail');
        let ctx = canvas.getContext("2d");
        let viewport = item.getViewport(scale);
        let div = document.createElement("div");
        div.setAttribute('class', 'my-content__item');
        div.append(canvas)
        let newDiv = document.createElement("div");
        newDiv.innerHTML = '<div class="my-content__item-desc"><div class="checkbox"><label><input value='+idx+' checked type="checkbox"> pic-'+idx+'</label></div></div>';
        div.append(newDiv)
        container.append(div);
        canvas.id = idx;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        return item.render({
          canvasContext: ctx,
          viewport
        }).promise;
      });
      console.log("renderQueue", renderQueue);
      let allPagesNum = renderQueue.length;
      let finishPagesNum = 0;
      renderQueue.forEach(item => {
        item
          .then(res => {
            finishPagesNum += 1;
            if (finishPagesNum >= allPagesNum) {
              $(".my-loading").delay(800).hide()
              $("#jpg").removeAttr("disabled").removeClass("disabled").on("click", () => download("jpg"))
              $("#png").removeAttr("disabled").removeClass("disabled").on("click", () => download("png"))
            }
          })
          .catch(err => {
            finishPagesNum += 1;
            if (finishPagesNum >= allPagesNum) {
              $(".my-loading").delay(800).hide()
              $("#jpg").removeAttr("disabled").removeClass("disabled").on("click", () => download("jpg"))
              $("#png").removeAttr("disabled").removeClass("disabled").on("click", () => download("png"))
            }
          });
      });
    });
  }
});
let isDownloading = false;
function download(type) {
  if (isDownloading) return;
  isDownloading = true;
  $(".my-loading").show()
  let typeStr = type == png ? "image/png" : "image/jpg";
  let zip = new JSZip();
  let images = zip.folder("images");
  let chooseArr = []
  $('input:checkbox:checked').each(function() {
     const idx = +$(this).val()
     idx > -1 && chooseArr.push(idx)
  });
  console.log(chooseArr)
  $("#container canvas").each(function(idx) {
    if (chooseArr.indexOf(idx) < 0) return
    images.file(
      "pic-" + idx + "." + type,
      base64toBlob($(this)[0].toDataURL(typeStr, 0.6)),
      {
        base64: true
      }
    );
  });
  zip
    .generateAsync({
      type: "blob"
    })
    .then(function(content) {
      $(".my-loading").hide()
      isDownloading = false;
      saveAs(content, "pdftoimages-"+type+".zip");
    });
}

function base64toBlob(dataurl) {
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
