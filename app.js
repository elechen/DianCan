const http = require('http');
const router = require("./router");

const hostname = '127.0.0.1';
const port = 3333;

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "application/json"});
  var cb = function(sJson)
  {
    response.end(sJson);
  }
  router.route(request, cb);
}

const server = http.createServer(onRequest);

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});