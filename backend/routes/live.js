// 直播页面的api
const express = require('express');
const router = express.Router();
const getConnection = require('../utils/funcs').getConnection;
const doSqlQuery = require('../utils/funcs').doSqlQuery;
const getPermission = require('../utils/funcs').getPermission;
const $sockets = require('../utils/global').$user_sockets;

const log4js = require("log4js");
const log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
const logger = log4js.getLogger('live');

router.use(function (req, res, next) {		// 检查登录状态
	if (req.session.user_id === undefined) {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'USER OFFLINE.'
		}));
		logger.error('Not login.');
	}
	else {
		next();
	}
});

router.use(function (req, res, next) {	// 检查用户是否在课堂中
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
			}
			else {
				next();		// user in the class, go on
			}
		});
});

router.get('/get_chat_record_count', function (req, res) {		// 获取聊天记录条数
	logger.info('[get] chat record count\n', req.query);
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
});

router.get('/get_chat_record', function (req, res) {		// 分页获取聊天记录
	logger.info('[get] chat record\n', req.query);
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
});


router.get('/clear_chat_record', function (req, res) {		// 清空聊天记录
	logger.info('[clear_chat_record]\n', req.query);
	getPermission(req.session.user_id, req.query.course_id).
		then((role) => {
			logger.info('[role]', role);
			if (role !== 0) {		// 权限不够
				res.send({
					status: 'FAILED.',
					details: 'NO_PERMISSION',
				});
			}
			else {		// 是教师，可以清空聊天记录
				getConnection().
					then((conn) => {
						let sql = "DELETE FROM ac_database.chat_record WHERE course_id = " + req.query.course_id + ";";
						logger.info('\nsql =', sql);
						return doSqlQuery(conn, sql);
					}).
					then((packed) => {
						let { conn, sql_res } = packed;
						logger.info('[after clear record]\n', sql_res);
						res.send({ status: 'SUCCESS.' });
						conn.end();
					}).
					catch((err) => {
						logger.error('Error in `clear_chat_record`\n', err);
						throw err;
					});
			}
		}).
		catch((err) => {
			res.send({
				status: 'FAILED.',
				details: JSON.stringify(err, null, 3)
			});
		});
});

router.get('/block_chatting', function (req, res) {		// 禁止所有课程中在线的用户发言
	logger.info('[block_chatting]\n', req.query);
	getPermission(req.session.user_id, req.query.course_id).
		then((role) => {
			logger.info('[role]', role);
			if (role !== 0) {		// 权限不够
				res.send({
					status: 'FAILED.',
					details: 'NO_PERMISSION',
				});
			}
			else {			// 是教师，可以禁言
				res.send({ status: 'SUCCESS.' });
				// broadcast to all users in the class
				getConnection().
					then((conn) => {
						let sql = "SELECT user_id FROM ac_database.classusers " +
							"WHERE class_id = " + req.query.course_id + " AND role > 0;";	// 可以改为 role > 1 这样可以允许助教发言
						logger.info('\nsql =', sql);
						return doSqlQuery(conn, sql);
					}).
					then((packed) => {
						let { conn, sql_res } = packed;
						// logger.info('sql_res\n', sql_res.results);
						// logger.info('sockets\n', Object.keys(sockets));
						for (let result of sql_res.results) {
							let user_id = String(result.user_id);	//***
							if (user_id in $sockets) {
								logger.info('[to block]', user_id);
								$sockets[user_id].emit('block');
							}
						}
						res.send({ status: 'SUCCESS.' });
						conn.end();
					});
			}
		}).
		catch((err) => {
			res.send({
				status: 'FAILED.',
				details: JSON.stringify(err, null, 3)
			});
		});
});

router.get('/allow_chatting', function (req, res) {		// 允许所有课程中在线的用户发言， todo 后期增加数据库表项
	logger.info('[block_chatting]\n', req.query);
	getPermission(req.session.user_id, req.query.course_id).
		then((role) => {
			logger.info('[role]', role);
			if (role !== 0) {		// 权限不够
				res.send({
					status: 'FAILED.',
					details: 'NO_PERMISSION',
				});
			}
			else {			// 是教师
				res.send({ status: 'SUCCESS.' });
				// broadcast to all users in the class
				getConnection().
					then((conn) => {
						let sql = "SELECT user_id FROM ac_database.classusers " +
							"WHERE class_id = " + req.query.course_id + " AND role > 0;";
						logger.info('\nsql =', sql);
						return doSqlQuery(conn, sql);
					}).
					then((packed) => {
						let { conn, sql_res } = packed;
						for (let result of sql_res.results) {
							let user_id = String(result.user_id);	//***
							if (user_id in $sockets) {
								logger.info('[to allow]', user_id);
								$sockets[user_id].emit('allow');
							}
						}
						res.send({ status: 'SUCCESS.' });
						conn.end();
					});
			}
		}).
		catch((err) => {
			res.send({
				status: 'FAILED.',
				details: JSON.stringify(err, null, 3)
			});
		});
});

module.exports = router;
