var async = require('async');
var mysql = require('mysql');
var mysql_initializer = require('./mysql_initializer');
var mysql_config = require('../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

function getConnection() { //获取连接connection，并调用回调函数
	/*
	return mysql_initializer({
	 	no_create:true
	});
	*/
	return new Promise(function (resolve, reject) {
		let config = {
			host: mysql_config.host,
			user: mysql_config.user,
			password: mysql_config.password,
			database: mysql_config.database
		};
		let connection = mysql.createConnection(config);
		connection.connect(function (err) {
			if (err) {
				connection.end();
				reject(err);
			} else {
				resolve(connection);
			}
		});
	}).catch(function (rejected_reason) {
		logger.warn("Reinstall database...");
		logger.warn(rejected_reason);
		return mysql_initializer({
			no_create:false
		});
	})
}

function doSqlQuery(conn, sql) {           // 执行数据库命令
	if (typeof(sql) === 'undefined' || typeof(conn) === 'undefined') {
		return Promise.reject({
			status: 'FAILED.',
			details: 'The doSqlQuery() function called with zero/one parameter.'
		});
	}
	return new Promise(function (resolve, reject) {
		conn.query(sql, function (error, results, fields) {
			if (error) {
				logger.info(sql + '[FAILED.]');
				conn.end();
				reject(
					{
						sql: sql,
						status: 'FAILED.',
						results: undefined,
						details: error,
					});
			} else {
				logger.info(sql + '[FILLED.]');
				logger.info(results);
				resolve({
					conn: conn,
					sql_res: {sql: sql, status: 'SUCCESS.', results: results, details: undefined}
				});
			}
		});
	});
}

function doSqlQuerySequential(conn, sqls) {
	return new Promise(function (resolve, reject) {
		logger.info("START TO DO ", sqls);
		async.eachSeries(sqls, function (item, callback) {
			conn.query(item, function (err, res) {
				if (err)
					logger.info(item + '[FAILED.]');
				else
					logger.info(item + '[FILLED.]');
				logger.info(res);
				callback(err, res);
			});
		}, function (err, res) {
			if (err) {
				conn.end();
				reject({
					querys: sqls,
					results: undefined,
					status: 'FAILED',
					details: rejected_reason
				});
			} else {
				resolve({
					conn: conn,
					sql_res: {
						querys: sqls,
						results: res,
						status: 'SUCCESS.',
						details: undefined
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
