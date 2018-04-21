const apiget = require("./apiget");
const apipost = require("./apipost");
const apidelete = require("./apidelete");

function GET(request, cb) {
  return apiget.handle(request, cb);
}

function POST(request, cb) {
  return apipost.handle(request, cb);
}

function DELETE(request, cb) {
  return apidelete.handle(request, cb);
}

exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
