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

m.menus = function (req, cb) {
    var callback = function (err, replies) {
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
    var callback = function (err, replies) {
        cb(replies);
    }
    return db.hget(pid, mealID, callback);
}

m.orders = function (req, cb) {
    var params = url.parse(req.url, true).query;
    var pid = "order_" + params.pid;
    var fromDate = new Date(parseInt(params.fromDate));
    var toDate = new Date(parseInt(params.toDate));
    console.log("fromDate",  fromDate.toLocaleString());
    console.log("toDate", toDate.toLocaleString());
    var callback = function (err, replies) {
        var orders = {};
        for(k in replies){
            var order = JSON.parse(replies[k]);
            var date = new Date(order.mealID);
            console.log("mealID", order.mealID, date.toLocaleString());
            if ((date >= fromDate) && (date <= toDate))
            {
                orders[k] = order;
            }
        }
        cb(JSON.stringify(orders));
    }
    return db.hgetall(pid, callback);
}

exports.handle = handle;