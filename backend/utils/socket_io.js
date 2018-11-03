// 客户端和服务端之间的拉流、推流，采用socket通信
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('socket_log');
var user_sockets = {};		// restore all user sockets, key: user_id, value: a socket object

function inClass(user_id, course_id, callback) {		// 判断用户是否在课程中
	getConnection().
		then((conn) => {
			let sql = "SELECT * FROM ac_database.classusers WHERE " +
				"user_id = " + user_id + " AND " +
				"class_id = " + course_id + ";";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			conn.end();
			logger.info('\n[found in class user]: \n', sql_res.results);
			if (sql_res.results.length > 0) callback();
		}).
		catch((err) => {
			logger.error(err);
		});
}

function notifyClassMembers(socket, msg) {	// 向本门课程的所有在线的用户广播消息，并发送拉流的通知
	getConnection().
		then((conn) => {
			let sql = "INSERT INTO `ac_database`.`chat_record` " +
				"(`course_id`, `user_id`, `realname`, `message`) VALUES ('" +
				msg.course_id + "', '" +
				socket.handshake.session.user_id + "', '" +
				socket.handshake.session.realname + "', '" +
				msg.message + "');";
			logger.info('\nsql =', sql);
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {			// 成功添加到聊天记录
			let { conn, sql_res } = packed;
			logger.info('\nsql_res = ', sql_res);
			socket.emit('accepted', );
			conn.end();
			let flow = {
				from: socket.handshake.session.realname,
				message: msg.message,
				time: new Date()
			};
			for (user_id in user_sockets) {
				inClass(user_id, msg.course_id, function () {	// 判断广播通知在课程中且在线的用户，异步函数
					logger.info('[notified] ', user_id);
					user_sockets[user_id].emit('message', flow);
					user_sockets[user_id].emit('pullFlow', flow);
				});
			}
		}).
		catch((err) => {			// 数据库操作错误
			logger.error('\n', err);
			socket.emit('rejected', {
				details: '数据库操作失败。',
				error: err,
			});
		});
}

function createSocketIO(server) {
	var io = require('socket.io')(server);
	io.on('connection', function (socket) {

		logger.info('>>a user connected');
		if (socket.handshake.session.user_id) {		// 若为登录状态，就保存连接到的用户
			user_sockets[socket.handshake.session.user_id] = socket;
			logger.info('>>saved! user_socket counts: ', Object.keys(user_sockets).length);
		}

		socket.emit('message', { from: 'Host', message: 'Welcome!' });

		socket.on('disconnect', function () {		// 断开连接
			logger.warn('>>a user disconnected');
			if (socket.handshake.session.user_id) {	// 若为登录状态，就删除断开连接的用户
				delete user_sockets[socket.handshake.session.user_id];
				logger.warn('>>deleted! user_socket counts: ', Object.keys(user_sockets).length);
			}
		});

		socket.on('message', function (msg) {		// 客户发来消息
			logger.info('>>message: \n', msg);
			logger.info('handshake.session\n', socket.handshake.session);
			if (socket.handshake.session.user_id === undefined) {	// offline, reject
				socket.emit('rejected', {
					details: '您尚未登录，不能发送消息。'
				});
				return;
			}
			// store the message and push flow to other clients
			notifyClassMembers(socket, msg);
		});

		socket.on('received', function () {			// 客户收到消息
			logger.info('>>received.');
		});

	});
	return io;
}

module.exports = createSocketIO;
