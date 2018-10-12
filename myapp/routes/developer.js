var express = require('express');
var router = express.Router();
var {do_sql_query,get_connection} = require('../utils/funcs');
var mysql=require('mysql');

router.get('/show_table', function(req, res, next) { //在数据库中查找表格，并打印
	get_connection()
	.then(function(conn) {
		let sql = 'SELECT * FROM ' + mysql.escapeId(req.query.table_name);
		return do_sql_query(conn,sql);
	})
	.then(function(packed) {
		let {conn,sql_res} = packed;
		conn.end();
		res.send(JSON.stringify(sql_res, null, 3));
	})
	.catch(function(sql_res) {
		res.send(JSON.stringify(sql_res, null, 3));
	});
});

router.get('/show_columns', function(req, res, next) {
	get_connection()
	.then(function(conn) {
		let mysql_config = require('../configures/db_configures');
		let db_name = (mysql_config.database);
		let sql = 'SELECT (COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '
			+ mysql.escape(db_name) + ' AND TABLE_NAME = ' + mysql.escape(req.query.table_name) + '';
		return do_sql_query(conn,sql);
	})
	.then(function(packed) {
		let {conn,sql_res} = packed;
		conn.end();
        res.send(JSON.stringify(sql_res, null, 3));
	})
	.catch(function(sql_res) {
        res.send(JSON.stringify(sql_res, null, 3));
	});
});


router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
	get_connection()
	.then(function(conn) {
		let sql = req.query.sql;
		return do_sql_query(conn,sql);
	})
	.then(function(packed) {
		let {conn,sql_res} = packed;
		conn.end();
		res.send(JSON.stringify(sql_res, null, 3));
	})
	.catch(function(sql_res) {
		res.send(JSON.stringify(sql_res, null, 3));
	});
});

module.exports = router;
