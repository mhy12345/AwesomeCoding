var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

// 开发期间，暂时关闭权限控制功能 todo 发布时启用权限管理功能
/*router.use(function (req, res, next) {  // 判断用户是否有管理员权限
	if (typeof(req.session) === 'undefined') {
        res.status(403).send(JSON.stringify({
            status: 'FAILED.',
            details: 'NOT_LOGIN.',
        }));
    }
    else if (req.session.role !== 0) {  // 权限不够
        res.send(JSON.stringify({
            status: 'FAILED.',
            details: 'PERMISSION_DENIED.',
        }))
    }
    else {                              // 拥有管理员权限，接受请求
        next();
    }
});*/

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

router.get('/show_columns', function (req, res, next) {
	getConnection().
		then(function (conn) {
			let mysql_config = require('../configures/database.config.js');
			let db_name = (mysql_config.database);
			let sql = 'SELECT (COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '
				+ mysql.escape(db_name) + ' AND TABLE_NAME = ' + mysql.escape(req.query.table_name) + '';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {	// 为什么在这里，没有查找到表格，doSqlQuery不会返回错误？
			let { conn, sql_res } = packed;
			conn.end();
			if (sql_res.results.length === 0)
				res.send(JSON.stringify({
					status: 'FAILED.',
					details: 'TABLE_NOT_FOUND.',
				}));
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});


router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
	getConnection().
		then(function (conn) {
			let sql = req.query.sql;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

module.exports = router;
