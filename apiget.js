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

m.menus = function (req, cb) {
    var callback = function (err, replies) {
        console.log(err);
        console.log(replies);
        for(var key in replies)
        {
            replies[key] = JSON.parse(replies[key])
        }
        cb(JSON.stringify(replies));
    };
    db.hgetall("menus", callback);
}

m.order = function (req, cb) {
    var params = url.parse(req.url, true).query;
    var pid = "order_" + params.pid;
    var mealID = params.mealID;
    console.log("get order", params);
    var callback = function (err, replies) {
        console.log(err);
        console.log(replies);
        cb(replies);
    }
    return db.hget(pid, mealID, callback);
}

m.orders = function (req, cb) {
    var params = url.parse(req.url, true).query;
    var pid = "order_" + params.pid;
    var fromDate = params.fromDate;
    var toDate = params.toDate;
    var callback = function (err, replies) {
        console.log(err);
        console.log(typeof(replies));
        for(k in replies){
            replies[k] = JSON.parse(replies[k]);
        }
        cb(JSON.stringify(replies));
    }
    return db.hgetall(pid, callback);
}

exports.handle = handle;