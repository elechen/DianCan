const url = require('url');
const api = require("./api");

function route(request, cb) {
  var pathname = url.parse(request.url).pathname;
  console.log(request.method, pathname);
  if (pathname == "/favicon.ico") {
    cb(JSON.stringify({ msg: "favicon.ico" }));
    return true;
  }
  if(pathname == "/"){
    cb(JSON.stringify({ msg: "There is NOTHING here" }));
    return true;
  }
  if (typeof (api[request.method]) === "function") {
    if (api[request.method](request, cb)) {
      return true;
    }
  }
  cb(JSON.stringify({ msg: request.method + " 404 Page Not Found " + pathname}));
  return true;
}

exports.route = route;