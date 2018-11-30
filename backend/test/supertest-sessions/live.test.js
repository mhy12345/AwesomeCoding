/* eslint-disable no-mixed-spaces-and-tabs */
// 测试初始化
require('../test-debug.js');

const request = require('../public/session_instance');
const should = require('should');
const { parseText, addStudent, addTeacher, clearStudent, clearTeacher, loginStudent, loginTeacher, logout } = require('../public/test_utils');
const teacher_operations = ['clear_chat_record', 'block_chatting', 'allow_chatting'];	// 教师权限的操作

var log4js = require("log4js");
var log4js_config = require("../../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('test_live');
const mysql_config = require('../../configures/database.config.js');

var user_id1, user_id2;

describe('===Test Live===', function () {

	this.timeout(8000);

	before(function (done) {		// 事先注册用户
		mysql_config.database = 'ac_database';		// 切换回数据库
		addStudent(request).
			then(() => {
				return addTeacher(request);
			}).
			then(() => done()).
			catch((err) => {
				done(`Initializing Error ${err}`);
			});
	});
	describe('# Test `live.js` as a student', function () {
		describe('## test loginStudent judgement', function () {		// 是否登录的判断
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
					loginStudent(request).
						then((body) => {
							user_id1 = body.results.user_id;	// 保存 session 中的 user_id
							done();
						});
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
								body.should.have.keys('status', 'results');
								done();
							});
					});
					teacher_operations.forEach((operation) => {
						it(`should deny permission when a student tries to ${operation}`, function (done) {
							request.
								get(`/api/live/${operation}`).
								query({ course_id: 1 }).
								end(function (err, res) {
									if (err) done(err);
									let body = res.body;
									body.should.have.keys('status', 'details');
									body.status.should.eql('FAILED.');
									body.details.toLowerCase().
										 should.
										 containEql('no').
										 and.
										 containEql('permission');
									done();
								})
						});
					});
					it('should support picture uploading.', function (done) {	// 上传图片的测试
						request.post('/api/live/picture').
								set('Content-Type', 'multipart/form-data').
								attach('file', 'test/public/test.jpg').
								expect(200).
								end((err, res) => {
									if (err) done(err);
									res.body.should.have.keys('status', 'type', 'path');
									logger.fatal('picture path\n', res.body.path);
									done();
								});
					});
					it('should support voice uploading.', function (done) {	// 上传语音的测试
						request.post('/api/live/voice').
								set('Content-Type', 'multipart/form-data').
								attach('file', 'test/public/test.wav').
								expect(200).
								end((err, res) => {
									if (err) done(err);
									res.body.should.have.keys('status', 'type', 'path');
									logger.fatal('voice path\n', res.body.path);
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
				});
			});
		});
	});

	describe('# Test `live.js` as a teacher', function () {
		before(function (done) {
			loginTeacher(request).
				then((body) => {
					user_id2 = body.results.user_id;	// 保存 session 中的 user_id
					done();
				});
		});
		it('should reject `/clear_chat_record` when teacher is not in the class', function (done) {	// 教师不在课堂 1 中
			request.get('/api/live/clear_chat_record').
					query({ course_id: 1 }).
					end(function (err, res) {
						if (err) done(err);
						res.body.should.have.keys('status', 'details');
						res.body.status.should.eql('FAILED.');
						res.body.details.toLowerCase().
							should.
							containEql('not').
							and.
							containEql('in').
							and.
							containEql('class');
						done();
					});
		});
		describe('### teacher joined class whose course_id=1', function () {	// 教师加入课堂1
			before(function (done) {
				let sql = `INSERT INTO ac_database.classusers (class_id, role, user_id) VALUES (1, 0, ${user_id2});`;
				request.
					get('/api/developer/do_query').
					query({ sql: sql }).
					end(function (err, res) {
						if (err) done(err);
						request.
							post('/api/class/status').
							// session 中获取到 role
							send({ class_id: 1 }).
							end(function (err, res) {
								done();
							});
					});
			});
			teacher_operations.forEach((operation) => {
				it(`teacher should be able to ${operation}`, function (done) {
					request.
						get(`/api/live/${operation}`).
						query({ course_id: 1 }).
						end(function (err, res) {
							if (err) done(err);
							res.body.status.should.eql("SUCCESS.");
							done();
						});
				})
			});
			var course_id;
			it('should create a private chatting room with student', function (done) {	// 私聊测试
				request.get('/api/live/get_private_course_id').
						query({ user_id1: user_id1, user_id2: user_id2 }).
						end(function (err, res) {
							res.body.should.have.key('course_id');
							course_id = res.body.course_id;
							done();
						});
			});
			it('should not create another private chatting room with student', function (done) {
				request.get('/api/live/get_private_course_id').
						query({ user_id1: user_id2, user_id2: user_id1 }).
						end(function (err, res) {
							res.body.should.have.key('course_id');
							res.body.course_id.should.eql(course_id);
							done();
						});
			});
			after(function (done) {		// classusers 里清空 test_teacher
				let sql = `DELETE FROM ac_database.classusers WHERE user_id = ${user_id2};`;
				request.
					get('/api/developer/do_query').
					query({ sql: sql }).
					end(function (err, res) {
						if (err) done(err);
						done();
					});
			});
		});

		after(function (done) {
			logout(request).
				then(done);
		});
	});

	after(function (done) {			// 测试完成后清除用户
		clearStudent(request).
			then((res) => {
				return clearTeacher(request);
			}).
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

