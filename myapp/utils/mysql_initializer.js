var mysql = require('mysql');
var mysql_config = require('../configures/db_configures');
var async = require('async');

var sqls = {
	'create_class_resources' : "CREATE TABLE IF NOT EXISTS `resources`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`resource` CHAR(20), " +
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,
	'create_class_table' : "CREATE TABLE IF NOT EXISTS `classes`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+ //用于唯一标识一个班级
		"`description` VARCHAR(500), " +
		"`notice` VARCHAR(500), "+ //班级公告
		"`title` VARCHAR(80) NOT NULL, "+ //班级名
		"`registration_date` TIMESTAMP, "+ //注册日期
		"`invitation_code` CHAR(40), "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

	'create_class_user_table' : "CREATE TABLE IF NOT EXISTS `classusers`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //班级id
		"`role` INT UNSIGNED NOT NULL, "+ //0表示学生，1表示助教，2表示老师
		"`userid` INT UNSIGNED NOT NULL,"+ //教师id
		"`registration_date` TIMESTAMP, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_user_table' : "CREATE TABLE IF NOT EXISTS `users`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+
		"`nickname` VARCHAR(40), "+
		"`realname` VARCHAR(40), "+
		"`role` INT UNSIGNED NOT NULL, "+
		"`motto` VARCHAR(200), "+
		"`registration_date` TIMESTAMP, "+
		"`password` CHAR(40) NOT NULL, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",
	'create_database' : 'CREATE DATABASE ' + mysql_config.database,
	'use_database' : 'USE ' + mysql_config.database,
}

function mysql_initializer(callback) { //倘若数据库不存在，则重新新建数据库
	var cfg = {
		host : mysql_config.host,
		user : mysql_config.user,
		password : mysql_config.password
	};
	var db_name = mysql_config.database;
	console.log(cfg);
	var conn = mysql.createConnection(cfg);
	conn.connect(function(err) {
		if (err) {
			console.log("Cannot create connection!");
			console.log(err);
			return;
		}
		var tasks = ['create_database', 'use_database', 'create_user_table', 'create_class_table', 'create_class_user_table', 'create_class_resources'];
		async.eachSeries(tasks, function (item, callback) {
			console.log(item + " ==> " + sqls[item]);
			conn.query(sqls[item], function (err, res) {
				console.log(res);
				callback(err, res);
			});
		}, function (err,res) {
			console.log("err: " + err);
			console.log("res: " + res);
			callback(conn);
		});
	});
}

module.exports = mysql_initializer
