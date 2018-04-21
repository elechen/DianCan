const url = require("url");

const db = require("../db");

var m = {};

function handle(req, cb) {
    var pathname = url.parse(req.url).pathname;
    var func = pathname.substring(1, pathname.length);
    if (typeof (m[func]) === "function") {
        m[func](req, cb);
        return true;
    } else {
        return false;
    }
}

m.order = function (req, cb) {
    var info = '';
    req.addListener('data', function (chunk) {
        info += chunk;
    })
        .addListener('end', function () {
            var params = JSON.parse(info);
            var pid = "order_" + params.pid;
            var orders = params.orders;
            var mealID = params.mealID;
            var callback = function (err, replies) {
              cb(JSON.stringify({ msg: "post orders succ" }));
            }
            db.hset(pid, mealID, JSON.stringify(params), callback);
        })
}

m.menus = function (req, cb) {
    var info = '';
    req.addListener('data', function (chunk) {
        info += chunk;
    })
        .addListener('end', function () {
            var params = JSON.parse(info);
            var menus = params.menus;
            var callback = function (err, replies) {
                cb(JSON.stringify({ msg: "post menus succ" }));
            }
            var kvlist = new Array();
            for (var key in menus) {
                var one = menus[key];
                kvlist.push(one.name);
                kvlist.push(JSON.stringify(one));
            }
            db.hmset("menus", kvlist, callback);
        })
}

exports.handle = handle;