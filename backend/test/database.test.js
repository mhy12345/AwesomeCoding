var assert = require('assert');
var should = require('should');
var mysql_config = require('../configures/database.config.js');
const getConnection = require('../utils/funcs.js').getConnection;
const doSqlQuery = require('../utils/funcs.js').doSqlQuery;

describe('#database', function () {
	this.timeout(5000);
	describe('#getConnection()', function () {
		it('#Can connect to the database', function (done) {
			getConnection().
				then((conn) => {
					conn.should.have.property('state', 'authenticated');
					conn.end();
					done();
				}).
				catch((reason) => {
					done(reason);
				});
		});
	});

	describe('#Fake database check.', function () {
		before(function () {
			mysql_config.database = 'ac_test';
		});
		it('#Can connect to the database', function (done) {
			getConnection().
				then((conn) => {
					conn.should.have.property('state', 'authenticated');
					return doSqlQuery(conn, 'DROP DATABASE IF EXISTS ac_test');
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
		describe('#Database functional test.', function () {
			before(function (done) {
				getConnection().
					//The database will automatically created here.
					then(function (conn) {
						conn.end();
						done();
					}).
					catch(function (sql_res) {
						done(sql_res);
					});
			});
			after(function () {
				return getConnection().
					then(function (conn) {
						return doSqlQuery(conn, 'DROP DATABASE ac_test');
					}).
					then(function (packed) {
						let {conn, sql_res} = packed;
						conn.end();
					});
			});
			it('check status...', function () {
				return getConnection().
					then(function (conn) {
						conn.end();
					});
			});
			describe('#Check if all table created successfully.', function () {
				it('file_table.', function () {
					return getConnection().
						then(function (conn) {
							return doSqlQuery(conn, 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "' + mysql_config.database + '" AND TABLE_NAME = "files"');
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							conn.end();
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('user_id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('filename');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('type');
							});
						});
				});
				it('resources.', function () {
					return getConnection().
						then(function (conn) {
							return doSqlQuery(conn, 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "' + mysql_config.database + '" AND TABLE_NAME = "resources"');
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							conn.end();
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('class_id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('resource');
							});
						});
				});
				it('classes.', function () {
					return getConnection().
						then(function (conn) {
							return doSqlQuery(conn, 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "' + mysql_config.database + '" AND TABLE_NAME = "classes"');
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							conn.end();
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('description');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('notice');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('title');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('registration_date');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('invitation_code');
							});
						});
				});
				it('classusers.', function () {
					return getConnection().
						then(function (conn) {
							return doSqlQuery(conn, 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "' + mysql_config.database + '" AND TABLE_NAME = "classusers"');
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							conn.end();
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('class_id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('role');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('user_id');
							});
							sql_res.results.should.matchAny((val) => {
								val.COLUMN_NAME.should.be.eql('registration_date');
							});
						});
				});
			});
		});
	});
});
