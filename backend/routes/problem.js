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

router.post('/delete', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'DELETE FROM `problems` WHERE `code`=' + mysql.escape(req.body.code);
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

router.post('/create', function(req, res, next) {
	if (req.session.user_id === undefined) {
		res.status(403).send("NOT_LOGIN.");
		return ;
	}
	let problem_id = randomString(16);
	getConnection().
		then(function(conn) {
			let sql = 'INSERT INTO `problems` (`code`,`class_id`,`type`,`creater`,`state`,`title`) values ('+
				mysql.escape(problem_id) + ',' +
				mysql.escape(+req.body.class_id) + ',' +
				mysql.escape(+req.body.type) + ',' +
				mysql.escape(req.session.user_id) + ',' +
				mysql.escape(0) + ',' +
				mysql.escape("新建题目") +
				')';
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			let sql = '';
			if (req.body.type == 0) { //选择题
				sql = 'INSERT INTO `choice_problems` (`code`,`description`,`choice_count`,`solution`) VALUES ('+mysql.escape(problem_id)+','+mysql.escape(randomString(16))+','+mysql.escape(4)+','+mysql.escape(randomString(16)) +')';
			} else if (req.body.type == 1) {
				sql = 'INSERT INTO `program_problems` (`code`,`description`,`solution`) VALUES ('+mysql.escape(problem_id)+','+mysql.escape(randomString(16))+','+mysql.escape(randomString(16)) +')';
			} else {
				logger.warn("UNKNOWN TYPE!");
			}
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

router.post('/list', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `problems` WHERE class_id = ' + mysql.escape(req.body.class_id);
			return doSqlQuery(conn,sql);
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

router.post('/save', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'UPDATE `problems` SET `state`='+mysql.escape(req.body.state)+', `title`='+mysql.escape(req.body.title)+' WHERE `code`='+mysql.escape(req.body.code);
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


router.post('/t/:ptype/get', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM '+mysql.escapeId(req.params.ptype)+' WHERE `code` = ' + mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function(sql_res) {
			console.log(sql_res);
			res.send(sql_res);
		});
});

/*
router.post('/t/:ptype/create', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM '+mysql.escapeId(req.params.ptype)+' WHERE `code` = ' + mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			let cols_text = '';
			let vals_text = '';
			for (let item in req.body.info) {
				cols_text += mysql.escapeId(item)+',';
				vals_text += mysql.escape(req.body.info[item])+',';
			}
			cols_text = cols_text.substr(0,cols_text.length-1);
			vals_text = vals_text.substr(0,vals_text.length-1);
			let sql = 'INSERT INTO '+mysql.escapeId(req.params.ptype)+' ('+cols_text+') VALUES ('+vals_text+')';
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function(sql_res) {
			console.log(sql_res);
			res.send(sql_res);
		});
});*/

router.post('/t/:ptype/save', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let body_text = '';
			for (let item in req.body.info) {
				body_text += mysql.escapeId(item) + '=' + mysql.escape(req.body.info[item]) + ',';
			}
			body_text = body_text.substr(0,body_text.length-1);
			let sql = 'UPDATE '+mysql.escapeId(req.params.ptype)+' SET '+body_text+ ' WHERE `code`='+mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function(sql_res) {
			console.log(sql_res);
			res.send(sql_res);
		});
});

router.post('/choice_problem/gather', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `choice_problem_answers` WHERE `code` = ' + mysql.escape(req.body.code);
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
router.post('/choice_problem/fetch', function(req, res, next) {
	if (req.session.user_id === undefined) {
		res.status(403).send("NOT_LOGIN.");
		return;
	}
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `choice_problem_answers` WHERE `code` = ' + mysql.escape(req.body.code) + ' AND `user_id` = ' + mysql.escape(req.session.user_id);
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
router.post('/choice_problem/submit', function(req, res, next) {
	if (req.session.user_id === undefined) {
		res.status(403).send("NOT_LOGIN.");
		return;
	}
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `choice_problem_answers` WHERE `code` = ' + mysql.escape(req.body.code) + ' AND `user_id` = ' + mysql.escape(req.session.user_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				let sql = 'INSERT INTO `choice_problem_answers` (`code`,`user_id`,`answer`) VALUES ('+mysql.escape(req.body.code)+','+mysql.escape(+req.session.user_id)+','+mysql.escape(req.body.answer)+')';
				return doSqlQuery(conn, sql);
			} else {
				let sql = 'UPDATE `choice_problem_answers` SET `answer`='+mysql.escape(req.body.answer)+' WHERE `code`='+mysql.escape(req.body.code)+' AND `user_id`='+mysql.escape(req.session.user_id);
				return doSqlQuery(conn, sql);
			}
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
module.exports = router;
