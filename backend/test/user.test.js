// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest-session')(app);
// 断言测测试库
const should = require('should');
const randomString = require('../utils/funcs').randomString;

// 输出日志
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('unit-test');

describe('# Testing /api/user', function () {
	this.timeout(5000);
	var test_user;
	before(function (done) {			// 测试前 注册一个临时用户
		test_user = {
			nickname: 'test_name' + randomString(8),
			realname: 'TESTER',
			email: '123456@mail.com',
			role: 0,
			motto: 'just for test',
			password: '111111',
			phone: '13688880000'
		};
		request.
			get('/api/user/logout').
			end((function (err, res) {
				logger.info('TEST BEGINS\n', res.text);
				done();
			}));
	});

	describe('## test register', function () {			// 测试注册
		describe('### should reject a bad register request', function () {	// 对缺少必要参数的注册，应予以拒绝的反馈
			let users = [];
			users[0] = {	// without role
				nickname: 'test_name1' + randomString(8),
				realname: 'TESTER',
				email: '123456@mail.com',
				motto: 'just for test',
				password: '111111',
				phone: '12344445555'
			};
			users[1] = {	// without email
				nickname: 'test_name2' + randomString(8),
				realname: 'TESTER',
				role: 0,
				motto: 'just for test',
				password: '111111',
				phone: '12344445555'
			};
			users[2] = {	// without password
				nickname: 'test_name' + randomString(8),
				realname: 'TESTER',
				email: '123456@mail.com',
				role: 0,
				motto: 'just for test',
				phone: '12344445555'
			};
			users[3] = {	// without phone
				nickname: 'test_name' + randomString(8),
				realname: 'TESTER',
				email: '123456@mail.com',
				role: 0,
				motto: 'just for test',
				password: '111111'
			};
			users.forEach((user, index) => {
				it('test #' + index, function (done) {
					request.
						post('/api/user/register').
						send(user).
						expect(200).
						end(function (err, res) {
							if (err) done(err);
							let body = eval('(' + res.text + ')');
							// logger.info(body.details);
							body.should.have.key('status').
								 which.
								 is.
								 exactly('FAILED.');
							body.should.have.key('details').
								 which.
								 have.
								 key('sqlMessage').
								 containEql('cannot be null');
							done();
						});
				});
			});
		});
		it('should register successfully', function (done) {	// 正确注册
			request.
				post('/api/user/register').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.info('registration succeed\n', body);
					body.should.have.key('status').
						 which.
						 is.
						 exactly('SUCCESS.');
					body.should.have.key('results').
						 which.
						 have.
						 key('nickname').
						 which.
						 is.
						 exactly(test_user.nickname);
					done();
				});
		});
		it('should not register when already login', function (done) {
			request.
				post('/api/user/login').
				send(test_user).
				end(function () {
					let test_user2 = {
						nickname: 'test_second_name' + randomString(8),
						realname: 'TESTER',
						email: '123456@mail.com',
						role: 0,
						motto: 'just for test',
						password: '111111',
						phone: '13312341234',
					};
					request.
						post('/api/user/register').
						send(test_user2).
						expect(200).
						end(function (err, res) {
							if (err) return done(err);
							let body = eval('(' + res.text + ')');
							body.should.have.key('status').
								 which.
								 is.
								 exactly('FAILED.');
							body.should.have.key('details');
							body.details.toLowerCase().
								 should.
								 containEql('already').
								 and.
								 containEql('login');
							done();
						});
				})
		});
		it('should not register twice of the same nickname', function (done) {
			request.
				post('/api/user/register').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('FAILED.');
					body.should.have.key('details');
					body.details.toLowerCase().
						 should.
						 containEql('duplication');
					done();
				});
		});
		afterEach(function (done) {
			request.get('/api/user/logout').
					end(done);
		});
	});

	describe('## test session', function () {				// 测试 session
		it("should respond with an empty body when offline", function (done) {	// 未登录时应该没有session信息
			request.
				get('/api/user/session').
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.info(body);
					body.should.have.key('status').
						 which.
						 is.
						 exactly('SUCCESS.');
					body.should.not.have.keys('nickname', 'user_id', 'realname');
					done();
				});
		});
		it("should respond with 'SUCCESS.' when online", function (done) {	// 登录状态下应该有反馈
			logger.info('try logging in', test_user.nickname);
			request.
				post('/api/user/login').
				// 先登录
				send({
					nickname: test_user.nickname,
					password: '111111',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('SUCCESS.');
					body.should.have.key('results').
						 which.
						 is.
						 an.
						 Object().
						 and.
						 is.
						 not.
						 empty();
					request.
						get('/api/user/session').
						// 后检查session
						expect(200).
						end(function (err, res) {
							if (err) return done(err);
							let body = eval('(' + res.text + ')');
							logger.info('checkin successfully!\n', body);
							body.should.have.keys('status');
							body.should.have.keys('nickname', 'realname', 'user_id');
							body.status.should.be.exactly('SUCCESS.');
							done();
						});
				});
		});
		afterEach(function (done) {
			request.get('/api/user/logout').
					end(done);
		});
	});

	describe('## test login', function () {						// 测试登录
		it('should not login without params', function (done) {
			request.
				post('/api/user/login').
				expect(403).
				end(function (err, res) {
					if (err) return done(err);
					logger.warn(res.text);
					done();
				});
		});
		it('should fail to login with a nonexistent nickname', function (done) {		// 不存在的用户名应该登录失败
			let test_nickname = 'test_name#' + randomString(8);
			logger.info('try logging in', test_nickname);
			request.
				post('/api/user/login').
				send({
					nickname: test_nickname,
					password: '111111',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('FAILED.');
					body.should.have.key('details');
					body.details.toLowerCase().
						 should.
						 containEql('not').
						 and.
						 containEql('found');	// 要有用户未找到的提示词
					logger.warn(body.details);
					done();
				});
		});
		it('should fail to login with an existent nickname but an incorrect password', function (done) {		// 密码不正确时应该登录失败
			logger.info('try logging in', test_user.nickname);
			request.
				post('/api/user/login').
				send({
					nickname: test_user.nickname,
					password: '321321',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('FAILED.');
					body.should.have.key('details');
					body.details.toLowerCase().
						 should.
						 containEql('password');	// 要有密码错误的提示词
					logger.info('login failed!\n', body);
					done();
				});
		});
		it('should login successfully with an existent nickname and a correct password', function (done) {		// 存在的用户名并且密码应该登录成功
			logger.info('try logging in', test_user.nickname);
			request.
				post('/api/user/login').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('SUCCESS.');
					body.should.have.key('results').
						 which.
						 is.
						 an.
						 Object().
						 and.
						 is.
						 not.
						 empty();
					logger.info('login successfully!\n', body.results);
					done();
				});
		});
		afterEach(function (done) {
			request.get('/api/user/logout').
					end(done);
		});
	});

	describe('## test change', function () {		// 修改用户信息
		before(function (done) {
			request.
				post('/api/user/login').
				send(test_user).
				end(done);
		});
		it("should fail to change in response to an invalid request", function (done) {	// 错误的请求，不应该修改
			request.
				post('/api/user/change').
				send({
					nickname: 'xxx',
					role: 1,
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.warn('request rejected.\n', body);
					body.should.have.key('status').
						 which.
						 is.
						 exactly('FAILED.');
					done();
				});
		});
		it("should succeed in changing user info", function (done) {		// 符合规范应该成功修改
			request.
				post('/api/user/change').
				send({
					realname: 'xxx',
					password: '123123',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').
						 which.
						 is.
						 exactly('SUCCESS.');
					body.should.have.key('results');
					body.results.realname.should.eql('xxx');
					test_user.realname = 'xxx';
					test_user.password = '123123';
					request.
						post('/api/user/login').
						send(test_user).
						// 登录测试密码是否被修改
						expect(200).
						end(function (err2, res2) {
							if (err2) done(err2);
							let body2 = eval('(' + res2.text + ')');
							body2.should.have.key('status').
								  which.
								  is.
								  exactly('SUCCESS.');
							done();
						});
				});
		});
		after(function (done) {
			request.get('/api/user/logout').
					end(done);
		});
	});

	describe('## test logout', function () {
		before(function (done) {
			request.
				post('/api/user/login').
				send(test_user).
				end(done);
		});
		it("should successfully logout when online", function (done) {		// 登录状态下应该成功登出
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.info(body);
					body.should.have.keys('status');
					body.status.should.be.exactly('SUCCESS.');
					done();
				});
		});
		it("should respond with 'FAILED.' when offline", function (done) {	// 未登录时应该无法登出
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.info(body);
					body.should.have.keys('status', 'details');
					body.status.should.be.exactly('FAILED.');
					done();
				});
		});
	});

	after(function (done) {				// 清理测试
		request.
			get("/api/developer/do_query?sql=DELETE FROM users WHERE nickname = '" + test_user.nickname + "'").
			end(function () {
				logger.info('TEST OVER');
				done();
			});
	});
});
