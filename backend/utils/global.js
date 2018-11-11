// global variables in backend

var user_sockets = {};		// restore all user sockets, key: user_id, value: a socket object

function updateSocketSession(session) {		// 将 req.session 同步到 socket.handshake.session
	if (session.user_id === undefined) return;
	let socket = user_sockets[session.user_id];
	if (socket === undefined) return;
	socket.handshake.session = session;
	console.log('[global] update session:', session, socket.handshake.session);
}

module.exports = {
	$user_sockets: user_sockets, updateSocketSession
};
