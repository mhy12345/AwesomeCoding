// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest-session')(app);
// 测试初始化
const should = require('should');
const { parseText, addUser, clearUser, login, logout, test_user } = require('./test_utils');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('test_live');

describe('# Test `live.js`', function () {
	this.timeout(2000);
	before(function (done) {		// 事先注册用户
		addUser(request).
			then((res) => {
				done();
			}).
			catch((err) => {
				done(`Initializing Error ${err}`);
			});
	});

	describe('## test login judgement', function () {		// 是否登录的判断
		it('should fail to load resources when offline.', function (done) {
			request.
				get('/api/live/get_cat_record_count').
				end(function (err, res) {
					if (err) done(err);
					let body = parseText(res.text);
					body.should.have.keys('status', 'details');
					body.status.should.eql('FAILED.');
					body.details.toLowerCase().
						 should.
						 containEql('offline');
					done();
				});
		});
		describe('online test', function () {		// 登录状态下的测试
			before(function (done) {
				login(request).
					then(done);
			});
			it('should fail to load resources when user is not in the class.', function (done) {
				request.
					get('/api/live/get_cat_record_count').
					query({ course_id: 1 }).
					end(function (err, res) {
						if (err) done(err);
						let body = parseText(res.text);
						body.should.have.keys('status', 'details');
						body.status.should.eql('FAILED.');
						body.details.toLowerCase().
							 should.
							 containEql('not').
							 and.
							 containEql('in').
							 and.
							 containEql('class');
						done()
					});
			});

			describe('in class test', function () {
				before(function (done) {
					request.
						post('/api/class/join').
						send({ class_id: 1 }).
						// 规定 1 号班级为测试专用
						end(function () {
							request.
								post('/api/class/status').
								// session 中获取到 role
								send({ class_id: 1 }).
								end(done);
						});
				});
				it('should load chat count when user is in the class.', function (done) {
					request.
						get('/api/live/get_chat_record_count').
						query({ course_id: 1 }).
						end(function (err, res) {
							if (err) done(err);
							let body = parseText(res.text);
							body.should.have.keys('status', 'results');
							body.results.should.eql(0);
							done();
						});
				});
				it('should load chat when user is in the class.', function (done) {
					request.
						get('/api/live/get_chat_record').
						query({ course_id: 1, start: 0, end: 20 }).
						end(function (err, res) {
							if (err) done(err);
							let body = parseText(res.text);
							logger.info('[record]', body);
							body.should.have.keys('status', 'results');
							body.results.length.should.eql(0);
							done();
						});
				});
				after(function (done) {
					request.post('/api/class/participants/delete').
							send({ user_id: null, class_id: 1 }).
							end(done);
				});
			});
			after(function (done) {	// 退出登录
				logout(request).
					then(done).
					catch((err) => {
						logger.error(err);
						done(err);
					});
			})
		})

	});

	after(function (done) {			// 测试完成后清除用户
		clearUser(request).
			then((res) => {
				logger.info('Test over');
				done();
			}).
			catch((err) => {
				logger.info('Test over with', err);
				done();
			});
	});
});