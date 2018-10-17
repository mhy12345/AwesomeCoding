var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;

router.get('/session', function (req, res, next) {	// 判断用户是否登录
    var res_body = {
        status: 'SUCCESS.',
        details: 'SUCCESS.',
    };
	console.log('[get] session\n', req.body);
	if (typeof(req.session) === 'undefined') {
        req.session = {};
    }
    else {
        res_body = req.session;
        res_body.status = 'SUCCESS.';
        res_body.details = 'SUCCESS.';
    }
	console.log('[res]', res_body);
	res.send(JSON.stringify(res_body));
});

router.post('/register', function (req, res, next) {	// 响应注册，并进行合法判断
    console.log("[post] register\n", req.body);
    var res_body = {};
    if (typeof(req.session.user_id) !== 'undefined') {  // 已登录
        res_body = {
            status: 'FAILED.',
            details: 'ALREADY_LOGIN.'
        };
        console.log('[res]', res_body);
        res.send(JSON.stringify(res_body));
        return;
    }
    getConnection().
        then(function (conn) {
            let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            if (sql_res.results.length !== 0) {    //判重
                conn.end();
                return Promise.reject({
                    status: 'FAILED.',
                    details: 'DUPLICATION_OF_REGISTRATION.'
                });
            }
            // 不重复
            var values = [];
            var items = ['id', 'email', 'nickname', 'realname', 'role', 'email', 'registration_date', 'password'];
            for (var item of items) {
                if (req.body[item] === undefined || req.body[item] === null || req.body[item] === '')
                    values.push('null');
                else {
                    if (item === 'registration_date') {
                        values.values.push('\'' + Date.now() + '\'');
                    }
                    else {
                        values.push('\'' + req.body[item] + '\'');
                    }
                }
            }
            for (var value of values) {
                value = mysql.escape(value);
            }
            var sql = 'insert into users values (' + values.join(',') + ')';
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            res_body.status = "SUCCESS.";              // 成功注册
            let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            if (sql_res.results.length <= 0) {
                conn.end();
                return new Promise.reject({
                    status: 'FAILED.',
                    details: 'USER_INFO_LOST.'
                });
            }
            let user = sql_res.results[0];
            req.session.nickname = user.nickname;
            req.session.realname = user.realname;
            req.session.role = user.role;
            req.session.email = user.email;
            req.session.user_id = user.id;
            res_body.results = req.session;
            console.log('[res]', res_body);
            conn.end();
            res.send(JSON.stringify(res_body));
        }).
        catch(function (sql_res) {
            res.send(JSON.stringify(sql_res));
        });
});

router.post('/login', function (req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
    console.log("[post] login\n", req.body);
    let nickname = req.body.nickname;
    let password = req.body.password;
    getConnection().
        then(function (conn) {
            let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(nickname);
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            if (sql_res.results.length === 0) {
                conn.end();
                return Promise.reject({
                    status: 'FAILED.',
                    details: 'USER_NOT_FOUND.'
                });
            }
            else {
                let user = sql_res.results[0];
                console.log('Found:', user);
                if (password !== user.password) {
                    conn.end();
                    return Promise.reject({
                        status: 'FAILED.',
                        details: 'WRONG_PASSWORD.'
                    });
                }
                else {
                    delete user.password;   // ensure safety
                    req.session.nickname = user.nickname;
                    req.session.realname = user.realname;
                    req.session.role = user.role;
                    req.session.user_id = user.id;
                    req.session.email = user.email;
                    conn.end();
                    res.send({
                        status: 'SUCCESS.',
                        details: 'SUCCESS.',
                        results: user
                    });
                }
            }
        }).
        catch(function (sql_res) {
            res.send(JSON.stringify(sql_res));
        });
});

router.get('/logout', function (req, res, next) {
    console.log('[get] logout\n', req.body);
    var res_body = {
        status: '',
        details: '',
    };
    if (typeof(req.session) === 'undefined') {
        res_body.status = 'FAILED.';
        res_body.details = 'USER_NOT_ONLINE.';
    }
    else {
        req.session.destroy((err) => {
            console.log('Session Destroyed');
            if (err) console.log(err);
        });
        res_body.status = 'SUCCESS.';
        res_body.details = 'SUCCESS.';
    }
    console.log('[res]', res_body);
    res.send(JSON.stringify(res_body));
});

router.post('/change', function (req, res, next) {  // 响应设置个人信息
    console.log('[post] change\n', req.body);
    var res_body = {
        status: '',
        details: '',
    };
    if (typeof(req.session) === 'undefined') {      // user offline
        res_body.status = 'FAILED.';
        res_body.details = 'USER_NOT_ONLINE.';
        console.log('[res]', res_body);
        res.send(JSON.stringify(res_body));
        return;
    }
    getConnection().
        then(function (conn) {
            let sql = "UPDATE users SET ";
            let arr = [];
            for (let item in req.body) {
                if (req.body[item])
                    arr.push(item + ' = \'' + req.body[item] + '\'');
            }
            sql += arr.join(',');
            sql += " WHERE id = " + req.session.user_id;
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            let sql = 'SELECT * FROM users WHERE id = ' + req.session.user_id;
            return doSqlQuery(conn, sql);
        }).
        then(function (packed) {
            let {conn, sql_res} = packed;
            res_body.results = sql_res.results[0];
            delete res_body.results.password;
            res_body.status = 'SUCCESS.';
            console.log(res_body);
            res.send(JSON.stringify(res_body));
            conn.end();
            console.log('[res]', res_body);
        }).
        catch(function (sql_res) {
            console.log('!!!!', sql_res);
            res.send(JSON.stringify(sql_res, null, 3));
        });
});

module.exports = router;
