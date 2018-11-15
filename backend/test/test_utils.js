// 测试需要用到的函数
const randomString = require('../utils/funcs').randomString;
const test_user = {
	nickname: 'test_name' + randomString(8),
	realname: 'TESTER',
	email: '123456@mail.com',
	role: 2,
	motto: 'just for test',
	password: '111111',
	phone: '13688880000'
};

function parseText(res_text) {		// text 转化为 json
	return eval('(' + String(res_text) + ')');
}

function addUser(request) {			// 注册一个新用户
	return new Promise((resolve, reject) => {
		request.
			get("/api/developer/do_query?sql=INSERT INTO users " +
				"(" + Object.keys(test_user).
							 join(',') + ") VALUES " +
				"('" + Object.values(test_user).
							  join("','") + "');").
			end(function (err, res) {
				if (err) reject(err);
				body = eval('(' + res.text + ')');
				if (body.status === 'SUCCESS.')
					resolve(body);
				else
					reject(body.details);
			});
	});
}

function clearUser(request) {		// 删除用户
	return new Promise((resolve, reject) => {
		request.
			get("/api/developer/do_query?sql=DELETE FROM users WHERE nickname = '" + test_user.nickname + "'").
			end(function (err, res) {
				if (err) reject(err);
				resolve(res);
			});
	});
}

function login(request) {		// 登录
	return new Promise((resolve, reject) => {
		request.
			post('/api/user/login').
			send(test_user).
			end(function (err, res) {
				let body = res.body;
				if (body.status === 'SUCCESS.')
					resolve();
				else
					reject(body.details);
			});
	});
}

function logout(request) {
	return new Promise((resolve, reject) => {
		request.
			get('/api/user/logout').
			end(function (err, res) {
				if (err) reject(err);
				let body = parseText(res.text);
				if (body.status === 'SUCCESS.')
					resolve();
				else
					reject(body);
			});
	});
}

module.exports = { parseText, addUser, clearUser, login, logout, test_user };
