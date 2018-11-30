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

describe('# Testing /api/discussion_board', function () {
	this.timeout(8000);
	let test_user = {
		nickname: 'i_am_a_teacher',
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 1,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000',
		classid: 2,
		message: "test message",
		userid: 1,
		forumid: 1
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
		it("Add comments.", function (done) {
			request.
				post('/api/chat/add_comments').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it("Add posts.", function (done) {
			request.
				post('/api/chat/add_comments/posts').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it("Info query.", function (done) {
			request.
				post('/api/chat/info/query').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
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
