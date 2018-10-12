var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;

router.get('/show_table', function(req, res, next) { //在数据库中查找表格，并打印
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM ' + mysql.escapeId(req.query.table_name);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.get('/show_columns', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let mysql_config = require('../configures/db_configures');
			let db_name = (mysql_config.database);
			let sql = 'SELECT (COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '
				+ mysql.escape(db_name) + ' AND TABLE_NAME = ' + mysql.escape(req.query.table_name) + '';
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});


router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
	getConnection().
		then(function(conn) {
			let sql = req.query.sql;
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

module.exports = router;
