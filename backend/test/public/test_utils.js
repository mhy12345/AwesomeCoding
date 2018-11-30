// 测试需要用到的函数
const randomString = require('../../utils/funcs').randomString;
const test_student = {	// 测试学生账户
	nickname: 'test_student' + randomString(8),
	realname: 'TESTER',
	email: '123456@mail.com',
	role: 2,
	motto: 'just for test',
	password: '111111',
	phone: '13688880000'
};

const test_teacher = {	// 测试教师账户
	nickname: 'test_teacher' + randomString(8),
	realname: 'TESTER',
	email: '123456@mail.com',
	role: 1,
	motto: 'just for test',
	password: '111111',
	phone: '13688880000'
};

function parseText(res_text) {		// text 转化为 json
	return eval('(' + String(res_text) + ')');
}

function _addUser(request, user) {	// 注册用户
	return new Promise((resolve, reject) => {
		request.
			get("/api/developer/do_query?sql=INSERT INTO ac_database.users " +
				"(" + Object.keys(user).
							 join(',') + ") VALUES " +
				"('" + Object.values(user).
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

function addStudent(request) {			// 注册一个新学生用户
	return _addUser(request, test_student);
}

function addTeacher(request) {		// 注册一个教师账户
	return _addUser(request, test_teacher);
}

function _clearUser(request, user) {		// 删除用户
	return new Promise((resolve, reject) => {
		request.
			get("/api/developer/do_query?sql=DELETE FROM users WHERE nickname = '" + user.nickname + "'").
			end(function (err, res) {
				if (err) reject(err);
				resolve(res);
			});
	});
}

function clearStudent(request) {		// 删除学生用户
	return _clearUser(request, test_student);
}

function clearTeacher(request) {		// 删除教师账户
	return _clearUser(request, test_teacher);
}

function _login(request, user) {		// 登录
	return new Promise((resolve, reject) => {
		request.
			post('/api/user/login').
			send(user).
			end(function (err, res) {
				let body = res.body;
				if (body.status === 'SUCCESS.')
					resolve(body);
				else
					reject(body.details);
			});
	});
}

function loginStudent(request) {		// 登录学生
	return _login(request, test_student);
}

function loginTeacher(request) {		// 登录教师
	return _login(request, test_teacher);
}

function logout(request) {				// 登出当前用户
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

admin = {	// 测试专用账户
	user_info: {
		nickname: 'TEST_ADMIN',
		password: '000000'
	},
	login(request) {
		return _login(request, this.user_info);
	},
	logout(request) {
		return logout(request);
	}
};

module.exports = {
	parseText, addStudent, addTeacher, clearStudent,
	clearTeacher, loginStudent, loginTeacher, logout, admin
};
