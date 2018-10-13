var assert = require('assert');
var should = require('should');

var mysql_config = require('../configures/db_configures.js');

const getConnection = require('../utils/funcs.js').getConnection;
const doSqlQuery = require('../utils/funcs.js').doSqlQuery;

describe('#database', function() {
	describe('#getConnection()', function() {
		it('#Can connect to the database', function(done) {
			getConnection().
				then((conn) => {
					conn.should.have.property('state','authenticated');
					conn.end();
					done();
				}).
				catch((reason) => {
					done(reason);
				});
		});
	});

	describe('#Fake database check.', function() {
		before(function() {
			mysql_config.database = 'ac_test';
		});
		it('#Can connect to the database', function(done) {
			getConnection().
				then((conn)=>{
					conn.should.have.property('state','authenticated');
					return doSqlQuery(conn,'DROP DATABASE IF EXISTS ac_test');
				}).
				then((packed) => {
					let {conn, sql_res} = packed;
					conn.end();
					done();
				}).
				catch((sql_res) => {
					done(sql_res);
				});
		});
		describe('#Database functional test.', function() {
			beforeEach(function(done) {
				getConnection().//The database will automatically created here.
					then(function(conn) {
						conn.end();
						done();
					}).
					catch(function(sql_res) {
						done(sql_res);
					});
			});
			afterEach(function(done) {
				getConnection().
					then(function(conn) {
						return doSqlQuery(conn,'DROP DATABASE ac_test');
					}).
					then(function(packed) {
						let {conn, sql_res} = packed;
						conn.end();
						done();
					}).
					catch(function(sql_res) {
						done(sql_res);
					});
			});
			it('Test hooks',function() {
			});
		});
	});
});
