const http = require("http");
const url = require("url");
const version = require("./../package.json").version;

let server = http.createServer(function(req, res) {
  const { query } = url.parse(req.url, true);
  const downloadUrl = query.os === "mac" ? "http://qiniu.ifengzp.com/super-helper/mac/super-helper-" + version + ".dmg" : "http://qiniu.ifengzp.com/super-helper/win/super-helper-" + version + ".exe ";
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(
    JSON.stringify({
      downloadUrl: query.version === version ? "" : downloadUrl
    })
  );
});
server.listen(9000, "127.0.0.1");
console.log("server is listening 9000");
