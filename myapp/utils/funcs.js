var async = require('async');
var mysql = require('mysql');
var mysql_initializer = require('./mysql_initializer');
var mysql_config = require('../configures/db_configures');

function get_connection() { //获取连接connection，并调用回调函数
	return new Promise(function(resolve,reject) {
		connection = mysql.createConnection(mysql_config);
		connection.connect(function (err) {
			if (err) {
				connection.end();
				reject(err);
			}else {
				resolve(connection);
			}
		});
	}).catch(function(rejected_reason) {
		console.log(rejected_reason);
		console.log("Reinstall database...");
		return mysql_initializer();
	})
}

function do_sql_query(conn,sql) {           // 执行数据库命令
	if (typeof(sql) == 'undefined') {
		return Promise.reject({
			status : 'FAILED.',
			details : 'The do_sql_query() function called with one parameter.'
		});
	}
	return new Promise(function(resolve,reject) {
		conn.query(sql, function (error, results, fields) {
			if (error) {
				console.log(sql + '[FAILED.]');
				conn.end();
				reject(
					{
						sql: sql,
						status: 'FAILED.',
						results : undefined,
						details: error,
					});
			} else {
				console.log(sql + '[FILLED.]');
				console.log(results);
				resolve({
					conn: conn, 
					sql_res: { sql : sql, status : 'SUCCESS.', results:results, details : undefined }
				});

			}
		});
	});
}

function do_sql_query_sequential(conn,sqls) {
	return new Promise(function(resolve,reject) {
		async.eachSeries(sqls, function (item, callback) {
			conn.query(item, function (err, res) {
				console.log(res);
				callback(err, res);
			});
		}, function (err,res) {
			if (err) {
				reject({
					querys : sqls,
					results : undefined,
					status : 'FAILED',
					details : rejected_reason
				});
			} else {
				resolve({
					conn : conn,
					sql_res : {
						querys : sqls,
						results : res,
						status : 'SUCCESS.',
						details : undefined
					}
				});
			}
		});
	},function(rejected_reason) {
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
	randomString, do_sql_query, do_sql_query_sequential, get_connection
};
