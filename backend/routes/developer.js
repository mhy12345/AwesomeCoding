var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var dbConfigure = require('../configures/database.config.js');

router.use(function (req, res, next) {  // 判断用户是否有管理员权限
    console.log('>>> developer request!', req.session);
    if (typeof(req.session) === 'undefined') {
        res.send(JSON.stringify({
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
});

router.get('/info', function(req, res, next) {
	res.status(200).send(JSON.stringify({
		status:'SUCCESS.',
		db_cfg:dbConfigure}));
});
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
			let mysql_config = require('../configures/database.config.js');
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
