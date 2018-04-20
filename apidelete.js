const url = require("url");

const db = require("./db");

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
            console.log(info)
            var pid = "order_" + params.pid;
            var mealID = params.mealID;
            console.log("delet order", params);
            var callback = function (err, replies) {
                console.log(err);
                console.log(replies);
                var msg;
                if (replies == 1) {
                    msg = { msg: "delete success" };
                } else {
                    msg = { msg: "delete failed" };
                }
                cb(JSON.stringify(msg));
            }
            return db.hdel(pid, mealID, callback);
        }
    )
    
}

exports.handle = handle;