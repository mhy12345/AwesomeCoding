var async = require('async');
var mysql = require('mysql');
var mysql_initializer = require('./mysql_initializer');
var mysql_config = require('../configures/db_configures');

var db_debugger = require('debug')("database");

function getConnection() { //获取连接connection，并调用回调函数
	return new Promise(function(resolve,reject) {
		let config = {
			host : mysql_config.host,
			user : mysql_config.user,
			password : mysql_config.password,
			database : mysql_config.database
		}
		let connection = mysql.createConnection(config);
		connection.connect(function (err) {
			if (err) {
				connection.end();
				reject(err);
			}else {
				resolve(connection);
			}
		});
	}).catch(function(rejected_reason) {
		db_debugger("Reinstall database...");
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
				db_debugger(sql + '[FAILED.]');
				conn.end();
				reject(
					{
						sql: sql,
						status: 'FAILED.',
						results : undefined,
						details: error,
					});
			} else {
				db_debugger(sql + '[FILLED.]');
				db_debugger(results);
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
		db_debugger("START TO DO ",sqls);
		async.eachSeries(sqls, function (item, callback) {
			conn.query(item, function (err, res) {
				if (err)
					db_debugger(item + '[FAILED.]');
				else
					db_debugger(item + '[FILLED.]');
				db_debugger(res);
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
