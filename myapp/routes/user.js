var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;

router.get('/session', function (req, res, next) {
    console.log('[get] is login\n', req.body);
	if (typeof(req.session) == 'undefined')
		req.session = {};
    res.send(JSON.stringify(req.session));
});

router.post('/register', function (req, res, next) {	// 响应注册，并进行合法判断
    console.log("[post] register\n", req.body);
	if (typeof(req.session.user_id) != 'undefined') {
		res.send(JSON.stringify({
			status : 'FAILED.',
			details : 'ALREADY_LOGIN.'
		}));
		return ;
	}
    var resp = {
        status: '',
        results: {},
    };
    var sql = 'SELECT * FROM users WHERE nickname = "' + req.body.nickname + '"';
    var found = false;
	//判重
	do_sql_query(sql, function (result) {
		if (result.results.length != 0) {
			res.send(JSON.stringify({
				status : 'FAILED.',
				details : "DUPLICATION_OF_REGISTRATION."
			}));
			return ;
		} else {
			var values = [];
			var items = ['id', 'nickname', 'realname', 'role', 'motto', 'registration_date', 'password'];
			for (var item of items) {
				if (req.body[item] === undefined || req.body[item] === null || req.body[item] === '')
					values.push('null');
				else
					values.push('\'' + req.body[item] + '\'');
			}
			var sql = 'insert into users values (' + values.join(',') + ')';
			// console.log(sql);
			do_sql_query(sql, function (result) {
				if (result.status === 'SUCCESS.') {
					resp.status = "SUCCESS.";              // 成功注册
					resp.results = req.body;
					req.session.islogin = true;
					req.session.nickname = req.body.nickname;
					req.session.realname = req.body.realname;
				}
				else {
					resp.status = 'FAILED.';
					resp.details = result.details;
				}
				res.send(JSON.stringify(resp));
				console.log("[res] ", resp);
			});
		}
	});
});

router.post('/login', function(req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
	console.log("[post] login\n", req.body);
	var nickname = req.body.nickname;
	var password = req.body.password;
	var sql = 'SELECT * FROM users WHERE nickname = "' + nickname + '"';
	do_sql_query(sql, function (result) {
		if (result.length == 0) {
			res.send(JSON.stringify({
				status : 'FAILED.',
				details : 'USER_NOT_FOUND.'
			}));
			return ;
		}
		var user = result.results[0];
		if (req.body.password != user.password) {
			res.send(JSON.stringify({
				status : 'FAILED.',
				details : 'WRONG_PASSWORD.'
			}));
			return ;
		}

		req.session.nickname = user.nickname;
		req.session.realname = user.realname;
		req.session.user_id = user.id;

		res.send(JSON.stringify({
			status : 'SUCCESS.',
			details : 'SUCCESS.',
			results : user
		}));
		return ;
	});
	console.log(next);
});

module.exports = router;
