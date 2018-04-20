const redis = require("redis");
const redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("error " + err);
});

//key加上前缀，以区分数据库
const dbName = "DB_DianCan_";
function _genKey(key) {
    return dbName + key;
}

function set(key, value, cb) {
    key = _genKey(key);
    return redisClient.set(key, value, cb);
}

function get(key, cb) {
    key = _genKey(key);
    return redisClient.get(key, cb);
}

function del(key, cb) {
    key = _genKey(key);
    return redisClient.del(key, cb);
}

function hset(key, field, value, cb) {
    key = _genKey(key);
    return redisClient.hset(key, field, value, cb);
}

function hdel(key, field, cb) {
    key = _genKey(key);
    return redisClient.hdel(key, field, cb);
}

function hget(key, field, cb) {
    key = _genKey(key);
    return redisClient.hget(key, field, cb);
}

function hgetall(key, cb) {
    key = _genKey(key);
    return redisClient.hgetall(key, cb);
}

function hmset(key, kvlist, cb) {
    key = _genKey(key);
    return redisClient.hmset(key, kvlist, cb)
}

exports.set = set;
exports.get = get;
exports.del = del;

exports.hset = hset;
exports.hget = hget;
exports.hdel = hdel;
exports.hgetall = hgetall;
exports.hmset = hmset;