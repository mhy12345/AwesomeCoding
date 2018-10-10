var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;

router.get('/show_table', function(req, res, next) { //在数据库中查找表格，并打印
	var sql = 'SELECT * FROM ' + req.query.table_name;
	do_sql_query(sql, function (result) {
		res.send(JSON.stringify(result, null, 3));
	});
});

router.get('/show_columns', function(req, res, next) {
	var mysql_config = require('../configures/db_configures');
	var db_name = mysql_config.database;
	var sql = 'SELECT (COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = \''
		+ db_name + '\' AND TABLE_NAME = \'' + req.query.table_name + '\'';
    do_sql_query(sql, function (result) {
        res.send(JSON.stringify(result, null, 3));
    });
});


router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
	var sql = req.query.sql;
	do_sql_query(sql, function (result) {
		res.send(JSON.stringify(result, null, 3));
	});
});

module.exports = router;
