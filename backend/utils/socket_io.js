// 客户端和服务端之间的拉流、推流，采用socket通信
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('socket_log');
var $user_sockets = require('../utils/global').$user_sockets;		// restore all user sockets, key: user_id, value: a socket object

function notifyClassMembers(socket, msg) {	// 向本门课程的所有在线的用户广播聊天消息，并发送拉流的通知
	getConnection().
		then((conn) => {
			let sql = "INSERT INTO `ac_database`.`chat_record` " +
				"(`course_id`, `user_id`, `course_status`, `realname`, `message`) VALUES ('" +
				msg.course_id + "', '" +
				socket.handshake.session.user_id + "', '" +
				socket.handshake.session.course_status + "', '" +
				socket.handshake.session.realname + "', '" +
				msg.message + "');";
			return doSqlQuery(conn, sql);
		}).
		then((packed) => {			// 成功添加到聊天记录
			let { conn, sql_res } = packed;
			let sql = "SELECT user_id FROM ac_database.classusers WHERE class_id = " + msg.course_id + ";";
			return doSqlQuery(conn, sql)
		}).
		then((packed) => { 		// 选中课程中的所有用户
			let { conn, sql_res } = packed;
			conn.end();
			let flow = {
				realname: socket.handshake.session.realname,
				user_id: socket.handshake.session.user_id,
				message: msg.message,
				course_status: socket.handshake.session.course_status,
				date_time: new Date()
			};
			for (let result of sql_res.results) {	// 用 socket 通知课程中的这些用户消息
				let id = result.user_id;
				id = String(id);
				if ($user_sockets.hasOwnProperty(id)) {
					$user_sockets[id].emit('message', flow);
					$user_sockets[id].emit('pullFlow', flow);
				}
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

function alertClassMembers(socket, msg) {	// 教师向本门课程的所有在线学生广播通知，比如打开ppt、弹出对话框等
	logger.info('[teacher alert\n', msg);
	getConnection().
		then((conn) => {
			let sql = "SELECT user_id FROM ac_database.classusers WHERE class_id = " + msg.course_id + ";";
			return doSqlQuery(conn, sql)
		}).
		then((packed) => {
			let { conn, sql_res } = packed;
			logger.info('\nsql_res = ', sql_res);
			conn.end();
			for (let result of sql_res.results) {	// 用 socket 通知课程中的这些用户
				let id = result.user_id;
				if (id === socket.handshake.session.user_id && msg.echo == undefined) continue;	// 不广播给自己
				id = String(id);
				if ($user_sockets.hasOwnProperty(id)) {
					logger.info('[alerted] ', id);
					$user_sockets[id].emit('alert', msg);
				}
			}
		}).
		catch((sql_res) => {
			console.log(sql_res);
		});
}

function createSocketIO(server) {
	var io = require('socket.io')(server);
	io.on('connection', function (socket) {

		logger.info('>>a user connected');
		if (socket.handshake.session.user_id) {		// 若为登录状态，就保存连接到的用户
			$user_sockets[socket.handshake.session.user_id] = socket;
			logger.info('>>saved! user_socket counts: ', Object.keys($user_sockets).length,
				'\ncurrent users:\n', Object.keys($user_sockets));
		}

		socket.on('disconnect', function () {		// 断开连接
			logger.warn('>>a user disconnected');
			if (socket.handshake.session.user_id) {	// 若为登录状态，就删除断开连接的用户
				delete $user_sockets[socket.handshake.session.user_id];
				logger.warn('>>deleted! user_socket counts: ', Object.keys($user_sockets).length,
					'\ncurrent users:\n', Object.keys($user_sockets));
			}
		});

		socket.on('message', function (msg) {		// 客户发来消息
			logger.info('>>message: \n', msg);
			if (socket.handshake.session.user_id === undefined) {	// offline, reject
				socket.emit('rejected', {
					details: '您尚未登录，不能发送消息。'
				});
				return;
			}
			// store the message and push flow to other clients
			notifyClassMembers(socket, msg);
		});

		if (socket.handshake.session.role === 1) {	// 教师权限——通知班级学生进行操作
			socket.on('alert', function (msg) {
				socket.emit('accepted');
				alertClassMembers(socket, msg);
			});
		}

		socket.on('received', function () {			// 客户收到消息
			logger.info('>>received.');
		});

	});
	return io;
}

module.exports = createSocketIO;
