// 一个没有监听端口的 Express 实例
require('./test-debug.js')

const app = require('../app');
const request = require('supertest-session')(app);
const should = require('should');
const randomString = require('../utils/funcs').randomString;
const getConnection = require('../utils/funcs.js').getConnection;
const doSqlQuery = require('../utils/funcs.js').doSqlQuery;
let mysql_config = require('../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('default');

describe('# Testing /api/class', function () {
	let test_user = {
		nickname: 'test_name' + randomString(8),
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 0,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000'
	};
	let test_class = {
		title: "unit_test_class",
		type: 1,
		resources: ["details","participants","settings","live","file_settings","train_area","train_area_teacher","posts"],
		notice: "FtJxcAhrRp7rkfmp",
		description:"ifQxW2EQzbAMm7Je"
	};
	let class_id = null;
	before(function (done) {
		mysql_config.database = 'ac_test';
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
	describe('# Create A Class.', function() {
		it("Create the class.", function(done) {
			request.
				post('/api/class/create').
				send(test_class).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) 
						done(err);
					else if (res.body.status != 'SUCCESS.')
						done('STATUS FAILED.'+JSON.stringify(res,null,3));
					else
						done();
					class_id = res.body.id;
				});
		});
		it("Make sure that the id is returned.", function() {
			(class_id).should.not.be.false();
		});
		it("Check the infomation.", function(done) {
			request.
				post('/api/class/info/query').
				send({class_id: class_id}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						for (let key in test_class) {
							if (key === 'resources')continue;
							res.body.info.should.have.value(key,test_class[key]);
						}
						res.body.should.have.value('resources',test_class.resources);
						done();
					}
				});
		});
	});
		after(function (done) {	
			getConnection().
				then(function(conn) {
					let sql = 'DELETE FROM classes';
					return doSqlQuery(conn, sql);
				}).then(function(packed) {
					let {conn, sql_res} = packed;
					let sql = 'DELETE FROM users';
					return doSqlQuery(conn, sql);
				}).then(function(packed) {
					let {conn, sql_res} = packed;
					done();
				}).catch(function(sql_res) {
					done(JSON.stringify(sql_res, null, 3));
				});
		});
});
