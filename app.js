const http = require('http');
const router = require("./router");

const hostname = '0.0.0.0';
const port = 3333;

function onRequest(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
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