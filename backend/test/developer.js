const assert = require('assert');
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
	// it('Fun', function () {
	// 	logger.info('this is info');
	// 	logger.warn('this is warn');
	// 	logger.error('this is error');
	// 	logger.fatal('this is fatal');
	// });
	test_tables = ['users', 'classes', 'files'];
	test_tables.forEach(function (table) {
		it('should respond to showing table `' + table + '`', function (done) {
			request.
				get('/api/developer/show_table?table_name=' + table).
				expect(200).
				end(function (err, res) {
					body = eval('(' + res.text + ')');
					body.should.have.properties('status', 'results');
					body.status.should.be.exactly('SUCCESS.');
					if (err) done(err);
					else done();
				});
		});
	});
	it('should respond with `FAILED.` to showing table `wrong`', function (done) {
		request.
			get('/api/developer/show_table?table_name=wrong').
			expect(200).
			end(function (err, res) {
				body = eval('(' + res.text + ')');
				body.should.have.properties('status', 'details');
				body.status.should.equal('FAILED.');
				if (err) done(err);
				else done();
			});
	});
	it('should respond with ')
});