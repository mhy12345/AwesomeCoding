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
	}
	else {
		next();
	}
});

/* 检查用户是否在课堂中
 * 以 session.course_status 字段是否被定义为标准
 * 该字段在 /api/class/status 被调用时就自动添加到 session 字段里了
 */
router.use(function (req, res, next) {
	if (req.session.course_status === undefined) {
		res.send({
			status: 'FAILED.',
			details: 'USER_NOT_IN_THE_CLASS.'
		})
	}
	else {
		next();	// user in the class, can apply subsequent router
	}
});

/* 获取聊天记录条数
 * req.query 字段：
 * 		course_id: 课程号
 */
router.get('/get_chat_record_count', function (req, res) {
	logger.info('[get] chat record count\n', req.query);
	getConnection().
		then((conn) => {
			let sql = "SELECT COUNT(*) FROM ac_database.chat_record WHERE course_id = " + req.query.course_id + ";";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			logger.info('[get] chat record count, success.', sql_res.results[0]['COUNT(*)']);
			res.send({
				status: 'SUCCESS.',
				results: sql_res.results[0]['COUNT(*)']
			});
			conn.end();
		}).
		catch((err) => {
			logger.error('\n', err);
			res.send(err);
		});
});

/* 分页获取聊天记录
 * req.query 的字段：
 * 		course_id: 课程号
 * 		start: 按最新消息到最初消息的顺序，待获取的聊天记录的起始编号
 * 		end:   按最新消息到最初消息的顺序，待获取的聊天记录的末尾编号
 *
 * res 内容：按所发时间倒排的聊天记录数组，每个元素的字段与 chat_record 数据库字段相同
 */
router.get('/get_chat_record', function (req, res) {
	logger.info('[get] chat record\n', req.query);
	getConnection().
		then((conn) => {
			let sql = "SELECT COUNT(*) FROM ac_database.chat_record WHERE course_id = " + req.query.course_id + ";";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			let count = Number(sql_res.results[0]['COUNT(*)']);	// 获取到记录条数
			let first_id = count - Number(req.query.end);
			let last_id = count - Number(req.query.start);
			if (first_id < 0) first_id = 0;
			let sql = `SELECT * FROM ac_database.chat_record ` +
				`WHERE course_id = ${req.query.course_id} ` +
				`LIMIT ${first_id}, ${last_id - first_id};`;
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			res.send({
				status: 'SUCCESS.',
				results: sql_res.results.reverse()
			});
			logger.info('[get] chat record, success.');
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
