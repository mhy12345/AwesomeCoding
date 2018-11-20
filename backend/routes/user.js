var user_verification_codes = {};
const axios = require('axios');

const express = require('express');
var router = express.Router();
const mysql = require('mysql');

const doSqlQuery = require('../utils/funcs').doSqlQuery;
const getConnection = require('../utils/funcs').getConnection;
const updateSocketSession = require('../utils/global').updateSocketSession;

const log4js = require("log4js");
const log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
const logger = log4js.getLogger('log_file');

const fixed_items = ['id', 'nickname', 'role', 'registration_date'];	// 不允许用户修改的表项，后期加入email?

function updateSession(session, user) {
	/*
	 * all key-values in session (7)
	 */
	session.nickname = user.nickname;
	session.realname = user.realname;
	session.role = user.role;
	session.user_id = user.id;
	session.email = user.email;
	session.phone = user.phone;
	session.motto = user.motto;
	updateSocketSession(session);	// session 同步到 socket.handshake.session
}

router.get('/session', function (req, res, next) {	// 判断用户是否登录
	logger.debug('[get] session\n', req.body);
	let res_body = req.session;
	res_body.status = 'SUCCESS.';
	logger.debug('[res]', res_body);
	res.send(JSON.stringify(res_body));
});

router.post('/verification', function (req, res, next) {	// 让后端程序发送验证码
	console.log('sending sms...');
	console.log(req.body);
	var code_generated = '';
	for (let i = 0; i < 6; i++) {
		code_generated += Math.ceil(Math.random() * 9);
	}

	let url = "https://open.ucpaas.com/ol/sms/sendsms";

	axios.post(url, {
		"sid": "55d17519129b8973ea369b5ba8f14f4d", // const
		"token": "43eee5a8cff8d6fd6f54ad612819b466", // const
		"appid": "de5779c82e844993b4f28470cf545d77", // const
		"templateid": "388909", // const
		"param": code_generated,
		"mobile": req.body.number
	}).
		then(() => {
			user_verification_codes[req.body.number] = +code_generated;
			let res_body = req.session;
			res_body.status = 'SUCCESS.';
			// res_body.code_generated = code_generated;
			res.send(JSON.stringify(res_body));
		}).
		catch((err) => {
			console.log('Failed');
		});
});

router.post('/register', function (req, res, next) {	// 响应注册，并进行合法判断
	logger.debug("[post] register\n", req.body);
	var res_body = {};
	if (typeof(req.session.user_id) !== 'undefined') {  // 已登录
		res_body = {
			status: 'FAILED.',
			details: 'ALREADY_LOGIN.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	}

	if (req.body.verify_code !== user_verification_codes[req.body.phone]) { // 验证码不正确
		console.log(req.body.phone);
		console.log(user_verification_codes[req.body.phone]);
		res_body = {
			status: 'FAILED.',
			details: 'WRONG_VERIFICATION_CODE.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	}

	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length !== 0) {    //判重
				conn.end();
				return Promise.reject({
					status: 'FAILED.',
					details: 'DUPLICATION_OF_REGISTRATION.'
				});
			}
			// 不重复
			var values = [];
			var keys = [];
			var items = ['id', 'nickname', 'realname', 'role', 'email', 'motto', 'registration_date', 'password', 'phone'];
			for (var item of items) {
				keys.push(item);
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
			var sql = 'insert into users (' + keys.join(',') + ') values (' + values.join(',') + ')';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			res_body.status = "SUCCESS.";              // 成功注册
			let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(req.body.nickname);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length <= 0) {
				conn.end();
				return new Promise.reject({
					status: 'FAILED.',
					details: 'USER_INFO_LOST.'
				});
			}
			let user = sql_res.results[0];
			logger.info('<<<', sql_res);
			updateSession(req.session, user);
			res_body.results = req.session;
			logger.debug('[res]', res_body);
			conn.end();
			res.send(JSON.stringify(res_body));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/login', function (req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
	logger.debug("[post] login\n", req.body);
	let nickname = req.body.nickname;
	let password = req.body.password;
	if (typeof(nickname) === 'undefined' || typeof(password) === 'undefined') {
		res.status(403).
			send('Don\'t post such things.');
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM users WHERE nickname = ' + mysql.escape(nickname);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length === 0) {
				conn.end();
				return Promise.reject({
					status: 'FAILED.',
					details: 'USER_NOT_FOUND.'
				});
			}
			else {
				let user = sql_res.results[0];
				logger.debug('Found:', user);
				if (password !== user.password) {
					conn.end();
					return Promise.reject({
						status: 'FAILED.',
						details: 'WRONG_PASSWORD.'
					});
				}
				else {
					delete user.password;   // ensure safety
					updateSession(req.session, user);	// 更新 session
					conn.end();
					res.send({
						status: 'SUCCESS.',
						details: 'SUCCESS.',
						results: req.session
					});
				}
			}
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/loginbyPhone', function (req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
	logger.debug("[post] login\n", req.body);
	if (req.body.verify_code !== user_verification_codes[req.body.phone]) { // 验证码不正确
		res_body = {
			status: 'FAILED.',
			details: 'WRONG_VERIFICATION_CODE.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	}
	let phone = req.body.phone;
	
	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM users WHERE phone = ' + mysql.escape(phone);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length === 0) {
				conn.end();
				return Promise.reject({
					status: 'FAILED.',
					details: 'USER_NOT_FOUND.'
				});
			}
			else {
				let user = sql_res.results[0];
				updateSession(req.session, user);	// 更新 session
				conn.end();
				res.send({
					status: 'SUCCESS.',
					details: 'SUCCESS.',
					results: req.session
				});
			}
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.get('/logout', function (req, res, next) {
	logger.debug('[get] logout\n', req.body);
	var res_body = {
		status: '',
		details: '',
	};
	if (typeof(req.session.user_id) === 'undefined') {
		res_body.status = 'FAILED.';
		res_body.details = 'USER_NOT_ONLINE.';
	}
	else {
		req.session.destroy((err) => {
			logger.debug('Session Destroyed');
			if (err) logger.debug(err);
		});
		res_body.status = 'SUCCESS.';
		res_body.details = 'SUCCESS.';
	}
	logger.debug('[res]', res_body);
	res.send(JSON.stringify(res_body));
});

router.post('/change', function (req, res, next) {  // 响应设置个人信息修改
	logger.debug('[post] change\n', req.body);
	var res_body = {
		status: '',
		details: '',
	};
	if ((req.body.verify_code).toString() !== (user_verification_codes[req.body.phone]).toString()) { // 验证码不正确
		console.log(user_verification_codes[req.body.phone]);
		res_body = {
			status: 'FAILED.',
			details: 'WRONG_VERIFICATION_CODE.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	} else {
		getConnection().
			then(function (conn) {
				let sql = "UPDATE users SET ";
				let arr = [];
				let query = { realname: req.body.realname,
								motto: req.body.motto,
								email: req.body.email,
								password: req.body.password,
				};
				for (let item in query) {
					if (fixed_items.indexOf(item) >= 0) {
						res_body.status = 'FAILED.';
						res_body.details = 'property ' + item + ' cannot be changed.';
						res.send(JSON.stringify(res_body));
						conn.end();
						return Promise.reject({ status: 'SKIPPED.' });
					}
					if (req.body[item])
						arr.push(item + ' = \'' + req.body[item] + '\'');
				}
				sql += arr.join(',');
				sql += " WHERE id = " + req.session.user_id;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'SELECT * FROM users WHERE id = ' + req.session.user_id;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {		// 成功修改用户字段
				let { conn, sql_res } = packed;
				res_body.results = sql_res.results[0];
				delete res_body.results.password;
				updateSession(req.session, res_body.results);
				res_body.status = 'SUCCESS.';
				logger.debug(res_body);
				res.send(JSON.stringify(res_body));
				conn.end();
				logger.debug('[res]', res_body);
			}).
			catch(function (sql_res) {
				if (sql_res.status !== 'SKIPPED.')
					res.send(JSON.stringify(sql_res, null, 3));
			});
	}
});

router.post('/forgetPassword', function (req, res, next) {
	var res_body = {
		status: '',
		details: '',
	};
	let nickname = req.body.nickname;
	let newpassword = randomString(10);
	console.log(newpassword);
	if (req.body.verify_code !== user_verification_codes[req.body.phone]) { // 验证码不正确
		console.log(req.body.phone);
		console.log(user_verification_codes[req.body.phone]);
		res_body = {
			status: 'FAILED.',
			details: 'WRONG_VERIFICATION_CODE.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'UPDATE users SET password = \'' + newpassword + '\' WHERE nickname = \'' + nickname + '\'';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			res_body.status = 'SUCCESS.';
			res.send(JSON.stringify(res_body));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/queryPhone', function (req, res, next) {//判断手机号是否注册，若注册则返回用户
	var res_body = {
		status: '',
		details: '',
	};
	let phoneNumber = req.body.phone;
	console.log(phoneNumber);
	getConnection().
		then(function (conn) {
			let sql = "SELECT * from users WHERE phone = " + phoneNumber;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length === 0) {
				res_body.status = 'FAILED.';
				res_body.details = 'Phone Not Registered';
			}
			else {
				res_body.status = 'SUCCESS.';
				res_body.details = 'Phone Registered';
				let user = sql_res.results[0];
				res_body.user = user;
			}
			console.log(res_body);
			res.send(JSON.stringify(res_body));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/queryPhoneExist', function (req, res, next) {//判断手机号是否注册，若注册则返回用户
	var res_body = {
		status: '',
		details: '',
	};
	let phoneNumber = req.body.phone;
	console.log(phoneNumber);
	getConnection().
		then(function (conn) {
			let sql = "SELECT * from users WHERE phone = " + phoneNumber;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length === 0) {
				res_body.status = 'SUCCESS.';
				res_body.details = 'Phone Not Registered';
			}
			else {
				res_body.status = 'FAILED.';
				res_body.details = 'Phone Registered';
				let user = sql_res.results[0];
				res_body.user = user;
			}
			console.log(res_body);
			res.send(JSON.stringify(res_body));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/changePassword', function (req, res, next) {//修改密码
	var res_body = {
		status: '',
		details: '',
	};
	let userid = req.body.userid;
	let newpassword = req.body.password;
	if (req.body.verify_code !== user_verification_codes[req.body.phone]) { // 验证码不正确
		console.log(req.body.phone);
		console.log(user_verification_codes[req.body.phone]);
		res_body = {
			status: 'FAILED.',
			details: 'WRONG_VERIFICATION_CODE.'
		};
		logger.debug('[res]', res_body);
		res.send(JSON.stringify(res_body));
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'UPDATE users SET password = \'' + newpassword + '\' WHERE id = ' + userid;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			res_body.status = 'SUCCESS.';
			res.send(JSON.stringify(res_body));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

function randomString(len) {//随机生成字符串
	var $chars = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

module.exports = router;
