function createSocketIO(server) {
	var io = require('socket.io')(server);
	io.on('connection', function (socket) {
		console.log('a user connected');
		socket.on('disconnect', function () {
			console.log('this user disconnected');
		});
		socket.on('message', function (msg) {		// 客户发来消息
			console.log('>>message: \n', msg);
			io.emit('received');
		});
		socket.on('received', function () {			// 客户收到消息
			console.log('>>received.');
		});
		socket.emit('message', { from: 'Host', content: 'Welcome!' });
	});
	return io;
}

module.exports = createSocketIO;
