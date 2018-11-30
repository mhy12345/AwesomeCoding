require('../test-debug.js');

const {app, server} = require('../../app');
const request = require('supertest-session')(app);
const should = require('should');
const assert = require('assert');
const randomString = require('../../utils/funcs').randomString;
const getConnection = require('../../utils/funcs.js').getConnection;
const doSqlQuery = require('../../utils/funcs.js').doSqlQuery;
let mysql_config = require('../../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('default');


describe('# Testing /api/file', function () {
	this.timeout(8000);
	let test_user = {
		nickname: 'i_am_a_teacher',
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 1,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000',
		classid: 1
	};
	let test_file = {
		files : [{originalname : 'test_name'},],
	};
	before(function () {
		mysql_config.database = 'ac_test';
	});
	describe('#Teacher`s action.', function () {
		before(function (done) {
			request.
				post('/api/user/register').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it("Fetch user's file list.", function (done) {
			request.
				post('/api/file/fetch').
				send(test_user).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)
						done(err);
					else if (res.body.status !== 'SUCCESS.')
						done('STATUS FAILED.' + JSON.stringify(res, null, 3));
					else
						done();
				});
		});
		it("Fetch classfile list.", function (done) {
			request.
				post('/api/file/fetch_coursefiles').
				send(test_user).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)
						done(err);
					else if (res.body.status !== 'SUCCESS.')
						done('STATUS FAILED.' + JSON.stringify(res, null, 3));
					else
						done();
				});
		});
		it("Add files to course.", function (done) {
			request.
				post('/api/file/add_to_course').
				send({
					classid: 1,
					fileid: 2,
					filename: "fake_file"
				}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)
						done(err);
					else if (res.body.status !== 'SUCCESS.')
						done('STATUS FAILED.' + JSON.stringify(res, null, 3));
					else
						done();
				});
		});
		it("Delete files to course.", function (done) {
			request.
				post('/api/file/delete_from_course').
				send({
					classid: 1,
					fileid: 2,
				}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)
						done(err);
					else if (res.body.status !== 'SUCCESS.')
						done('STATUS FAILED.' + JSON.stringify(res, null, 3));
					else
						done();
				});
		});
		it("Delete files from list.", function (done) {
			request.
				post('/api/file/delete').
				send({
					fileId: 1,
					filename: "fake_file",
				}).
				expect(200).
				end(function (err, res) {
					done();
				});
		});
		it('should support file uploading.', function (done) {	// 上传文件的测试
			request.post('/api/file/upload').
					set('Content-Type', 'multipart/form-data').
					attach('file', 'test/public/test.jpg').
					expect(200).
					end((err, res) => {
						if (err) done(err);
						let body = eval('(' + res.res.text + ')');
						body.should.have.keys('message', 'filename', 'showname');
						done();
					});
		});
		it('should support course_img uploading.', function (done) {	// 上传课程图片的测试
			request.post('/api/file/uploadcourseimg').
					set('Content-Type', 'multipart/form-data').
					attach('file', 'test/public/test.jpg').
					expect(403).
					end(() => done());
		});
		it('should support file uploading.', function (done) {	// 导入？
			request.post('/api/file/import').
					set('Content-Type', 'multipart/form-data').
					attach('file', 'test/public/test.jpg').
					expect(200).
					end((err, res) => {
						if (err) done(err);
						let body = eval('(' + res.res.text + ')');
						body.should.have.keys('filename', 'showname');
						done();
					});
		});
		it('should support download.', function (done) {
			request.get('/api/file/download').
					query({ filename: '.gitkeep' }).
					expect(200).
					end(done);
		});
		it('should not support download.', function (done) {
			request.get('/api/file/download').
					query({ filename: 'Notfound' }).
					expect(500).
					end(done);
		});
		after(function (done) {
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
	});
	after(function (done) {
		getConnection().
			then(function (conn) {
				let sql = 'DELETE FROM classes';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM coursefiles';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM classusers';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM users';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				done();
			}).
			catch(function (sql_res) {
				done(JSON.stringify(sql_res, null, 3));
			});
	});
});
