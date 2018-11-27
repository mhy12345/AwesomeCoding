// 直播页面的api
const express = require('express');
const router = express.Router();
const getConnection = require('../utils/funcs').getConnection;
const doSqlQuery = require('../utils/funcs').doSqlQuery;
const doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
const getPermission = require('../utils/funcs').getPermission;
const $sockets = require('../utils/global').$user_sockets;
const mysql = require('mysql');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });	// 暂存目录
const fs = require('fs');
const path = require('path');
const md5 = require('js-md5');
const salt = 'AwwwwwwsomeCodig!!!';

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

/* 私聊功能，我们还是用 chat_record 表来实现，但是这里的 course_id 需要根据私聊双方的 id 来生成（哈希算法），
 * 并且设定为负数，用以和公聊区分。
 * req.query 字段：
 * 		user_id1, user_id2 : 私聊双方用户的 id
 */
router.get('/get_private_course_id', function (req, res) {
	let id1 = req.query.user_id1, id2 = req.query.user_id2;
	if (id1 > id2) {	// swap to ensure id1 < id2
		let temp = id1;
		id1 = id2;
		id2 = temp;
	}
	let str = id1 + '_' + id2 + '_' + salt;
	md5(str);
	let hash = md5.create();
	hash.update(str);
	course_id = hash.hex();	// 获得`课程id`
	logger.info('[private_course_id] str:', str);
	logger.info('[private_course_id] hex:', course_id);
	res.send({ course_id: course_id });
	// 将私聊双方加入'班级'
	getConnection().
		then(function (conn) {
			let sql = 'SELECT user_id FROM classusers WHERE class_id = ' + mysql.escape(course_id);
			return doSqlQuery(conn, sql);	// 检查是否重复加入
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			let sqls = [];
			[id1, id2].forEach(function (user_id) {
				let not_in = true;
				sql_res.results.forEach(function (o) {
					logger.error(o.user_id);
					if (o.user_id == user_id) not_in = false;
				});
				if (not_in) {
					let sql = 'INSERT INTO classusers (`class_id`,`user_id`,`role`) VALUES (' +
						mysql.escape(course_id) + ',' + mysql.escape(user_id) + ',' +
						mysql.escape(2) + ')';
					sqls.push(sql);
				}
			});
			return doSqlQuerySequential(conn, sqls);	// 加入班级
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
		}).
		catch(function (sql_res) {
			logger.error('[private_course_id]', sql_res);
		});
});

/* 获取聊天记录条数
 * req.query 字段：
 * 		course_id: 课程号
 */
router.get('/get_chat_record_count', function (req, res) {
	logger.info('[get] chat record count\n', req.query);
	getConnection().
		then((conn) => {
			let sql = "SELECT COUNT(*) FROM ac_database.chat_record WHERE course_id = " + mysql.escape(req.query.course_id) + ";";
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
			let sql = "SELECT COUNT(*) FROM ac_database.chat_record WHERE course_id = " +  mysql.escape(req.query.course_id) + ";";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			let count = Number(sql_res.results[0]['COUNT(*)']);	// 获取到记录条数
			let first_id = count - Number(req.query.end);
			let last_id = count - Number(req.query.start);
			if (first_id < 0) first_id = 0;
			let sql = `SELECT * FROM ac_database.chat_record ` +
				`WHERE course_id = ${mysql.escape(req.query.course_id)} ` +
				`LIMIT ${first_id}, ${mysql.escape(last_id - first_id)};`;
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

/* 用户发来图片消息
 * req.query:
 * 		course_id,
 * req.file[0]
 * 保存路径：backend/public/chat/pictures
 */
router.post('/picture', upload.any(), function (req, res) {
	let now = new Date();
	let suffix = mysql.escape(now.getTime());
	let filename = '' + req.session.user_id + '_' + req.body.course_id + '_' + suffix;	// 生成文件名
	let des_path = path.join('./public/chat/pictures/' + filename);				// 储存路径
	let save_path = 'chat/pictures/' + filename;
	fs.readFile(req.files[0].path, function (err, data) {
		if (err) {
			logger.error(err);
			res.status(403).
				send(err);
			return;
		}
		fs.writeFile(des_path, data, function (err) {
			if (err) {
				logger.error(err);
				res.status(403).
					send(err);
				return
			}
			logger.info('[saved]', save_path);
			res.send({
				status: 'SUCCESS.',
				type: 'picture',
				path: save_path
			});
		});
	});
});

/* 用户发来语音消息
 * req.query:
 * 		course_id,
 * req.files:
 * 		blob		语音消息 wav 格式
 * 	保存路径：backend/public/chat/voices
 */
router.post('/voice', upload.any(), function (req, res) {
	let now = new Date();
	let suffix = mysql.escape(now.getTime()) + '.wav';
	let filename = '' + req.session.user_id + '_' + req.body.course_id + '_' + suffix;	// 生成文件名
	let des_path = path.join('./public/chat/voices/' + filename);				// 储存路径
	let save_path = 'chat/voices/' + filename;

	fs.readFile(req.files[0].path, function (err, data) {
		if (err) {
			logger.error(err);
			res.status(403).
				send(err);
			return;
		}
		fs.writeFile(des_path, data, function (err) {	// 存储语音到指定目录
			if (err) {
				logger.error(err);
				res.status(403).
					send(err);
				return;
			}
			logger.info('[saved]', save_path);
			res.send({
				status: 'SUCCESS.',
				type: 'voice',
				path: save_path		// 返回储存路径
			});
		});
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
						let sql = "DELETE FROM ac_database.chat_record WHERE course_id = " + mysql.escape(req.query.course_id) + ";";
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
							"WHERE class_id = " +  mysql.escape(req.query.course_id) + " AND role > 0;";	// 可以改为 role > 1 这样可以允许助教发言
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
	logger.info('[allow_chatting]\n', req.query);
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
							"WHERE class_id = " +  mysql.escape(req.query.course_id) + " AND role > 0;";
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
