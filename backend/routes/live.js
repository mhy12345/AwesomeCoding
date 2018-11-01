// 直播页面的api
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('live');

router.get('/get_chat_record', function (req, res) {
	// check session
	logger.info('[get] chat record\n', req.query);
	if (req.session.user_id === undefined) {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'USER OFFLINE.'
		}));
		logger.error('Not login.');
		return;
	}
	// check if the user is in the course_id
	getConnection().
		then((conn) => {
			let sql = "SELECT * " +
				"FROM ac_database.classusers WHERE " +
				"user_id = " + req.session.user_id + " and " +
				"class_id = " + req.query.course_id + ";";
			logger.info('\nsql =', sql);
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			if (sql_res.results.length === 0) {	// user not in the class
				logger.warn('[res] not in the class');
				res.send({
					status: 'FAILED.',
					details: 'USER_NOT_IN_THE_CLASS.'
				});
				conn.end();
				return;
			}
			// user is in the class, return all the chat record relating the course_id
			let sql = "SELECT * FROM ac_database.chat_record WHERE course_id = " + req.query.course_id + ";";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			logger.info('[res]\nsql_results = \n', sql_res.results);
			res.send({
				status: 'SUCCESS.',
				results: sql_res.results
			});
			conn.end();
		}).
		catch((err) => {
			logger.error('\n', err);
			res.send(err);
		});

	// res.send(JSON.stringify({
	// 	status: 'SUCCESS.'
	// }));
	// logger.info('[res]');
});

module.exports = router;
