var async = require('async');
var get_connection = require('../utils/database');

function do_sql_query(sql, callback) {           // 执行数据库命令
	get_connection().then(function (conn) {
		console.log("SQL : ",sql);
		conn.query(sql, function (error, results, fields) {
			if (error) {
				callback({
					sql : sql,
					status : 'FAILED.',
					details : error,
				});
			} else {
				callback({
					sql : sql,
					status : 'SUCCESS.',
					results:results,
				});
			}
		});
	}).catch(function(rejected_reason) {
		console.log("FAILED TO DO SQL QUERY ...");
		callback(rejected_reason);
	});
}

function do_sql_query_sequential(sqls, callback) {
	var result = {
		querys: sqls,
		results: [],
		status: 'SUCCESS.',
	};
	get_connection().then(function (conn) {//成功获取了连接
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
	},function(rejected_reason) {
		callback({
			querys : sqls,
			results : [],
			status : 'FAILED',
			details : rejected_reason
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
    randomString, do_sql_query, do_sql_query_sequential
};
