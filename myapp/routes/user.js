var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;
var mysql=require('mysql');

router.get('/session', function (req, res, next) {	// 判断用户是否登录
    console.log('[get] session\n', req.body);
	if (typeof(req.session) === 'undefined')
		req.session = {};
    console.log('[res]', req.session);
	res.send(JSON.stringify(req.session));
});

router.post('/register', function (req, res, next) {	// 响应注册，并进行合法判断
    console.log("[post] register\n", req.body);
    var resbody = {};
	if (typeof(req.session.user_id) !== 'undefined') {  // 已登录
		resbody = {
			status : 'FAILED.',
			details : 'ALREADY_LOGIN.'
		};
        console.log('[res]', resbody);
        res.send(JSON.stringify(resbody));
        return;
	}
	var sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
    do_sql_query(sql, function (result) {
        if (result.results.length !== 0) {    //判重
            resbody = {
                status: 'FAILED.',
                details: "DUPLICATION_OF_REGISTRATION."
            };
            console.log('[res]', resbody);
            res.send(JSON.stringify(resbody));
            return;
        }
        // 不重复
        var values = [];
        var items = ['nickname', 'realname', 'role', 'email', 'registration_date', 'password'];
        for (var item of items) {
            if (req.body[item] === undefined || req.body[item] === null || req.body[item] === '')
                values.push('null');
            else{
                if(item === 'registration_date') {
                    values.values.push('\'' + Date.now() + '\'');
                }
                else {
                    values.push('\'' + req.body[item] + '\'');
                }
            }
        }
        for(var value of values) {
            value = mysql.escape(value);
        }
        var sql = 'insert into users (' + items.join(',') + ') values (' + values.join(',') + ')';
        do_sql_query(sql, function (result) {
            if (result.status === 'SUCCESS.') {
                resbody.status = "SUCCESS.";              // 成功注册
                resbody.results = req.body;
                req.session.islogin = true;
                req.session.nickname = req.body.nickname;
                req.session.realname = req.body.realname;
                req.session.email = req.body.email;
            }
            else {
                resbody.status = 'FAILED.';
                resbody.details = result.details;
            }
            console.log('[res]', resbody);
            res.send(JSON.stringify(resbody));
        });
    });
});

router.post('/login', function(req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
	console.log("[post] login\n", req.body);
	var nickname = req.body.nickname;
	var password = req.body.password;
	var sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(nickname);
	do_sql_query(sql, function (result) {
		var resbody = {};
		if (result.results.length === 0) {
            resbody = {
                status: 'FAILED.',
                details: 'USER_NOT_FOUND.'
            };
		}
		else {
            var user = result.results[0];
            console.log('Found:', user);
            if (password !== user.password) {
                resbody = {
                    status : 'FAILED.',
                    details : 'WRONG_PASSWORD.'
                };
            }
            else {
                req.session.nickname = user.nickname;
                req.session.realname = user.realname;
                req.session.user_id = user.id;
                req.session.email = user.email;

                resbody = {
                    status : 'SUCCESS.',
                    details : 'SUCCESS.',
                    results : user
                };
            }
        }
        console.log('[res]', resbody);
		res.send(JSON.stringify(resbody));
	});
	// console.log(next);
});

module.exports = router;
