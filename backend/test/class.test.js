// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
//const request = require('supertest-session')(app);
// 断言测测试库
describe('#asd', function() {
	it('#asdasd', function (done) {
		done();
	});
});

/*
describe('# Testing /api/class', function () {
	var test_user = {
		nickname: 'test_name' + randomString(8),
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 0,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000'
	};
	var test_class = {
		title: "haha",
		type: 1,
		resources: ["details","participants","settings","live","file_settings","train_area","train_area_teacher","posts"],
		notice: "FtJxcAhrRp7rkfmp",
		description:"ifQxW2EQzbAMm7Je"
	}
	before(function (done) {
		mysql_config.database = 'ac_test';
		request.
			post('/api/user/register').
			send(test_user).
			expect(200).
			end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});
	describe('# Create A Class.', function() {
		it("Create the class.", function(done) {
			done()
		});
	});
	after(function (done) {				// 清理测试
		request.
			get("/api/developer/do_query?sql=DELETE FROM users WHERE nickname = '" + test_user.nickname + "'").
			end(function () {
				logger.info('TEST OVER');
				mysql_config.database = 'ac_database';
				done();
			});
	});
});*/
