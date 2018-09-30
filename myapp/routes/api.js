var express = require('express');
var router = express.Router();
var get_connection = require('../utils/database');

function do_sql_query(sql, callback) {           // 执行数据库命令
    var result = {};
    result.query = sql;
    result.results = [];
    result.status = 'SUCCESS.';
    get_connection(function (conn) {
        conn.query(sql, function (error, results, fields) {
            if (error) {
                result.status = 'FAILED.';
                result.details = error;
                callback(result);
            } else {
                for (var i = 0; i < results.length; i++) {
                    result.results.push(results[i]);
                }
                callback(result);
            }
        });
    });
}

router.get('/show_table', function(req, res, next) { //在数据库中查找表格，并打印
    var sql = 'SELECT * FROM ' + req.query.table_name;
	do_sql_query(sql,function(result) {
		res.send(JSON.stringify(result,null,3));
	});
});

router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
    var sql = req.query.sql;
    do_sql_query(sql, function (result) {
        res.send(JSON.stringify(result, null, 3));
    });
});

module.exports = router;
