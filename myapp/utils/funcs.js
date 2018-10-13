var async = require('async');
var mysql = require('mysql');
var mysql_initializer = require('./mysql_initializer');
var mysql_config = require('../configures/db_configures');

function getConnection() { //获取连接connection，并调用回调函数
	return new Promise(function(resolve,reject) {
		let connection = mysql.createConnection(mysql_config);
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

function doSqlQuery(conn,sql) {           // 执行数据库命令
	if (typeof(sql) === 'undefined') {
		return Promise.reject({
			status : 'FAILED.',
			details : 'The doSqlQuery() function called with one parameter.'
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

function doSqlQuerySequential(conn,sqls) {
	return new Promise(function(resolve,reject) {
		console.log("START TO DO ",sqls);
		async.eachSeries(sqls, function (item, callback) {
			conn.query(item, function (err, res) {
				if (err)
					console.log(item + '[FAILED.]');
				else
					console.log(item + '[FILLED.]');
				console.log(res);
				callback(err, res);
			});
		}, function (err,res) {
			if (err) {
				conn.end();
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
	randomString, doSqlQuery, doSqlQuerySequential, getConnection
};
