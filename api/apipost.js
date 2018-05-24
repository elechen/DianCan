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
            var account = "order_" + params.account;
            var orders = params.orders;
            var mealid = params.mealid;
            var callback = function (err, replies) {
                if (err) {
                    cb(JSON.stringify({
                        data: err,
                        code: "FAIL"
                    }));
                } else {
                    cb(JSON.stringify({
                        data: "post order succ",
                        code: "SUCCESS"
                    }));
                }
            }
            db.hset(account, mealid, JSON.stringify(params), callback);
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
                if (err) {
                    cb(JSON.stringify({
                        data: err,
                        code: "FAIL"
                    }));
                } else {
                    cb(JSON.stringify({
                        data: "post menus succ",
                        code: "SUCCESS"
                    }));
                }
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

m.humans = function (req, cb) {
    var info = '';
    req.addListener('data', function (chunk) {
            info += chunk;
        })
        .addListener('end', function () {
            console.log(info);
            var params = JSON.parse(info);
            var humans = params.humans;
            var callback = function (err, replies) {
                if (err) {
                    cb(JSON.stringify({
                        data: err,
                        code: "FAIL"
                    }));
                } else {
                    cb(JSON.stringify({
                        data: "post humans succ",
                        code: "SUCCESS"
                    }));
                }
            }
            var kvlist = new Array();
            for (var key in humans) {
                var one = humans[key];
                kvlist.push(one.account);
                kvlist.push(JSON.stringify(one));
            }
            db.hmset("humans", kvlist, callback);
        })
}

m.login = function (req, cb) {
    var info = '';
    req.addListener('data', function (chunk) {
            info += chunk;
        })
        .addListener('end', function () {
            console.log(info);
            var params = JSON.parse(info);
            var account = params.account;
            var pwd = params.pwd;
            var callback = function (err, replies) {
                console.log(err, replies);
                if (replies) {
                    var human = JSON.parse(replies);
                    if (human.pwd === pwd) {
                        cb(JSON.stringify({
                            data: human,
                            code: "SUCCESS"
                        }));
                    } else {
                        cb(JSON.stringify({
                            data: "账号密码不匹配",
                            code: "FAIL"
                        }));
                    }
                } else {
                    cb(JSON.stringify({
                        data: '账号不存在',
                        code: "FAIL"
                    }));
                }

            };
            db.hget("humans", account, callback);
        })
}

exports.handle = handle;