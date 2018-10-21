const should = require('should');
// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
const randomString = require('../utils/funcs').randomString;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('test_info');

describe('# Testing Developer Tool', function () {

	let test_tables = ['users', 'classes', 'files'];

	describe('## Testing `/show_table`', function () {
		test_tables.forEach(function (table) {
			it('should respond to showing table `' + table + '`', function (done) {				// 三个表格的显示测试
				request.
					get('/api/developer/show_table?table_name=' + table).
					expect(200).
					end(function (err, res) {
						if (err) done(err);
						body = eval('(' + res.text + ')');
						body.should.have.properties('status', 'results');
						body.status.should.be.exactly('SUCCESS.');
						done();
					});
			});
		});
		it('should respond with `FAILED.` to showing a wrong table name`', function (done) {	// 没有查找到表格应该返回失败
			request.
				get('/api/developer/show_table?table_name=wrong').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'details');
					body.status.should.equal('FAILED.');
					done();
				});
		});
	});

	describe('## Testing `/show_columns`', function () {
		test_tables.forEach(function (table) {
			it('should respond to showing columns of `' + table + '`', function (done) {				// 三个表格的列名获取测试
				request.
					get('/api/developer/show_columns?table_name=' + table).
					expect(200).
					end(function (err, res) {
						if (err) done(err);
						body = eval('(' + res.text + ')');
						body.should.have.properties('status', 'results');
						body.results.length.should.be.greaterThan(0);
						body.results[0].should.only.have.key('COLUMN_NAME');
						done();
					});
			})
		});
		it('should respond with`FAILED.` to showing columns of a wrong table name', function (done) {	// 没有查找到表格应该返回失败
			request.
				get('/api/developer/show_columns?table_name=xxx').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'details');
					body.status.should.be.exactly('FAILED.');
					done();
				});
		})
	});
	describe('## Testing `/do_query`', function () {
		let test_name = 'testing_name' + randomString(5);
		logger.info('nickname = ', test_name);
		it('should succeed when inserting a user to `users`', function (done) {				// 测试添加用户
			request.
				get("/api/developer/do_query?sql=INSERT INTO users " +
					"(email, nickname, realname, role, password) VALUES ('1@mail.com', '" + test_name + "', 'TESTER', '1', '111111')").
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'results');
					body.status.should.be.exactly('SUCCESS.');
					done();
				});
		});
		it('should take effect when changing a user\'s info', function (done) {
			request.
				get("/api/developer/do_query?sql=UPDATE users SET password = '123123', motto = 'test for updating' WHERE nickname = '" + test_name + "'").
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'results');
					body.status.should.be.exactly('SUCCESS.');
					body.results.affectedRows.should.be.exactly(1);
					done();
				});
		});
		it('should respond with expected user info when selecting a user by nickname', function (done) {	// 测试之前的插入和修改是否成功
			request.
				get("/api/developer/do_query?sql=SELECT * FROM users WHERE nickname = '" + test_name + "'").
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'results');
					body.status.should.be.exactly('SUCCESS.');
					body.results.length.should.be.exactly(1);

					user = body.results[0];
					user.should.have.key('realname').which.is.exactly('TESTER');
					user.should.have.key('email').which.is.exactly('1@mail.com');
					user.should.have.key('motto').which.is.exactly('test for updating');
					user.should.have.key('password').which.is.exactly('123123');
					done();
				});
		});
		it('should affect exactly one row when deleting a user from `users`', function (done) {				// 测试删除用户
			request.
				get("/api/developer/do_query?sql=DELETE FROM users WHERE nickname = '" + test_name + "'").
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'results');
					body.status.should.be.exactly('SUCCESS.');
					body.results.affectedRows.should.be.exactly(1);
					request.
						get("/api/developer/do_query?sql=SELECT * FROM users WHERE nickname = '" + test_name + "'").
						expect(200).
						end(function (err, res) {
							if (err) done(err);
							body = eval('(' + res.text + ')');
							body.should.have.properties('status', 'results');
							body.status.should.be.exactly('SUCCESS.');
							body.results.length.should.be.exactly(0);		// 确认已删除
							done();
						});
				});
		});
		it('should catch error when doing a bad query', function (done) {	// 请求出错，拒绝操作
			request.
				get("/api/developer/do_query?sql=INSERT INTO users " +
					"(nickname, realname, password) VALUES ('" + test_name + "', 'TESTER', '1')").
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'details');
					body.status.should.be.exactly('FAILED.');
					done();
				});
		});
	});
});