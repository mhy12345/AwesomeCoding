// 客户端和服务端之间的拉流、推流，采用socket通信
var mysql = require('mysql');
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('socket_log');

function createSocketIO(server) {
	var io = require('socket.io')(server);
	io.on('connection', function (socket) {
		logger.info('>>a user connected');
		socket.emit('message', { from: 'Host', message: 'Welcome!' });	// todo delete this

		socket.on('disconnect', function () {
			logger.warn('>>a user disconnected');
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
					socket.emit('accepted');
					conn.end();
					socket.broadcast.emit('message', {		// 向其他用户广播消息
						from: socket.handshake.session.realname,
						message: msg.message
					});
				}).
				catch((err) => {			// 数据库操作错误
					logger.error('\n', err);
					socket.emit('rejected', {
						details: '数据库操作失败。',
						error: err,
					});
				});
		});

		socket.on('received', function () {			// 客户收到消息
			logger.info('>>received.');
		});

	});
	return io;
}

module.exports = createSocketIO;
