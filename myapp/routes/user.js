var express = require('express');
var router = express.Router();
var {get_connection,do_sql_query} = require('../utils/funcs');
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
	get_connection()
		.then(function(conn) {
			let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
			return do_sql_query(conn,sql);
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
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
			var sql = 'insert into users values (' + values.join(',') + ')';
			return do_sql_query(conn,sql);
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
			resbody.status = "SUCCESS.";              // 成功注册
			resbody.results = req.body;
			req.session.islogin = true;
			req.session.nickname = req.body.nickname;
			req.session.realname = req.body.realname;
			req.session.email = req.body.email;
			console.log('[res]', resbody);
			conn.end();
			res.send(JSON.stringify(resbody));
		})
		.catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/login', function(req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
	console.log("[post] login\n", req.body);
	let nickname = req.body.nickname;
	let password = req.body.password;
	get_connection()
		.then(function(conn) {
			let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(nickname);
			return do_sql_query(conn,sql);
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
			let resbody = {};
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
						status : 'FAILED.',
						details : 'WRONG_PASSWORD.'
					});
				}
				else {
					req.session.nickname = user.nickname;
					req.session.realname = user.realname;
					req.session.user_id = user.id;
					req.session.email = user.email;
					conn.end();
					res.send({
						status : 'SUCCESS.',
						details : 'SUCCESS.',
						results : user
					});
				}
			}
		})
		.catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

module.exports = router;
