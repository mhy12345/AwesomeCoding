var async = require('async');
var get_connection = require('../utils/database');

function do_sql_query(sql, callback) {           // 执行数据库命令
    var result = {
        query: sql,
        results: [],
        status: 'SUCCESS.',
    };
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

function do_sql_query_sequential(sqls, callback) {
    var result = {
        querys: sqls,
        results: [],
        status: 'SUCCESS.',
    };
    get_connection(function (conn) {
		async.eachSeries(sqls, function (item, callback) {
			console.log(item);
			conn.query(item, function (err, res) {
				console.log(res);
				callback(err, res);
			});
		}, function (err,res) {
			console.log("err: " + err);
			console.log("res: " + res);
			result.results = res;
			result.error = err;
			callback(result);
		});
    });
}

function randomString(len) {//随机生成字符串
	var $chars = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

module.exports = {
	randomString,do_sql_query,do_sql_query_sequential
}
