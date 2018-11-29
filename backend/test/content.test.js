// 一个没有监听端口的 Express 实例
require('./test-debug.js');

const {app, server} = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest-session')(app);
const should = require('should');
const assert = require('assert');
const randomString = require('../utils/funcs').randomString;
const getConnection = require('../utils/funcs.js').getConnection;
const doSqlQuery = require('../utils/funcs.js').doSqlQuery;
let mysql_config = require('../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('default');

describe('# Testing /api/content', function () {
	this.timeout(8000);
	let test_user = {
		nickname: 'i_am_a_teacher',
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 1,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000'
	};
	let content = {
		code: 'haha',
		content: 'this-is-content',
		deltas: 'this-is-deltas'
	}
	before(function () {
		mysql_config.database = 'ac_test';
	});
	describe("test content", function() {
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
		it("Save content...", function(done) {
			request.
				post('/api/content/save').
				send(content).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
		it("Load HTML...", function(done) {
			request.
				post('/api/content/fetch/html').
				send(content).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						assert(res.body.content === 'this-is-content');
						done();
					}
				});
		});
		it("Load DELTAS...", function(done) {
			request.
				post('/api/content/fetch/deltas').
				send(content).
				expect(200).
				end(function (err, res) {
					logger.warn(res.body);
					res.body = JSON.parse(res.text);
					logger.warn(res.body);
					if (err) done(err);
					else {
						assert(res.body.deltas === 'this-is-deltas');
						done();
					}
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
				let sql = 'DELETE FROM contents';
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
