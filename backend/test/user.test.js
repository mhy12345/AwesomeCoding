// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const should = require('should');
const randomString = require('../utils/funcs').randomString;

// 输出日志
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('test_info');

describe('# Testing /api/user', function () {

	describe('## test session', function () {
		it("should respond with 'FAILED.' when offline", function (done) {	// 未登录时应该没有session信息
			request.
				get('/api/user/session').
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					logger.info(body);
					body.should.have.keys('status', 'details');
					body.should.not.have.keys('nickname', 'id');
					body.status.should.be.exactly('FAILED.');
					done();
				});
		});
	});

	describe('## test login', function () {
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
			let test_nickname = 'test_name' + randomString(8);
			logger.info('try logging in', test_nickname);
			request.
				post('/api/user/login').
				send({
					nickname: test_nickname,
					password: '123123',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').which.is.exactly('FAILED.');
					body.should.have.key('details');
					body.details.toLowerCase().should.containEql('not').and.containEql('found');	// 要有用户未找到的提示词
					logger.warn(body.details);
					done();
				});
		});
		it('should fail to login with an existent nickname but an incorrect password', function (done) {		// 密码不正确时应该登录失败
			let test_nickname = 'test_name123';
			logger.info('try logging in', test_nickname);
			request.
				post('/api/user/login').
				send({
					nickname: test_nickname,
					password: '321321',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').which.is.exactly('FAILED.');
					body.should.have.key('details');
					body.details.toLowerCase().should.containEql('password');	// 要有密码错误的提示词
					logger.info('login failed!\n', body);
					done();
				});
		});
		it('should login successfully with an existent nickname and a correct password', function (done) {		// 存在的用户名并且密码应该登录成功
			let test_nickname = 'test_name123';
			logger.info('try logging in', test_nickname);
			request.
				post('/api/user/login').
				send({
					nickname: test_nickname,
					password: '123123',
				}).
				expect(200).
				end(function (err, res) {
					if (err) return done(err);
					let body = eval('(' + res.text + ')');
					body.should.have.key('status').which.is.exactly('SUCCESS.');
					body.should.have.key('results').which.is.an.Object().and.is.not.empty();
					logger.info('login successfully!\n', body.results);
					done();
				});
		})
	});

	describe('## test logout', function () {
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
	});

	describe('## test register', function () {
		it('Register with user-example', function (done) {
			user = {
				nickname: 'example',
				role: '0',
				password: '111111',
			};
			request.
				post('/api/user/register', user).
				expect(200).
				end(function (err, res) {
					logger.info('[res]', res.body); // todo no response here
					if (err) return done(err);
					done();
				});
		});
	});

});