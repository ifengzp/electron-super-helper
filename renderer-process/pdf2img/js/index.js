$(document).ready(function() {
  let jpgBtn = new Btn("jpg");
  let pngBtn = new Btn("png");
  jpgBtn.disable();
  pngBtn.disable();

  $('#file-btn').on('change', function(e) {
    const file = e.target.files[0]
    if (file.length === 0) {
        alert('出错了, 文件不能为空')
        return
    }
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(e) {
      let typedarray = new Uint8Array(e.target.result);
      PDFJS.getDocument(typedarray).then(function(pdf) {
        if (pdf) {
          $('#main_btn').text(file.name).css('font-size', '13px');
          jpgBtn.clickable(function() {
            conversion('jpg', pdf)
          });
          pngBtn.clickable(function() {
            conversion('png', pdf)
          });
        }
      });
    };
  })

  function conversion(type, pdf) {
    let container = document.getElementById('container'),
        pdfDoc = pdf,
        scale = 1,
        numPages = pdfDoc.numPages;
    jpgBtn.ongoing();
    pngBtn.ongoing();

    let readQueue = [];
    for (let i = 0; i < numPages; i++) {
      readQueue.push(pdfDoc.getPage(i + 1));
    }
    Promise.all(readQueue).then((arr) => {
      let renderQueue = arr.map((item, idx) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let viewport = item.getViewport(scale)
        container.append(canvas);
        canvas.id = idx;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        return item.render({
          canvasContext: ctx,
          viewport
        }).promise;
      })
      console.log('renderQueue', renderQueue)
      let allPagesNum = renderQueue.length
      let finishPagesNum = 0
      renderQueue.forEach(item => {
        item.then(res => {
          finishPagesNum += 1
          $('#main_btn').text(parseInt(finishPagesNum * 100 / allPagesNum) + '%').css({
            'font-size': '20px',
            'padding': '0 4px'
          })
          finishPagesNum >= allPagesNum && download(type)
        }).catch(err => {
          finishPagesNum += 1
          $('#main_btn').text(parseInt(finishPagesNum * 100 / allPagesNum) + '%').css({
            'font-size': '20px',
            'padding': '0 4px'
          })
          finishPagesNum >= allPagesNum && download(type)
        })
      })
    })
  }
});

function download(type) {
  let typeStr = type == png ? "image/png" : 'image/jpg'
  console.log(type, typeStr)
  let zip = new JSZip();
  let images = zip.folder("images");
  $('#container canvas').each(function(idx) {
    images.file("pic-"+idx+"." + type, base64toBlob($(this)[0].toDataURL(typeStr, 0.6)), {
        base64: true
    });
  })
  zip.generateAsync({
        type: "blob"
    }).then(function(content) {
        saveAs(content, "pdftoimages.zip");
    });
}

function base64toBlob(dataurl){
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}