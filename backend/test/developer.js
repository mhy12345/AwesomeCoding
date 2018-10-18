const should = require('should');
// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('test_info');

describe('# Testing Developer Tool', function () {

	test_tables = ['users', 'classes', 'files'];

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


});