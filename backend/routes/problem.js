var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
var randomString = require('../utils/funcs').randomString;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file')

router.post('/paper/put', function(req, res, next) {
	if (req.session.user_id === undefined) {
		res.status(403).send("NOT_LOGIN.");
		return ;
	}
	getConnection(req).
		then(function(conn) {
			let sql = 'SELECT * FROM `papers` WHERE `code` = '+mysql.escape(req.body.problem_id)+' AND `user_id` = ' + mysql.escape(req.session.user_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				let sql = 'INSERT INTO `papers` (`code`,`text`,`user_id`) VALUES ('+mysql.escape(req.body.problem_id)+','+mysql.escape(req.body.text)+' , '+mysql.escape(req.session.user_id)+')';
				return doSqlQuery(conn, sql);
			} else {
				let sql = 'UPDATE `papers` SET `text`='+mysql.escape(req.body.text)+' WHERE `code`='+mysql.escape(req.body.problem_id)+' AND `user_id` = '+mysql.escape(req.session.user_id);
				return doSqlQuery(conn, sql);
			}
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS.',
				answer: null,
				state: 0,
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});
router.post('/paper/get', function(req, res, next) {
	if (req.session.user_id === undefined) {
		res.status(403).send("NOT_LOGIN.");
		return ;
	}
	getConnection().
		then(function(conn) {
			let sql = 'SELECT `text` FROM `papers` WHERE `code` = '+mysql.escape(req.body.problem_id) + ' AND `user_id` = '+mysql.escape(req.session.user_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS.',
				text : sql_res.results[0].text
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/save', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'UPDATE `problems` SET `state`='+mysql.escape(req.body.state)+', `answer`='+mysql.escape(req.body.answer)+' WHERE `code`='+mysql.escape(req.body.problem_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/get', function(req, res, next) {
	getConnection(req).
		then(function(conn) {
			let sql = 'SELECT * FROM problems WHERE `code` = '+mysql.escape(req.body.problem_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				let sql = 'INSERT INTO problems (`code`,`state`) VALUES ('+mysql.escape(req.body.problem_id)+','+mysql.escape(0)+')';
				return doSqlQuery(conn, sql);
			} else {
				conn.end();
				res.send(JSON.stringify({
					status: 'SUCCESS.',
					answer: sql_res.results[0].answer,
					state: sql_res.results[0].state,
				}));
				return Promise.reject({
					status: 'SKIPPED.',
				});
			}
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS.',
				answer: null,
				state: 0,
			}));
		}).
		catch(function(sql_res) {
			if (sql_res.status !== "SKIPPED.")
				res.send(JSON.stringify(sql_res));
		});
});

router.post('/path/get', function(req, res, next) {
	console.log(req.body);
	let result = {
		status: "SUCCESS.",
	};
	let path = req.body.path.split("/");
	if (path[0] === 'practice') {
		path[0] = '练习';
		getConnection().
			then(function(conn) {
				conn.end();
			});
	} else if (path[0] === 'home') {
		path[0] = '主页';
		result.path_text = path.join('/');
		res.send(JSON.stringify(result));
	}
});

router.post('/content/save', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `contents` WHERE `path`='+mysql.escape('/class/'+req.body.class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			let sql = '';
			if (sql_res.results.length === 0)
				sql = 'INSERT INTO `contents` (`path`,`content`,`deltas`) VALUES ('+mysql.escape('/class/'+req.body.class_id)+','+mysql.escape(req.body.content)+','+mysql.escape(req.body.deltas)+')';
			else
				sql = 'UPDATE `contents` SET `deltas`='+mysql.escape(req.body.deltas)+', `content` = '+mysql.escape(req.body.content)+' WHERE `path`='+mysql.escape('/class/'+req.body.class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send('SUCCESS.');
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/content/load', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `contents` WHERE `path`='+mysql.escape('/class/'+req.body.class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS',
				contents: sql_res.results[0].content,
				deltas: sql_res.results[0].deltas
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});
module.exports = router;
