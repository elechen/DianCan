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
        var data;
        if (err) {
            data = {
                code: "FAIL",
                data: err
            };
            cb(JSON.stringify(data));
        } else {
            for (var key in replies) {
                replies[key] = JSON.parse(replies[key]);
            }
            data = {
                code: "SUCCESS",
                data: replies
            };
            cb(JSON.stringify(data));
        }
    };
    db.hgetall("menus", callback);
}

m.humans = function (req, cb) {
    var callback = function (err, replies) {
        var data;
        if (err) {
            data = {
                code: "FAIL",
                data: err
            };
            cb(JSON.stringify(data));
        } else {
            for (var key in replies) {
                replies[key] = JSON.parse(replies[key]);
            }
            data = {
                code: "SUCCESS",
                data: replies
            };
            cb(JSON.stringify(data));
        }
    };
    db.hgetall("humans", callback);
};

m.order = function (req, cb) {
    var params = url.parse(req.url, true).query;
    var account = "order_" + params.account;
    var mealid = params.mealid;
    console.log(account, mealid);
    var callback = function (err, replies) {
        var data;
        console.log(err, replies);
        if (err) {
            data = {
                code: "FAIL",
                data: err
            };
        } else {
            data = {
                code: "SUCCESS",
                data: replies
            };
        }
        cb(JSON.stringify(data));
    };
    return db.hget(account, mealid, callback);
};

m.orders = function (req, cb) {
    var params = url.parse(req.url, true).query;
    var account = "order_" + params.account;
    var fromDate = new Date(parseInt(params.fromDate));
    var toDate = new Date(parseInt(params.toDate));
    console.log("fromDate", fromDate.toLocaleString());
    console.log("toDate", toDate.toLocaleString());
    var callback = function (err, replies) {
        var data;
        if (err) {
            data = {
                code: "FAIL",
                data: err
            };
        } else {
            var orders = {};
            for (var key in replies) {
                var order = JSON.parse(replies[key]);
                var date = new Date(order.mealid);
                // console.log("mealid", order.mealid, date.toLocaleString());
                if ((date >= fromDate) && (date <= toDate)) {
                    orders[key] = order;
                }
            }
            data = {
                code: "SUCCESS",
                data: orders
            };
        }
        cb(JSON.stringify(data));
    };
    return db.hgetall(account, callback);
};

exports.handle = handle;